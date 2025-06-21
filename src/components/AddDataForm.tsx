
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import PDFUploadPreview from './PDFUploadPreview';

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

interface AddDataFormProps {
  onAdd: (item: Omit<DataItem, 'id'>) => void;
}

const AddDataForm = ({ onAdd }: AddDataFormProps) => {
  const [formData, setFormData] = useState({
    namaPengadaan: '',
    noTglKep: '',
    noTglKontrak: '',
    jukminJusik: '',
    namaPerusahaan: '',
    bekal: '',
    proses: '',
    tipeData: '',
    dataPdf: '',
  });

  // Enhanced process options with automatic percentage calculation
  const processOptions = [
    { value: 'Lelang', percentage: '0%', description: 'Tahap awal lelang' },
    { value: 'Kontrak', percentage: '25%', description: 'Kontrak disepakati' },
    { value: 'PC', percentage: '35%', description: 'Pre-construction meeting' },
    { value: 'Komisi', percentage: '70%', description: 'Proses komisi' },
    { value: 'Penagihan', percentage: '80%', description: 'Tahap penagihan' },
    { value: 'Selesai', percentage: '100%', description: 'Proyek selesai' }
  ];

  // Updated tipe data options
  const tipeDataOptions = [
    { value: 'KD', label: 'KD (Kewenangan Daerah)', description: 'Pengadaan kewenangan daerah' },
    { value: 'KP', label: 'KP (Kewenangan Pusat)', description: 'Pengadaan kewenangan pusat' },
    { value: 'Kemhan', label: 'Kemhan (Kementerian Pertahanan)', description: 'Pengadaan pertahanan' }
  ];

  const getJukminJusikFromProcess = (process: string): string => {
    const option = processOptions.find(opt => opt.value === process);
    return option ? `${process} ${option.percentage}` : process;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.namaPengadaan || !formData.namaPerusahaan || !formData.proses) {
      toast.error('Harap isi field yang wajib diisi!');
      return;
    }

    // Auto-update jukminJusik based on proses
    const finalFormData = {
      ...formData,
      jukminJusik: getJukminJusikFromProcess(formData.proses)
    };

    onAdd(finalFormData);
    setFormData({
      namaPengadaan: '',
      noTglKep: '',
      noTglKontrak: '',
      jukminJusik: '',
      namaPerusahaan: '',
      bekal: '',
      proses: '',
      tipeData: '',
      dataPdf: '',
    });
    toast.success('Data pengadaan berhasil ditambahkan!');
  };

  const handlePDFChange = (fileName: string) => {
    setFormData({ ...formData, dataPdf: fileName });
  };

  const handlePDFRemove = () => {
    setFormData({ ...formData, dataPdf: '' });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Tambah Data Pengadaan</CardTitle>
        <CardDescription>
          Masukkan informasi data pengadaan baru ke dalam sistem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="namaPengadaan">Nama Pengadaan *</Label>
              <Input
                id="namaPengadaan"
                value={formData.namaPengadaan}
                onChange={(e) => setFormData({ ...formData, namaPengadaan: e.target.value })}
                placeholder="Masukkan nama pengadaan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="namaPerusahaan">Nama Perusahaan *</Label>
              <Input
                id="namaPerusahaan"
                value={formData.namaPerusahaan}
                onChange={(e) => setFormData({ ...formData, namaPerusahaan: e.target.value })}
                placeholder="Masukkan nama perusahaan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noTglKep">No dan Tgl Keputusan</Label>
              <Input
                id="noTglKep"
                value={formData.noTglKep}
                onChange={(e) => setFormData({ ...formData, noTglKep: e.target.value })}
                placeholder="KEP/001/2024 - 15 Jan 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noTglKontrak">No dan Tgl Kontrak</Label>
              <Input
                id="noTglKontrak"
                value={formData.noTglKontrak}
                onChange={(e) => setFormData({ ...formData, noTglKontrak: e.target.value })}
                placeholder="KONT/001/2024 - 20 Jan 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bekal">Bekal</Label>
              <Input
                id="bekal"
                value={formData.bekal}
                onChange={(e) => setFormData({ ...formData, bekal: e.target.value })}
                placeholder="Masukkan jenis bekal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proses">Proses *</Label>
              <Select
                value={formData.proses}
                onValueChange={(value) => {
                  const jukminJusik = getJukminJusikFromProcess(value);
                  setFormData({ 
                    ...formData, 
                    proses: value,
                    jukminJusik: jukminJusik 
                  });
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status proses" />
                </SelectTrigger>
                <SelectContent>
                  {processOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.value} ({option.percentage})</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jukminJusik">Jukmin / Jusik (%)</Label>
              <Input
                id="jukminJusik"
                value={formData.jukminJusik}
                placeholder="Otomatis terisi berdasarkan proses"
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipeData">Tipe Data *</Label>
              <Select
                value={formData.tipeData}
                onValueChange={(value) => setFormData({ ...formData, tipeData: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe data" />
                </SelectTrigger>
                <SelectContent>
                  {tipeDataOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Upload File PDF</Label>
            <PDFUploadPreview
              currentPDF={formData.dataPdf}
              onPDFChange={handlePDFChange}
              onPDFRemove={handlePDFRemove}
            />
          </div>

          <Button type="submit" className="w-full">
            Tambah Data Pengadaan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddDataForm;
