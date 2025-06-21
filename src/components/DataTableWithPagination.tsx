import React, { useState } from 'react';
import { DataItem } from '@/types/app';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Filter, Printer } from 'lucide-react';
import { toast } from 'sonner';
import PrintDialog from './PrintDialog';
import PrintableReport from './PrintableReport';

interface DataTableWithPaginationProps {
  data: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (id: number) => void;
}

const DataTableWithPagination = ({ data, onEdit, onDelete }: DataTableWithPaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [printData, setPrintData] = useState<DataItem[]>([]);
  const [printTitle, setPrintTitle] = useState('');
  const [printFilter, setPrintFilter] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Apply filters
  const filteredData = data.filter(item => {
    const matchesSearch = item.namaPengadaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.proses === statusFilter;
    const matchesType = typeFilter === 'all' || item.tipeData === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value === 'all' ? filteredData.length : parseInt(value));
    setCurrentPage(1);
  };

  const handleEdit = (item: DataItem) => {
    setEditingItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onEdit(editingItem);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success('Data berhasil diupdate!');
    }
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    toast.success('Data berhasil dihapus!');
  };

  const handlePrint = (filteredData: DataItem[], title: string, filterDescription: string) => {
    setPrintData(filteredData);
    setPrintTitle(title);
    setPrintFilter(filterDescription);
    setShowPrintPreview(true);
    
    // Trigger print after a short delay to ensure content is rendered
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const tipeDataOptions = [
    { value: 'KD', label: 'KD (Kewenangan Daerah)' },
    { value: 'KP', label: 'KP (Kewenangan Pusat)' },
    { value: 'Kemhan', label: 'Kemhan (Kementerian Pertahanan)' }
  ];

  const processOptions = [
    { value: 'Lelang', percentage: '0%' },
    { value: 'Kontrak', percentage: '25%' },
    { value: 'PC', percentage: '35%' },
    { value: 'Komisi', percentage: '70%' },
    { value: 'Penagihan', percentage: '80%' },
    { value: 'Selesai', percentage: '100%' }
  ];

  return (
    <>
      <Card className="hide-on-print">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Data Pengadaan</CardTitle>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setIsPrintDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Cetak
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tampilkan:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="all">Semua</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Filter Section */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Cari Data</Label>
              <Input
                id="search"
                placeholder="Cari nama pengadaan atau perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="status-filter">Filter Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Lelang">Lelang</SelectItem>
                  <SelectItem value="Kontrak">Kontrak</SelectItem>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="Komisi">Komisi</SelectItem>
                  <SelectItem value="Penagihan">Penagihan</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type-filter">Filter Tipe</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="KD">KD</SelectItem>
                  <SelectItem value="KP">KP</SelectItem>
                  <SelectItem value="Kemhan">Kemhan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>Nama Pengadaan</TableHead>
                  <TableHead>No/Tgl Kep</TableHead>
                  <TableHead>No/Tgl Kontrak</TableHead>
                  <TableHead>Jukmin/Jusik</TableHead>
                  <TableHead>Nama Perusahaan</TableHead>
                  <TableHead>Bekal</TableHead>
                  <TableHead>Proses</TableHead>
                  <TableHead>Tipe Data</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{item.namaPengadaan}</TableCell>
                    <TableCell>{item.noTglKep}</TableCell>
                    <TableCell>{item.noTglKontrak}</TableCell>
                    <TableCell>{item.jukminJusik}</TableCell>
                    <TableCell>{item.namaPerusahaan}</TableCell>
                    <TableCell>{item.bekal}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.proses === 'Selesai' ? 'bg-green-100 text-green-800' :
                        item.proses === 'PC' ? 'bg-blue-100 text-blue-800' :
                        item.proses === 'Kontrak' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.proses}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.tipeData === 'KD' ? 'bg-purple-100 text-purple-800' :
                        item.tipeData === 'KP' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.tipeData}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data "{item.namaPengadaan}"? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1} sampai {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {getPaginationRange().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Data Pengadaan</DialogTitle>
              <DialogDescription>
                Ubah informasi data pengadaan di bawah ini.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-namaPengadaan" className="text-right">
                    Nama Pengadaan
                  </Label>
                  <Input
                    id="edit-namaPengadaan"
                    value={editingItem.namaPengadaan}
                    onChange={(e) => setEditingItem({ ...editingItem, namaPengadaan: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-namaPerusahaan" className="text-right">
                    Nama Perusahaan
                  </Label>
                  <Input
                    id="edit-namaPerusahaan"
                    value={editingItem.namaPerusahaan}
                    onChange={(e) => setEditingItem({ ...editingItem, namaPerusahaan: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-noTglKep" className="text-right">
                    No/Tgl Kep
                  </Label>
                  <Input
                    id="edit-noTglKep"
                    value={editingItem.noTglKep}
                    onChange={(e) => setEditingItem({ ...editingItem, noTglKep: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-noTglKontrak" className="text-right">
                    No/Tgl Kontrak
                  </Label>
                  <Input
                    id="edit-noTglKontrak"
                    value={editingItem.noTglKontrak}
                    onChange={(e) => setEditingItem({ ...editingItem, noTglKontrak: e.target.value })}
                    className="col-span-3"
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-proses" className="text-right">
                    Proses
                  </Label>
                  <Select
                    value={editingItem.proses}
                    onValueChange={(value) => {
                      const option = processOptions.find(opt => opt.value === value);
                      const jukminJusik = option ? `${value} ${option.percentage}` : value;
                      setEditingItem({ 
                        ...editingItem, 
                        proses: value,
                        jukminJusik: jukminJusik 
                      });
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {processOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.value} ({option.percentage})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-tipeData" className="text-right">
                    Tipe Data
                  </Label>
                  <Select
                    value={editingItem.tipeData}
                    onValueChange={(value) => setEditingItem({ ...editingItem, tipeData: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipeDataOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              <Button onClick={handleSaveEdit}>
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Print Dialog */}
        <PrintDialog
          isOpen={isPrintDialogOpen}
          onClose={() => setIsPrintDialogOpen(false)}
          data={filteredData}
          onPrint={handlePrint}
        />
      </Card>

      {/* Print Preview */}
      {showPrintPreview && (
        <div className="print-only">
          <PrintableReport
            data={printData}
            title={printTitle}
            filterType={printFilter}
          />
        </div>
      )}

      <style>{`
        @media print {
          .hide-on-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default DataTableWithPagination;
