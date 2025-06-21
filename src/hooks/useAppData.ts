
import { useState, useEffect } from 'react';
import { DataItem } from '@/types/app';

export const useAppData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [pdfFiles, setPdfFiles] = useState<Map<number, File>>(new Map());

  // Initialize with sample data including KD, KP, and Kemhan types
  useEffect(() => {
    const sampleData: DataItem[] = [
      { 
        id: 1, 
        namaPengadaan: 'Pengadaan Alat Tulis Kantor', 
        noTglKep: 'KD/001/2024 - 15 Jan 2024', 
        noTglKontrak: 'KONT/001/2024 - 20 Jan 2024',
        jukminJusik: 'Lelang 0%',
        namaPerusahaan: 'PT. Maju Jaya',
        bekal: 'ATK Lengkap',
        proses: 'Lelang',
        tipeData: 'KD',
        dataPdf: 'pengadaan_001.pdf'
      },
      { 
        id: 2, 
        namaPengadaan: 'Pengadaan Komputer', 
        noTglKep: 'KP/002/2024 - 01 Feb 2024', 
        noTglKontrak: 'KONT/002/2024 - 05 Feb 2024',
        jukminJusik: 'Kontrak 25%',
        namaPerusahaan: 'CV. Teknologi Nusantara',
        bekal: 'Laptop & PC',
        proses: 'Kontrak',
        tipeData: 'KP',
        dataPdf: 'pengadaan_002.pdf'
      },
      { 
        id: 3, 
        namaPengadaan: 'Pengadaan Alutsista', 
        noTglKep: 'KEMHAN/003/2024 - 10 Feb 2024', 
        noTglKontrak: 'KONT/003/2024 - 15 Feb 2024',
        jukminJusik: 'PC 35%',
        namaPerusahaan: 'PT. Industri Pertahanan',
        bekal: 'Peralatan Militer',
        proses: 'PC',
        tipeData: 'Kemhan',
        dataPdf: 'pengadaan_003.pdf'
      },
      { 
        id: 4, 
        namaPengadaan: 'Pengadaan Kendaraan Dinas', 
        noTglKep: 'KP/004/2024 - 20 Feb 2024', 
        noTglKontrak: 'KONT/004/2024 - 25 Feb 2024',
        jukminJusik: 'Selesai 100%',
        namaPerusahaan: 'PT. Otomotif Nusantara',
        bekal: 'Mobil Dinas',
        proses: 'Selesai',
        tipeData: 'KP',
        dataPdf: 'pengadaan_004.pdf'
      }
    ];
    setData(sampleData);
  }, []);

  const handleAddData = (newItem: Omit<DataItem, 'id'>) => {
    const newId = Math.max(...data.map(item => item.id), 0) + 1;
    setData([...data, { ...newItem, id: newId }]);
  };

  const handleEditData = (editedItem: DataItem) => {
    setData(data.map(item => item.id === editedItem.id ? editedItem : item));
  };

  const handleDeleteData = (id: number) => {
    setData(data.filter(item => item.id !== id));
    // Also remove PDF file if exists
    setPdfFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const handleImportData = (importedData: DataItem[]) => {
    const maxId = Math.max(...data.map(item => item.id), 0);
    const dataWithNewIds = importedData.map((item, index) => ({
      ...item,
      id: maxId + index + 1
    }));
    setData([...data, ...dataWithNewIds]);
  };

  const handleUploadPDF = (itemId: number, file: File) => {
    setPdfFiles(prev => new Map(prev).set(itemId, file));
    
    // Update the data item to include the PDF filename
    setData(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, dataPdf: file.name }
        : item
    ));
  };

  const getPDFFile = (itemId: number): File | null => {
    return pdfFiles.get(itemId) || null;
  };

  return {
    data,
    handleAddData,
    handleEditData,
    handleDeleteData,
    handleImportData,
    handleUploadPDF,
    getPDFFile
  };
};
