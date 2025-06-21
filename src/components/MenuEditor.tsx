import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  editable?: boolean;
}

interface MenuEditorProps {
  menuItems: MenuItem[];
  onUpdateMenuItem: (id: string, label: string, icon: string) => void;
  onAddMenuItem: (newItem: { id: string; label: string; icon: string }) => void;
  onRemoveMenuItem: (id: string) => void;
}

const MenuEditor = ({ menuItems, onUpdateMenuItem, onAddMenuItem, onRemoveMenuItem }: MenuEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ id: '', label: '', icon: 'BarChart3' });

  const iconOptions = [
    'BarChart3', 'Database', 'Plus', 'Upload', 'Download', 'Users', 
    'Settings', 'FileText', 'Calendar', 'Mail', 'Bell', 'Home',
    'Archive', 'MessageSquare', 'Shield', 'Palette'
  ];

  const handleEditSave = () => {
    if (editingItem && editingItem.label.trim()) {
      onUpdateMenuItem(editingItem.id, editingItem.label, editingItem.icon);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success('Menu berhasil diupdate!');
    }
  };

  const handleAddSave = () => {
    if (newMenuItem.id.trim() && newMenuItem.label.trim()) {
      // Check if ID already exists
      if (menuItems.some(item => item.id === newMenuItem.id)) {
        toast.error('ID menu sudah ada!');
        return;
      }
      
      onAddMenuItem(newMenuItem);
      setIsAddDialogOpen(false);
      setNewMenuItem({ id: '', label: '', icon: 'BarChart3' });
      toast.success('Menu baru berhasil ditambahkan!');
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      onRemoveMenuItem(id);
      toast.success('Menu berhasil dihapus!');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Edit Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor Menu Dashboard</DialogTitle>
          <DialogDescription>
            Kelola menu yang tersedia di dashboard. Anda dapat menambah, edit, atau hapus menu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Daftar Menu</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onAddMenuItem({ id: 'login-settings', label: 'Pengaturan Login', icon: 'Palette' });
                  toast.success('Menu Pengaturan Login ditambahkan!');
                }}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                + Login Settings
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Menu
              </Button>
            </div>
          </div>
          
          <div className="grid gap-3">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs">{item.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">ID: {item.id}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>

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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddSave}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default MenuEditor;
