
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, FileImage, FileType, FileText } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { QRCodeData } from '../types';

interface QRPreviewProps {
  data: QRCodeData;
}

const QRPreview: React.FC<QRPreviewProps> = ({ data }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const targetUrl = `${import.meta.env.VITE_QR_BASE_URL || window.location.origin}${window.location.pathname}#/q/${data.id}`;

  const downloadImage = async (format: 'png' | 'jpeg') => {
    if (!qrRef.current) return;
    try {
      let dataUrl;
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(qrRef.current);
      } else {
        dataUrl = await htmlToImage.toJpeg(qrRef.current, { quality: 0.95 });
      }
      const link = document.createElement('a');
      link.download = `qr-${data.name.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const downloadPDF = async () => {
    if (!qrRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(qrRef.current);
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, 'PNG', 40, 40, 130, 130);
      pdf.text(`QR Kod: ${data.name}`, 40, 30);
      pdf.save(`qr-${data.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
      <div 
        ref={qrRef} 
        className="p-8 bg-white rounded-xl border-2 border-slate-50 shadow-inner mb-6"
      >
        <QRCodeSVG 
          value={targetUrl} 
          size={256} 
          level="H"
          includeMargin={true}
          imageSettings={data.publisherLogo ? {
            src: data.publisherLogo,
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          } : undefined}
        />
        <div className="mt-4 text-center">
          <p className="font-bold text-slate-800">{data.name}</p>
          <p className="text-xs text-slate-400 mt-1">{data.publisherName}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        <button
          onClick={() => downloadImage('png')}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 text-xs font-medium"
        >
          <FileImage size={20} className="text-indigo-500" />
          PNG
        </button>
        <button
          onClick={() => downloadImage('jpeg')}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 text-xs font-medium"
        >
          <FileType size={20} className="text-emerald-500" />
          JPEG
        </button>
        <button
          onClick={downloadPDF}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 text-xs font-medium"
        >
          <FileText size={20} className="text-orange-500" />
          PDF
        </button>
      </div>
    </div>
  );
};

export default QRPreview;
