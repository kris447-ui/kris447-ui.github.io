
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ReportSettings {
  title: string;
  fontSize: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  leftSignature: {
    title: string;
    name: string;
  };
  rightSignature: {
    title: string;
    name: string;
  };
}

interface ReportCustomizationDialogProps {
  settings: ReportSettings;
  onUpdate: (settings: ReportSettings) => void;
}

const ReportCustomizationDialog = ({ settings, onUpdate }: ReportCustomizationDialogProps) => {
  const [localSettings, setLocalSettings] = useState<ReportSettings>(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onUpdate(localSettings);
    setIsOpen(false);
  };

  const alignmentOptions = [
    { value: 'left', label: 'Kiri' },
    { value: 'center', label: 'Tengah' },
    { value: 'right', label: 'Kanan' }
  ];

  const fontSizeOptions = [
    { value: '16px', label: 'Kecil' },
    { value: '18px', label: 'Normal' },
    { value: '20px', label: 'Besar' },
    { value: '24px', label: 'Sangat Besar' }
  ];

  const colorOptions = [
    { value: '#000000', label: 'Hitam' },
    { value: '#1f2937', label: 'Abu-abu Gelap' },
    { value: '#2563eb', label: 'Biru' },
    { value: '#16a34a', label: 'Hijau' },
    { value: '#dc2626', label: 'Merah' },
    { value: '#7c3aed', label: 'Ungu' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Atur Laporan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pengaturan Laporan</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Title Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pengaturan Judul</h3>
            <div>
              <Label htmlFor="reportTitle">Judul Laporan</Label>
              <Input
                id="reportTitle"
                value={localSettings.title}
                onChange={(e) => setLocalSettings({ ...localSettings, title: e.target.value })}
                placeholder="SISTEM MANAJEMEN DATA PENGADAAN"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fontSize">Ukuran Font</Label>
                <Select
                  value={localSettings.fontSize}
                  onValueChange={(value) => setLocalSettings({ ...localSettings, fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Warna</Label>
                <Select
                  value={localSettings.color}
                  onValueChange={(value) => setLocalSettings({ ...localSettings, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="alignment">Posisi</Label>
                <Select
                  value={localSettings.alignment}
                  onValueChange={(value: 'left' | 'center' | 'right') => 
                    setLocalSettings({ ...localSettings, alignment: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Signature Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pengaturan Tanda Tangan</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Tanda Tangan Kiri</h4>
                <div>
                  <Label>Jabatan</Label>
                  <Input
                    value={localSettings.leftSignature.title}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      leftSignature: { ...localSettings.leftSignature, title: e.target.value }
                    })}
                    placeholder="Mengetahui,"
                  />
                </div>
                <div>
                  <Label>Nama/Posisi</Label>
                  <Input
                    value={localSettings.leftSignature.name}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      leftSignature: { ...localSettings.leftSignature, name: e.target.value }
                    })}
                    placeholder="Kepala Bagian"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Tanda Tangan Kanan</h4>
                <div>
                  <Label>Jabatan</Label>
                  <Input
                    value={localSettings.rightSignature.title}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      rightSignature: { ...localSettings.rightSignature, title: e.target.value }
                    })}
                    placeholder="Dibuat oleh,"
                  />
                </div>
                <div>
                  <Label>Nama/Posisi</Label>
                  <Input
                    value={localSettings.rightSignature.name}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      rightSignature: { ...localSettings.rightSignature, name: e.target.value }
                    })}
                    placeholder="Administrator"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportCustomizationDialog;
