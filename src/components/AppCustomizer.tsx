
import React, { useState } from 'react';
import { Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppSettings {
  appTitle: string;
  primaryColor: string;
  backgroundColor: string;
  navbarStyle: string;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface AppCustomizerProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const AppCustomizer = ({ settings, onUpdate }: AppCustomizerProps) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onUpdate(localSettings);
    setIsOpen(false);
  };

  const colorOptions = [
    { value: 'blue', label: 'Biru', class: 'bg-blue-500' },
    { value: 'green', label: 'Hijau', class: 'bg-green-500' },
    { value: 'purple', label: 'Ungu', class: 'bg-purple-500' },
    { value: 'red', label: 'Merah', class: 'bg-red-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' }
  ];

  const backgroundOptions = [
    { value: 'white', label: 'Putih', class: 'bg-white' },
    { value: 'gray-50', label: 'Abu-abu Terang', class: 'bg-gray-50' },
    { value: 'blue-50', label: 'Biru Terang', class: 'bg-blue-50' },
    { value: 'green-50', label: 'Hijau Terang', class: 'bg-green-50' },
    { value: 'purple-50', label: 'Ungu Terang', class: 'bg-purple-50' }
  ];

  const navbarStyleOptions = [
    { value: 'default', label: 'Default (Putih)' },
    { value: 'dark', label: 'Gelap' },
    { value: 'colored', label: 'Berwarna (Sesuai Primary)' },
    { value: 'transparent', label: 'Transparan' }
  ];

  const updateMenuItem = (index: number, field: 'label' | 'icon', value: string) => {
    const updatedItems = [...localSettings.menuItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setLocalSettings({ ...localSettings, menuItems: updatedItems });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Palette className="h-4 w-4" />
          <span>Kustomisasi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kustomisasi Aplikasi</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="colors">Warna</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="appTitle">Judul Aplikasi</Label>
              <Input
                id="appTitle"
                value={localSettings.appTitle}
                onChange={(e) => setLocalSettings({ ...localSettings, appTitle: e.target.value })}
                placeholder="Masukkan judul aplikasi"
              />
            </div>
            
            <div>
              <Label htmlFor="navbarStyle">Gaya Navbar</Label>
              <Select
                value={localSettings.navbarStyle}
                onValueChange={(value) => setLocalSettings({ ...localSettings, navbarStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {navbarStyleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-4">
            <div>
              <Label htmlFor="primaryColor">Warna Utama</Label>
              <Select
                value={localSettings.primaryColor}
                onValueChange={(value) => setLocalSettings({ ...localSettings, primaryColor: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${option.class}`}></div>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="backgroundColor">Warna Latar Belakang</Label>
              <Select
                value={localSettings.backgroundColor}
                onValueChange={(value) => setLocalSettings({ ...localSettings, backgroundColor: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgroundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full border ${option.class}`}></div>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Card>
              <CardContent className="pt-4">
                <Label className="text-sm font-medium">Preview Warna:</Label>
                <div className="mt-2 p-4 rounded-lg" style={{
                  backgroundColor: `var(--${localSettings.backgroundColor.replace('-', '-')})`,
                  border: '1px solid #e5e7eb'
                }}>
                  <div 
                    className={`inline-block px-4 py-2 rounded text-white bg-${localSettings.primaryColor}-500`}
                  >
                    Contoh Button
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="menu" className="space-y-4">
            <Label className="text-sm font-medium">Atur Menu Navbar</Label>
            <div className="space-y-3">
              {localSettings.menuItems.map((item, index) => (
                <Card key={item.id} className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`menu-label-${index}`} className="text-xs">Label Menu</Label>
                      <Input
                        id={`menu-label-${index}`}
                        value={item.label}
                        onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                        placeholder="Nama menu"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`menu-icon-${index}`} className="text-xs">Ikon (Lucide)</Label>
                      <Input
                        id={`menu-icon-${index}`}
                        value={item.icon}
                        onChange={(e) => updateMenuItem(index, 'icon', e.target.value)}
                        placeholder="Nama ikon"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            Terapkan Perubahan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppCustomizer;
