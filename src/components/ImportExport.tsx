
import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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

interface ImportExportProps {
  data: DataItem[];
  onImport: (data: DataItem[]) => void;
  activeFeature: 'import' | 'export';
}

const ImportExport = ({ data, onImport, activeFeature }: ImportExportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Nama Pengadaan', 'No dan Tgl Kep', 'No dan Tgl Kontrak', 'Jukmin Jusik', 'Nama Perusahaan', 'Bekal', 'Proses', 'Tipe Data', 'Data PDF'],
      ...data.map(item => [
        item.id.toString(),
        item.namaPengadaan,
        item.noTglKep,
        item.noTglKontrak,
        item.jukminJusik,
        item.namaPerusahaan,
        item.bekal,
        item.proses,
        item.tipeData,
        item.dataPdf
      ])
    ]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_pengadaan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Data pengadaan berhasil diekspor!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      const importedData: DataItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
          if (values.length >= 10) {
            importedData.push({
              id: parseInt(values[0]) || Date.now() + i,
              namaPengadaan: values[1] || '',
              noTglKep: values[2] || '',
              noTglKontrak: values[3] || '',
              jukminJusik: values[4] || '',
              namaPerusahaan: values[5] || '',
              bekal: values[6] || '',
              proses: values[7] || '',
              tipeData: values[8] || '',
              dataPdf: values[9] || ''
            });
          }
        }
      }
      
      if (importedData.length > 0) {
        onImport(importedData);
        toast.success(`Berhasil mengimpor ${importedData.length} data pengadaan!`);
      } else {
        toast.error('Tidak ada data valid yang ditemukan dalam file!');
      }
    };
    
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {activeFeature === 'export' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Export Data Pengadaan
            </CardTitle>
            <CardDescription>
              Unduh data pengadaan dalam format CSV untuk backup atau analisis lebih lanjut.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Total data pengadaan yang akan diekspor: <strong>{data.length} item</strong>
              </p>
              <Button onClick={handleExport} className="w-full" disabled={data.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeFeature === 'import' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Import Data Pengadaan
            </CardTitle>
            <CardDescription>
              Upload file CSV untuk menambahkan data pengadaan dalam jumlah besar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-4">
                  Pilih file CSV atau drag & drop di sini
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Pilih File CSV
                </Button>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Format CSV yang didukung:</strong></p>
                <p>ID, Nama Pengadaan, No dan Tgl Kep, No dan Tgl Kontrak, Jukmin Jusik, Nama Perusahaan, Bekal, Proses, Tipe Data, Data PDF</p>
                <p>Contoh: 1, "Pengadaan ATK", "KEP/001/2024 - 15 Jan", "KONT/001/2024 - 20 Jan", "Jukmin A / Jusik B", "PT Maju Jaya", "ATK", "Selesai", "Dokumen", "pengadaan_001.pdf"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImportExport;
