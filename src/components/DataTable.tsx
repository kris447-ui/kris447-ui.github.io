
import React, { useState, useMemo } from 'react';
import { Edit, Trash2, FileX, FileText, Eye, Download, Filter, X, Printer, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import PDFUploadPreview from './PDFUploadPreview';
import PDFViewer from './PDFViewer';
import PrintDialog from './PrintDialog';
import PrintableReport from './PrintableReport';
import ReportCustomizationDialog, { ReportSettings } from './ReportCustomizationDialog';

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

interface DataTableProps {
  data: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (id: number) => void;
  onUploadPDF?: (itemId: number, file: File) => void;
  getPDFFile?: (itemId: number) => File | null;
}

const DataTable = ({ data, onEdit, onDelete, onUploadPDF, getPDFFile }: DataTableProps) => {
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [viewingPDF, setViewingPDF] = useState<{ file: File | null; name: string }>({ file: null, name: '' });
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter states - updated to include new data types
  const [filterType, setFilterType] = useState<'all' | 'KD' | 'KP' | 'Kemhan'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Report settings
  const [reportSettings, setReportSettings] = useState<ReportSettings>({
    title: 'SISTEM MANAJEMEN DATA PENGADAAN',
    fontSize: '18px',
    color: '#000000',
    alignment: 'center',
    leftSignature: {
      title: 'Mengetahui,',
      name: 'Kepala Bagian'
    },
    rightSignature: {
      title: 'Dibuat oleh,',
      name: 'Administrator'
    }
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

  // Filter and paginate data - updated for new types
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.namaPengadaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noTglKep.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noTglKontrak.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter (KD/KP/Kemhan)
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.tipeData === filterType);
    }

    return filtered;
  }, [data, searchTerm, filterType]);

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? filteredData.length : startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleEdit = (item: DataItem) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      if (!editingItem.namaPengadaan || !editingItem.namaPerusahaan || !editingItem.proses) {
        toast.error('Harap isi field yang wajib diisi!');
        return;
      }
      
      // Auto-update jukminJusik based on proses
      const updatedItem = {
        ...editingItem,
        jukminJusik: getJukminJusikFromProcess(editingItem.proses)
      };
      
      onEdit(updatedItem);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success('Data berhasil diupdate!');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      onDelete(id);
      toast.success('Data berhasil dihapus!');
    }
  };

  const handlePDFView = (item: DataItem) => {
    const pdfFile = getPDFFile ? getPDFFile(item.id) : null;
    setViewingPDF({ file: pdfFile, name: item.dataPdf });
    setIsPDFViewerOpen(true);
  };

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Hanya file PDF yang diizinkan!');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Ukuran file tidak boleh lebih dari 10MB!');
        return;
      }
      
      if (onUploadPDF) {
        onUploadPDF(itemId, file);
        toast.success('File PDF berhasil diupload!');
      }
    }
    // Reset input
    event.target.value = '';
  };

  const handlePDFChange = (fileName: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, dataPdf: fileName });
    }
  };

  const handlePDFRemove = () => {
    if (editingItem) {
      setEditingItem({ ...editingItem, dataPdf: '' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setCurrentPage(1);
  };

  const handlePrint = (filteredData: DataItem[], title: string, filterDescription: string) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      toast.error('Popup diblokir! Mohon izinkan popup untuk mencetak.');
      return;
    }

    // Generate the print HTML content with custom settings
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            @media print {
              body {
                font-family: 'Times New Roman', serif;
                color: black;
                background: white;
                margin: 0;
                padding: 20px;
              }
              .print-header {
                text-align: ${reportSettings.alignment};
                margin-bottom: 30px;
                border-bottom: 2px solid #000;
                padding-bottom: 20px;
              }
              .print-title {
                font-size: ${reportSettings.fontSize};
                font-weight: bold;
                margin-bottom: 10px;
                text-transform: uppercase;
                color: ${reportSettings.color};
              }
              .print-subtitle {
                font-size: 14px;
                margin-bottom: 5px;
              }
              .print-date {
                font-size: 12px;
                margin-top: 10px;
              }
              .print-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 11px;
              }
              .print-table th,
              .print-table td {
                border: 1px solid #000;
                padding: 8px 6px;
                text-align: left;
                vertical-align: top;
              }
              .print-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                text-align: center;
              }
              .print-table .number-col {
                text-align: center;
                width: 40px;
              }
              .print-table .status-col {
                text-align: center;
              }
              .print-footer {
                margin-top: 40px;
                display: flex;
                justify-content: space-between;
                page-break-inside: avoid;
              }
              .signature-box {
                text-align: center;
                width: 200px;
              }
              .signature-line {
                margin-top: 60px;
                border-top: 1px solid #000;
                padding-top: 5px;
              }
            }
            @page {
              margin: 1cm;
              size: A4 landscape;
            }
            body {
              font-family: 'Times New Roman', serif;
              color: black;
              background: white;
              margin: 0;
              padding: 20px;
            }
            .print-header {
              text-align: ${reportSettings.alignment};
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .print-title {
              font-size: ${reportSettings.fontSize};
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
              color: ${reportSettings.color};
            }
            .print-subtitle {
              font-size: 14px;
              margin-bottom: 5px;
            }
            .print-date {
              font-size: 12px;
              margin-top: 10px;
            }
            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 11px;
            }
            .print-table th,
            .print-table td {
              border: 1px solid #000;
              padding: 8px 6px;
              text-align: left;
              vertical-align: top;
            }
            .print-table th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }
            .print-table .number-col {
              text-align: center;
              width: 40px;
            }
            .print-table .status-col {
              text-align: center;
            }
            .print-footer {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              page-break-inside: avoid;
            }
            .signature-box {
              text-align: center;
              width: 200px;
            }
            .signature-line {
              margin-top: 60px;
              border-top: 1px solid #000;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <div class="print-title">${reportSettings.title}</div>
            <div class="print-subtitle">${title}</div>
            <div class="print-subtitle">Filter: ${filterDescription}</div>
            <div class="print-date">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })}</div>
          </div>

          <table class="print-table">
            <thead>
              <tr>
                <th class="number-col">No</th>
                <th>Nama Pengadaan</th>
                <th>No dan Tgl Kep</th>
                <th>No dan Tgl Kontrak</th>
                <th>Jukmin Jusik (%)</th>
                <th>Nama Perusahaan</th>
                <th>Bekal</th>
                <th class="status-col">Proses</th>
                <th>Tipe Data</th>
                <th>Data PDF</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((item, index) => `
                <tr>
                  <td class="number-col">${index + 1}</td>
                  <td>${item.namaPengadaan}</td>
                  <td>${item.noTglKep}</td>
                  <td>${item.noTglKontrak}</td>
                  <td>${item.jukminJusik}</td>
                  <td>${item.namaPerusahaan}</td>
                  <td>${item.bekal}</td>
                  <td class="status-col">${item.proses}</td>
                  <td>${item.tipeData}</td>
                  <td>${item.dataPdf || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="print-footer">
            <div class="signature-box">
              <div>${reportSettings.leftSignature.title}</div>
              <div>${reportSettings.leftSignature.name}</div>
              <div class="signature-line">
                (..............................)
              </div>
            </div>
            <div class="signature-box">
              <div>${reportSettings.rightSignature.title}</div>
              <div>${reportSettings.rightSignature.name}</div>
              <div class="signature-line">
                (..............................)
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    toast.success('Membuka jendela cetak...');
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileX className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Tidak ada data</h3>
        <p className="text-muted-foreground">Tambahkan data pertama Anda untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Data Management Pengadaan</CardTitle>
            <div className="flex gap-2">
              <ReportCustomizationDialog 
                settings={reportSettings} 
                onUpdate={setReportSettings} 
              />
              <Button
                variant="outline"
                onClick={() => setIsPrintDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Cetak Laporan
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <Label htmlFor="search">Pencarian</Label>
                <Input
                  id="search"
                  placeholder="Cari nama pengadaan, perusahaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="filter-type">Filter Tipe</Label>
                <Select value={filterType} onValueChange={(value: 'all' | 'KD' | 'KP' | 'Kemhan') => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="KD">KD (Kewenangan Daerah)</SelectItem>
                    <SelectItem value="KP">KP (Kewenangan Pusat)</SelectItem>
                    <SelectItem value="Kemhan">Kemhan (Kementerian Pertahanan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Reset Filter
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page">Tampilkan:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(value === 'all' ? -1 : parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="all">Semua</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                dari {filteredData.length} data
              </span>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[60px]">No</TableHead>
                  <TableHead className="min-w-[200px]">Nama Pengadaan</TableHead>
                  <TableHead className="min-w-[180px]">No dan Tgl Kep</TableHead>
                  <TableHead className="min-w-[180px]">No dan Tgl Kontrak</TableHead>
                  <TableHead className="min-w-[150px]">Jukmin Jusik (%)</TableHead>
                  <TableHead className="min-w-[180px]">Nama Perusahaan</TableHead>
                  <TableHead className="min-w-[120px]">Bekal</TableHead>
                  <TableHead className="min-w-[100px]">Proses</TableHead>
                  <TableHead className="min-w-[100px]">Tipe Data</TableHead>
                  <TableHead className="min-w-[200px]">Data PDF</TableHead>
                  <TableHead className="min-w-[150px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell>{item.namaPengadaan}</TableCell>
                    <TableCell>{item.noTglKep}</TableCell>
                    <TableCell>{item.noTglKontrak}</TableCell>
                    <TableCell>{item.jukminJusik}</TableCell>
                    <TableCell>{item.namaPerusahaan}</TableCell>
                    <TableCell>{item.bekal}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.proses === 'Selesai' ? 'bg-green-100 text-green-800' :
                        item.proses === 'Kontrak' ? 'bg-yellow-100 text-yellow-800' :
                        item.proses === 'PC' ? 'bg-orange-100 text-orange-800' :
                        item.proses === 'Komisi' ? 'bg-purple-100 text-purple-800' :
                        item.proses === 'Penagihan' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.proses}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.tipeData === 'KP' ? 'bg-green-100 text-green-800' :
                        item.tipeData === 'Kemhan' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.tipeData}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.dataPdf ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <span className="text-sm max-w-[80px] truncate" title={item.dataPdf}>
                              {item.dataPdf}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePDFView(item)}
                              className="h-7 w-7 p-0"
                              title="Lihat PDF"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Tidak ada file</span>
                        )}
                        <div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handlePDFUpload(e, item.id)}
                            className="hidden"
                            id={`pdf-upload-${item.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-7 w-7 p-0"
                            title="Upload PDF"
                          >
                            <label htmlFor={`pdf-upload-${item.id}`} className="cursor-pointer flex items-center justify-center">
                              <Upload className="h-3 w-3" />
                            </label>
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1"
                          title="Edit Data"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1"
                          title="Hapus Data"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Hapus</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {itemsPerPage !== -1 && totalPages > 1 && (
            <div className="flex items-center justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Print Dialog */}
      <PrintDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        data={data}
        onPrint={() => {}} // Keep existing handlePrint function
      />

      {/* Enhanced Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Pengadaan</DialogTitle>
            <DialogDescription>
              Ubah informasi data pengadaan di bawah ini. Field dengan tanda * wajib diisi.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-namaPengadaan" className="text-right">
                  Nama Pengadaan *
                </Label>
                <Input
                  id="edit-namaPengadaan"
                  value={editingItem.namaPengadaan}
                  onChange={(e) => setEditingItem({ ...editingItem, namaPengadaan: e.target.value })}
                  className="col-span-3"
                  placeholder="Masukkan nama pengadaan"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-namaPerusahaan" className="text-right">
                  Nama Perusahaan *
                </Label>
                <Input
                  id="edit-namaPerusahaan"
                  value={editingItem.namaPerusahaan}
                  onChange={(e) => setEditingItem({ ...editingItem, namaPerusahaan: e.target.value })}
                  className="col-span-3"
                  placeholder="Masukkan nama perusahaan"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-noTglKep" className="text-right">
                  No dan Tgl Kep
                </Label>
                <Input
                  id="edit-noTglKep"
                  value={editingItem.noTglKep}
                  onChange={(e) => setEditingItem({ ...editingItem, noTglKep: e.target.value })}
                  className="col-span-3"
                  placeholder="KEP/001/2024 - 15 Jan 2024"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-noTglKontrak" className="text-right">
                  No dan Tgl Kontrak
                </Label>
                <Input
                  id="edit-noTglKontrak"
                  value={editingItem.noTglKontrak}
                  onChange={(e) => setEditingItem({ ...editingItem, noTglKontrak: e.target.value })}
                  className="col-span-3"
                  placeholder="KONT/001/2024 - 20 Jan 2024"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-bekal" className="text-right">
                  Bekal
                </Label>
                <Input
                  id="edit-bekal"
                  value={editingItem.bekal}
                  onChange={(e) => setEditingItem({ ...editingItem, bekal: e.target.value })}
                  className="col-span-3"
                  placeholder="Masukkan jenis bekal"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-proses" className="text-right">
                  Proses * 
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingItem.proses}
                    onValueChange={(value) => {
                      const jukminJusik = getJukminJusikFromProcess(value);
                      setEditingItem({ 
                        ...editingItem, 
                        proses: value,
                        jukminJusik: jukminJusik 
                      });
                    }}
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Persentase akan otomatis disesuaikan berdasarkan pilihan proses
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-jukminJusik" className="text-right">
                  Jukmin / Jusik (%)
                </Label>
                <Input
                  id="edit-jukminJusik"
                  value={editingItem.jukminJusik}
                  onChange={(e) => setEditingItem({ ...editingItem, jukminJusik: e.target.value })}
                  className="col-span-3"
                  placeholder="Otomatis terisi berdasarkan proses"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tipeData" className="text-right">
                  Tipe Data *
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingItem.tipeData}
                    onValueChange={(value) => setEditingItem({ ...editingItem, tipeData: value })}
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Upload File PDF
                </Label>
                <div className="col-span-3">
                  <PDFUploadPreview
                    currentPDF={editingItem.dataPdf}
                    onPDFChange={handlePDFChange}
                    onPDFRemove={handlePDFRemove}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button type="submit" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      <PDFViewer
        isOpen={isPDFViewerOpen}
        onClose={() => setIsPDFViewerOpen(false)}
        pdfFile={viewingPDF.file}
        pdfName={viewingPDF.name}
      />
    </div>
  );
};

export default DataTable;
