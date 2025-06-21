
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Printer } from 'lucide-react';

interface DataItem {
  id: number;
  namaPengadaan: string;
  noTglKep: string;
  noTglKontrak: string;
  jukminJusik: string;
  namaPerusahaan: string;
  bekal: string;
  proses: string;
  tipeData: string;
  dataPdf: string;
}

interface PrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: DataItem[];
  onPrint: (filteredData: DataItem[], title: string, filterDescription: string) => void;
}

const PrintDialog = ({ isOpen, onClose, data, onPrint }: PrintDialogProps) => {
  const [filterType, setFilterType] = useState<'all' | 'KD' | 'KP'>('all');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [includeAllStatuses, setIncludeAllStatuses] = useState(true);

  const statusOptions = ['Perencanaan', 'Berjalan', 'Selesai'];

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilter([...statusFilter, status]);
    } else {
      setStatusFilter(statusFilter.filter(s => s !== status));
    }
    setIncludeAllStatuses(false);
  };

  const handleAllStatusesChange = (checked: boolean) => {
    setIncludeAllStatuses(checked);
    if (checked) {
      setStatusFilter([]);
    }
  };

  const getFilteredData = () => {
    let filtered = data;

    // Filter by document type (KD/KP)
    if (filterType !== 'all') {
      filtered = filtered.filter(item => {
        if (filterType === 'KD') {
          return item.noTglKep.toLowerCase().includes('kd') || item.noTglKontrak.toLowerCase().includes('kd');
        } else if (filterType === 'KP') {
          return item.noTglKep.toLowerCase().includes('kp') || item.noTglKontrak.toLowerCase().includes('kp');
        }
        return true;
      });
    }

    // Filter by status
    if (!includeAllStatuses && statusFilter.length > 0) {
      filtered = filtered.filter(item => statusFilter.includes(item.proses));
    }

    return filtered;
  };

  const getFilterDescription = () => {
    const parts = [];
    
    if (filterType === 'KD') {
      parts.push('Dokumen KD (Keputusan)');
    } else if (filterType === 'KP') {
      parts.push('Dokumen KP (Kontrak Pengadaan)');
    } else {
      parts.push('Semua Dokumen');
    }

    if (!includeAllStatuses && statusFilter.length > 0) {
      parts.push(`Status: ${statusFilter.join(', ')}`);
    } else {
      parts.push('Semua Status');
    }

    return parts.join(' - ');
  };

  const handlePrint = () => {
    const filteredData = getFilteredData();
    const title = `LAPORAN DATA PENGADAAN`;
    const filterDescription = getFilterDescription();
    
    onPrint(filteredData, title, filterDescription);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Cetak Laporan Data
          </DialogTitle>
          <DialogDescription>
            Pilih filter yang diinginkan untuk mencetak laporan data pengadaan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="document-type">Jenis Dokumen</Label>
            <Select value={filterType} onValueChange={(value: 'all' | 'KD' | 'KP') => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Dokumen</SelectItem>
                <SelectItem value="KD">KD (Keputusan) Saja</SelectItem>
                <SelectItem value="KP">KP (Kontrak Pengadaan) Saja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Filter Status Proses</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-statuses"
                  checked={includeAllStatuses}
                  onCheckedChange={handleAllStatusesChange}
                />
                <Label htmlFor="all-statuses" className="font-medium">
                  Semua Status
                </Label>
              </div>
              
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={includeAllStatuses || statusFilter.includes(status)}
                    disabled={includeAllStatuses}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={`status-${status}`}>
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm">
              <strong>Preview:</strong>
              <br />
              {getFilterDescription()}
              <br />
              <span className="text-muted-foreground">
                Total data yang akan dicetak: {getFilteredData().length} item
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Cetak Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintDialog;
