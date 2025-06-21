import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Plus, Edit, Trash2, GripVertical, ChevronRight, ChevronDown, Move } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  editable?: boolean;
  children?: MenuItem[];
  order?: number;
  parentId?: string;
}

interface HierarchicalMenuEditorProps {
  menuItems: MenuItem[];
  onUpdateMenuItem: (id: string, label: string, icon: string) => void;
  onAddMenuItem: (newItem: { id: string; label: string; icon: string }) => void;
  onRemoveMenuItem: (id: string) => void;
  onUpdateMenuStructure?: (settings: any) => void;
}

const HierarchicalMenuEditor = ({ 
  menuItems, 
  onUpdateMenuItem, 
  onAddMenuItem, 
  onRemoveMenuItem,
  onUpdateMenuStructure 
}: HierarchicalMenuEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ id: '', label: '', icon: 'BarChart3', parentId: 'none' });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);

  // Sync local state with props
  useEffect(() => {
    setLocalMenuItems(menuItems);
  }, [menuItems]);

  const iconOptions = [
    'BarChart3', 'Database', 'Plus', 'Upload', 'Download', 'Users', 
    'Settings', 'FileText', 'Calendar', 'Mail', 'Bell', 'Home',
    'Archive', 'MessageSquare', 'Shield', 'Palette'
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const buildHierarchicalMenu = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    items.forEach(item => {
      const menuItem = itemMap.get(item.id)!;
      
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(menuItem);
      } else {
        rootItems.push(menuItem);
      }
    });

    const sortByOrder = (items: MenuItem[]) => {
      return items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => ({
        ...item,
        children: item.children ? sortByOrder(item.children) : undefined
      }));
    };

    return sortByOrder(rootItems);
  };

  const flattenMenu = (items: MenuItem[]): MenuItem[] => {
    const flattened: MenuItem[] = [];
    
    const flatten = (items: MenuItem[], parentId?: string) => {
      items.forEach((item, index) => {
        flattened.push({
          ...item,
          parentId,
          order: index + 1
        });
        
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.id);
        }
      });
    };
    
    flatten(items);
    return flattened;
  };

  const hierarchicalItems = buildHierarchicalMenu(localMenuItems);

  const handleEditSave = () => {
    if (editingItem && editingItem.label.trim()) {
      onUpdateMenuItem(editingItem.id, editingItem.label, editingItem.icon);
      
      setLocalMenuItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...item, label: editingItem.label, icon: editingItem.icon }
            : item
        )
      );
      
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success('Menu berhasil diupdate!');
    }
  };

  const handleAddSave = () => {
    console.log('Adding new menu item:', newMenuItem);
    
    if (!newMenuItem.id.trim() || !newMenuItem.label.trim()) {
      toast.error('ID dan Label menu harus diisi!');
      return;
    }
    
    if (localMenuItems.some(item => item.id === newMenuItem.id)) {
      toast.error('ID menu sudah ada!');
      return;
    }
    
    const parentId = newMenuItem.parentId === 'none' ? undefined : newMenuItem.parentId;
    
    const newItem = {
      id: newMenuItem.id,
      label: newMenuItem.label,
      icon: newMenuItem.icon,
      parentId: parentId,
      order: localMenuItems.filter(item => item.parentId === parentId).length + 1,
      editable: true
    };
    
    console.log('Created new item:', newItem);
    
    // Call the parent callback first
    onAddMenuItem(newItem);
    
    // Update local state
    setLocalMenuItems(prev => [...prev, newItem]);
    
    // Reset form and close dialog
    setIsAddDialogOpen(false);
    setNewMenuItem({ id: '', label: '', icon: 'BarChart3', parentId: 'none' });
    toast.success('Menu baru berhasil ditambahkan!');
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini? Semua submenu akan ikut terhapus.')) {
      const removeItemAndChildren = (itemId: string) => {
        const children = localMenuItems.filter(item => item.parentId === itemId);
        children.forEach(child => removeItemAndChildren(child.id));
        onRemoveMenuItem(itemId);
      };
      
      removeItemAndChildren(id);
      setLocalMenuItems(prev => prev.filter(item => item.id !== id && item.parentId !== id));
      toast.success('Menu berhasil dihapus!');
    }
  };

  const handleDragStart = (item: MenuItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetItem: MenuItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;
    
    const isChild = (parentId: string, childId: string): boolean => {
      const item = localMenuItems.find(i => i.id === childId);
      if (!item) return false;
      if (item.parentId === parentId) return true;
      if (item.parentId) return isChild(parentId, item.parentId);
      return false;
    };
    
    if (isChild(draggedItem.id, targetItem.id)) {
      toast.error('Tidak bisa memindahkan parent ke dalam child-nya sendiri!');
      return;
    }
    
    setLocalMenuItems(prev => 
      prev.map(item => 
        item.id === draggedItem.id 
          ? { ...item, parentId: targetItem.id }
          : item
      )
    );
    
    toast.success(`Menu "${draggedItem.label}" dipindahkan ke dalam "${targetItem.label}"`);
    setDraggedItem(null);
  };

  const handleMakeRoot = (item: MenuItem) => {
    setLocalMenuItems(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, parentId: undefined }
          : i
      )
    );
    toast.success(`Menu "${item.label}" dijadikan menu utama`);
  };

  const renderHierarchicalItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    
    return (
      <div key={item.id} className="w-full">
        <Card className="mb-2">
          <CardContent className="p-3">
            <div 
              className="flex items-center justify-between"
              style={{ paddingLeft: `${level * 20}px` }}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(item)}
            >
              <div className="flex items-center gap-3 flex-1">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                
                {hasChildren ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(item.id)}
                    className="p-0 h-6 w-6"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  <div className="w-6 h-6" />
                )}
                
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs">{item.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-muted-foreground">ID: {item.id}</div>
                  {item.parentId && (
                    <div className="text-xs text-blue-600">Parent: {item.parentId}</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                {item.parentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMakeRoot(item)}
                    title="Jadikan menu utama"
                  >
                    <Move className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingItem({ ...item });
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {item.editable && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children!.map(child => renderHierarchicalItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const saveMenuStructure = () => {
    if (onUpdateMenuStructure) {
      const flattenedItems = flattenMenu(hierarchicalItems);
      onUpdateMenuStructure({
        appTitle: 'Sistem Manajemen Data',
        primaryColor: 'blue',
        backgroundColor: 'white',
        navbarStyle: 'default',
        menuItems: flattenedItems
      });
      toast.success('Struktur menu berhasil disimpan!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Menu Hierarki
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor Menu Hierarki</DialogTitle>
          <DialogDescription>
            Kelola menu bertingkat dengan drag & drop. Tarik menu untuk memindahkan ke parent lain.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Struktur Menu</h3>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Menu
              </Button>
              <Button variant="outline" onClick={saveMenuStructure}>
                Simpan Struktur
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-3">
              💡 Tips: Tarik menu ke menu lain untuk menjadikannya submenu. Klik ikon panah untuk expand/collapse.
            </div>
            
            <div className="space-y-2">
              {hierarchicalItems.map(item => renderHierarchicalItem(item))}
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-label">Label Menu</Label>
                  <Input
                    id="edit-label"
                    value={editingItem.label}
                    onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                    placeholder="Masukkan label menu"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Icon</Label>
                  <Select
                    value={editingItem.icon}
                    onValueChange={(value) => setEditingItem({ ...editingItem, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Menu Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-id">ID Menu</Label>
                <Input
                  id="new-id"
                  value={newMenuItem.id}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, id: e.target.value })}
                  placeholder="contoh: analytics"
                />
              </div>
              <div>
                <Label htmlFor="new-label">Label Menu</Label>
                <Input
                  id="new-label"
                  value={newMenuItem.label}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, label: e.target.value })}
                  placeholder="Masukkan label menu"
                />
              </div>
              <div>
                <Label htmlFor="new-icon">Icon</Label>
                <Select
                  value={newMenuItem.icon}
                  onValueChange={(value) => setNewMenuItem({ ...newMenuItem, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-parent">Parent Menu (Opsional)</Label>
                <Select
                  value={newMenuItem.parentId}
                  onValueChange={(value) => {
                    console.log('Parent selection changed to:', value);
                    setNewMenuItem({ ...newMenuItem, parentId: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih parent menu atau kosongkan untuk menu utama" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Menu Utama (Tidak ada parent)</SelectItem>
                    {localMenuItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddSave}>Tambah</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default HierarchicalMenuEditor;
