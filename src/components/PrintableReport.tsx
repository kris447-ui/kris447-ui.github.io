
import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

interface PrintableReportProps {
  data: DataItem[];
  title: string;
  filterType?: string;
  settings?: ReportSettings;
}

const PrintableReport = ({ data, title, filterType, settings }: PrintableReportProps) => {
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: id });
  
  const defaultSettings: ReportSettings = {
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
  };

  const reportSettings = settings || defaultSettings;
  
  return (
    <div className="print-container">
      <style>{`
        @media print {
          .print-container {
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
          .hide-on-print {
            display: none !important;
          }
        }
        @page {
          margin: 1cm;
          size: A4 landscape;
        }
      `}</style>
      
      <div className="print-header">
        <div className="print-title">{reportSettings.title}</div>
        <div className="print-subtitle">{title}</div>
        {filterType && (
          <div className="print-subtitle">Filter: {filterType}</div>
        )}
        <div className="print-date">Tanggal Cetak: {currentDate}</div>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th className="number-col">No</th>
            <th>Nama Pengadaan</th>
            <th>No dan Tgl Kep</th>
            <th>No dan Tgl Kontrak</th>
            <th>Jukmin / Jusik (%)</th>
            <th>Nama Perusahaan</th>
            <th>Bekal</th>
            <th className="status-col">Proses</th>
            <th>Tipe Data</th>
            <th>Data PDF</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="number-col">{index + 1}</td>
              <td>{item.namaPengadaan}</td>
              <td>{item.noTglKep}</td>
              <td>{item.noTglKontrak}</td>
              <td>{item.jukminJusik}</td>
              <td>{item.namaPerusahaan}</td>
              <td>{item.bekal}</td>
              <td className="status-col">{item.proses}</td>
              <td>{item.tipeData}</td>
              <td>{item.dataPdf || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="print-footer">
        <div className="signature-box">
          <div>{reportSettings.leftSignature.title}</div>
          <div>{reportSettings.leftSignature.name}</div>
          <div className="signature-line">
            (..............................)
          </div>
        </div>
        <div className="signature-box">
          <div>{reportSettings.rightSignature.title}</div>
          <div>{reportSettings.rightSignature.name}</div>
          <div className="signature-line">
            (..............................)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
