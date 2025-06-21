
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, X } from 'lucide-react';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfFile: File | null;
  pdfName: string;
}

const PDFViewer = ({ isOpen, onClose, pdfFile, pdfName }: PDFViewerProps) => {
  const handleDownload = () => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFile.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview PDF: {pdfName}</span>
            <div className="flex gap-2">
              {pdfFile && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {pdfFile ? (
            <iframe
              src={URL.createObjectURL(pdfFile)}
              className="w-full h-[75vh] border rounded-lg"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-[75vh] bg-muted/20 rounded-lg">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  File PDF tidak ditemukan atau belum diupload.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
