
import React, { useState } from 'react';
import { Settings, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginTitleSettings {
  title: string;
  fontSize: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  fontFamily: string;
  fontWeight: string;
  showLogo: boolean;
  logoUrl: string;
  logoSize: string;
  companyName: string;
  subtitle: string;
}

interface LoginTitleCustomizerProps {
  settings: LoginTitleSettings;
  onUpdate: (settings: LoginTitleSettings) => void;
}

const LoginTitleCustomizer = ({ settings, onUpdate }: LoginTitleCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    setIsOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLocalSettings({ ...localSettings, logoUrl: result, showLogo: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLocalSettings({ ...localSettings, logoUrl: '', showLogo: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Kustomisasi Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kustomisasi Tampilan Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nama Perusahaan</Label>
                <Input
                  id="companyName"
                  value={localSettings.companyName}
                  onChange={(e) => setLocalSettings({ ...localSettings, companyName: e.target.value })}
                  placeholder="Masukkan nama perusahaan"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={localSettings.subtitle}
                  onChange={(e) => setLocalSettings({ ...localSettings, subtitle: e.target.value })}
                  placeholder="Masukkan subtitle"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Logo Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo-upload">Upload Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
              
              {localSettings.logoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Preview Logo</Label>
                    <Button variant="ghost" size="sm" onClick={removeLogo}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 flex justify-center">
                    <img 
                      src={localSettings.logoUrl} 
                      alt="Logo preview" 
                      className={`${localSettings.logoSize} object-contain`}
                    />
                  </div>
                  <div>
                    <Label>Ukuran Logo</Label>
                    <Select 
                      value={localSettings.logoSize} 
                      onValueChange={(value) => setLocalSettings({ ...localSettings, logoSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h-8 w-8">Kecil (32px)</SelectItem>
                        <SelectItem value="h-12 w-12">Sedang (48px)</SelectItem>
                        <SelectItem value="h-16 w-16">Besar (64px)</SelectItem>
                        <SelectItem value="h-20 w-20">Sangat Besar (80px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Title Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pengaturan Judul</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Login</Label>
                <Input
                  id="title"
                  value={localSettings.title}
                  onChange={(e) => setLocalSettings({ ...localSettings, title: e.target.value })}
                  placeholder="Masukkan judul"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ukuran Font</Label>
                  <Select 
                    value={localSettings.fontSize} 
                    onValueChange={(value) => setLocalSettings({ ...localSettings, fontSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-lg">Kecil</SelectItem>
                      <SelectItem value="text-xl">Sedang</SelectItem>
                      <SelectItem value="text-2xl">Besar</SelectItem>
                      <SelectItem value="text-3xl">Sangat Besar</SelectItem>
                      <SelectItem value="text-4xl">Extra Besar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ketebalan Font</Label>
                  <Select 
                    value={localSettings.fontWeight} 
                    onValueChange={(value) => setLocalSettings({ ...localSettings, fontWeight: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="font-light">Tipis</SelectItem>
                      <SelectItem value="font-normal">Normal</SelectItem>
                      <SelectItem value="font-medium">Medium</SelectItem>
                      <SelectItem value="font-semibold">Semi Bold</SelectItem>
                      <SelectItem value="font-bold">Bold</SelectItem>
                      <SelectItem value="font-extrabold">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Family</Label>
                  <Select 
                    value={localSettings.fontFamily} 
                    onValueChange={(value) => setLocalSettings({ ...localSettings, fontFamily: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="font-sans">Sans Serif</SelectItem>
                      <SelectItem value="font-serif">Serif</SelectItem>
                      <SelectItem value="font-mono">Monospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Posisi</Label>
                  <Select 
                    value={localSettings.alignment} 
                    onValueChange={(value: 'left' | 'center' | 'right') => setLocalSettings({ ...localSettings, alignment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Kiri</SelectItem>
                      <SelectItem value="center">Tengah</SelectItem>
                      <SelectItem value="right">Kanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Warna</Label>
                <Select 
                  value={localSettings.color} 
                  onValueChange={(value) => setLocalSettings({ ...localSettings, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-primary">Primary</SelectItem>
                    <SelectItem value="text-blue-600">Biru</SelectItem>
                    <SelectItem value="text-red-600">Merah</SelectItem>
                    <SelectItem value="text-green-600">Hijau</SelectItem>
                    <SelectItem value="text-purple-600">Ungu</SelectItem>
                    <SelectItem value="text-orange-600">Orange</SelectItem>
                    <SelectItem value="text-gray-800">Abu-abu Gelap</SelectItem>
                    <SelectItem value="text-black">Hitam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginTitleCustomizer;
