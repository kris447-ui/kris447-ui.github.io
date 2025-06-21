
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { LoginSettings } from '@/types/app';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

const LoginCustomizer = () => {
  const [settings, setSettings] = useState<LoginSettings>({
    title: 'Login Sistem',
    subtitle: 'Masukkan kredensial Anda untuk mengakses sistem',
    logoUrl: '',
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    fontFamily: 'font-sans',
    fontSize: 'text-3xl',
    titleColor: 'text-primary',
    subtitleColor: 'text-muted-foreground',
    alignment: 'center',
    fontWeight: 'font-bold',
    showLogo: false,
    logoSize: 'h-12 w-12',
    companyName: ''
  });

  const handleSave = () => {
    // In a real app, this would save to backend or local storage
    localStorage.setItem('loginSettings', JSON.stringify(settings));
    toast.success('Pengaturan login berhasil disimpan!');
  };

  const handleReset = () => {
    setSettings({
      title: 'Login Sistem',
      subtitle: 'Masukkan kredensial Anda untuk mengakses sistem',
      logoUrl: '',
      backgroundColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      fontFamily: 'font-sans',
      fontSize: 'text-3xl',
      titleColor: 'text-primary',
      subtitleColor: 'text-muted-foreground',
      alignment: 'center',
      fontWeight: 'font-bold',
      showLogo: false,
      logoSize: 'h-12 w-12',
      companyName: ''
    });
    toast.success('Pengaturan direset ke default!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Kustomisasi Halaman Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Login</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Login Sistem"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={settings.subtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Masukkan kredensial Anda"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="companyName">Nama Perusahaan</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="PT. Contoh Perusahaan"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showLogo"
                  checked={settings.showLogo}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showLogo: checked }))}
                />
                <Label htmlFor="showLogo">Tampilkan Logo</Label>
              </div>

              {settings.showLogo && (
                <div>
                  <Label htmlFor="logoUrl">URL Logo</Label>
                  <Input
                    id="logoUrl"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fontSize">Ukuran Font Judul</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-xl">Small (XL)</SelectItem>
                    <SelectItem value="text-2xl">Medium (2XL)</SelectItem>
                    <SelectItem value="text-3xl">Large (3XL)</SelectItem>
                    <SelectItem value="text-4xl">Extra Large (4XL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fontWeight">Ketebalan Font</Label>
                <Select
                  value={settings.fontWeight}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, fontWeight: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="font-normal">Normal</SelectItem>
                    <SelectItem value="font-medium">Medium</SelectItem>
                    <SelectItem value="font-semibold">Semi Bold</SelectItem>
                    <SelectItem value="font-bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="alignment">Alignment Teks</Label>
                <Select
                  value={settings.alignment}
                  onValueChange={(value: 'left' | 'center' | 'right') => setSettings(prev => ({ ...prev, alignment: value }))}
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

              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}
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

              {settings.showLogo && (
                <div>
                  <Label htmlFor="logoSize">Ukuran Logo</Label>
                  <Select
                    value={settings.logoSize}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, logoSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h-8 w-8">Small (32px)</SelectItem>
                      <SelectItem value="h-12 w-12">Medium (48px)</SelectItem>
                      <SelectItem value="h-16 w-16">Large (64px)</SelectItem>
                      <SelectItem value="h-20 w-20">Extra Large (80px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              Simpan Pengaturan
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset ke Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginCustomizer;
