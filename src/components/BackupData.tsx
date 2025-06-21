
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download, Upload, Settings, Clock, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { DataItem, BackupSettings } from '@/types/app';

interface BackupDataProps {
  data: DataItem[];
}

const BackupData = ({ data }: BackupDataProps) => {
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackupEnabled: false,
    backupInterval: 'daily',
    maxBackups: 10,
  });

  const handleManualBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      data: data,
      version: '1.0',
      totalRecords: data.length
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Backup berhasil diunduh!');
  };

  const handleAutoBackupToggle = (enabled: boolean) => {
    setBackupSettings(prev => ({ ...prev, autoBackupEnabled: enabled }));
    toast.success(enabled ? 'Auto backup diaktifkan' : 'Auto backup dinonaktifkan');
  };

  const handleSettingsChange = (key: keyof BackupSettings, value: any) => {
    setBackupSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Backup Data Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Unduh semua data pengadaan sebagai file backup untuk keamanan data.
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={handleManualBackup} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Backup ({data.length} records)
            </Button>
            <div className="text-sm text-muted-foreground">
              Format: JSON | Ukuran: ~{(JSON.stringify(data).length / 1024).toFixed(1)}KB
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Backup Otomatis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Aktifkan Backup Otomatis</Label>
              <p className="text-sm text-muted-foreground">
                Backup data secara otomatis sesuai interval yang dipilih
              </p>
            </div>
            <Switch
              checked={backupSettings.autoBackupEnabled}
              onCheckedChange={handleAutoBackupToggle}
            />
          </div>

          {backupSettings.autoBackupEnabled && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interval Backup</Label>
                  <Select
                    value={backupSettings.backupInterval}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                      handleSettingsChange('backupInterval', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Maksimal Backup Tersimpan</Label>
                  <Input
                    type="number"
                    value={backupSettings.maxBackups}
                    onChange={(e) => handleSettingsChange('maxBackups', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {backupSettings.lastBackupDate 
                  ? `Backup terakhir: ${backupSettings.lastBackupDate.toLocaleDateString('id-ID')}`
                  : 'Belum ada backup otomatis'
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupData;
