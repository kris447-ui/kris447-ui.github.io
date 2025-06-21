
import React, { useState } from 'react';
import { Upload, FileText, X, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PDFUploadPreviewProps {
  currentPDF?: string;
  onPDFChange: (fileName: string) => void;
  onPDFRemove: () => void;
}

const PDFUploadPreview = ({ currentPDF, onPDFChange, onPDFRemove }: PDFUploadPreviewProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploadedFile(file);
      onPDFChange(file.name);
      toast.success('File PDF berhasil diupload!');
    }
  };

  const handleRemovePDF = () => {
    setUploadedFile(null);
    onPDFRemove();
    toast.success('File PDF berhasil dihapus!');
  };

  const handlePreview = () => {
    if (currentPDF || uploadedFile) {
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFile.name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast.info('Fitur download untuk file yang sudah ada akan tersedia setelah integrasi backend');
    }
  };

  return (
    <div className="space-y-2">
      {!currentPDF && !uploadedFile ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">Upload file PDF</p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="pdf-upload" className="cursor-pointer">
              Pilih File PDF
            </label>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">
                {uploadedFile?.name || currentPDF}
              </span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRemovePDF}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-replace"
            />
            <Button variant="outline" size="sm" asChild>
              <label htmlFor="pdf-replace" className="cursor-pointer">
                Ganti File
              </label>
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Preview PDF</DialogTitle>
            <DialogDescription>
              {uploadedFile?.name || currentPDF}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {uploadedFile ? (
              <iframe
                src={URL.createObjectURL(uploadedFile)}
                className="w-full h-[70vh] border rounded-lg"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-[70vh] bg-muted/20 rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Preview tidak tersedia untuk file yang sudah ada.
                    <br />
                    Fitur ini akan tersedia setelah integrasi dengan backend.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDFUploadPreview;
