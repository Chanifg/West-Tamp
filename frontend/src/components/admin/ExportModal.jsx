import React, { useState } from 'react';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ExportModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('excel');
  const toast = useToast();

  if (!isOpen) return null;

  const handleExport = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Silakan pilih tanggal mulai dan tanggal selesai.");
      return;
    }

    setLoading(true);
    client.get('/api/admin/reports/export', {
      params: {
        start_date: startDate,
        end_date: endDate,
        format: format === 'excel' ? 'csv' : 'pdf'
      },
      responseType: 'blob'
    })
      .then(res => {
        const file = new Blob([res.data], { type: res.headers['content-type'] });
        const fileURL = URL.createObjectURL(file);
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        
        const extension = format === 'pdf' ? 'pdf' : 'csv';
        fileLink.setAttribute('download', `Laporan_Keuangan_Westtamp_${startDate}_sd_${endDate}.${extension}`);
        document.body.appendChild(fileLink);
        fileLink.click();
        fileLink.remove();
        toast.success("Laporan keuangan berhasil diunduh!");
        onClose();
      })
      .catch(async err => {
        let errMsg = "Terjadi kesalahan";
        if (err.response?.data instanceof Blob) {
          try {
            const text = await err.response.data.text();
            const json = JSON.parse(text);
            errMsg = json.message || errMsg;
          } catch (_) {
            errMsg = err.message || errMsg;
          }
        } else {
          errMsg = err.response?.data?.message || err.message || errMsg;
        }
        toast.error("Gagal mengekspor laporan: " + errMsg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose}></div>

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl border border-surface-variant max-w-md w-full p-6 shadow-2xl transition-all z-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-xl font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">download</span>
            Ekspor Laporan Keuangan
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleExport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tanggal Mulai</label>
            <input 
              type="date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full border border-surface-variant rounded-xl px-4 py-2.5 bg-surface focus:outline-none focus:border-primary text-sm text-on-surface"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tanggal Selesai</label>
            <input 
              type="date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full border border-surface-variant rounded-xl px-4 py-2.5 bg-surface focus:outline-none focus:border-primary text-sm text-on-surface"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Format Unduhan</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="exportFormatModal" 
                  value="excel"
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                  className="accent-primary"
                />
                Excel (.csv)
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="exportFormatModal" 
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="accent-primary"
                />
                PDF (.pdf)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-variant">
            <button 
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-surface-variant hover:bg-surface-container rounded-xl font-bold text-sm text-on-surface-variant transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm shadow-sm flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {loading ? 'Mengunduh...' : 'Unduh Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
