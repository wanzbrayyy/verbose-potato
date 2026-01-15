import { useState } from 'react';
import { api } from '../../services/api';
import { dashboardData } from '../../stores/user';

export default function ExpenseModal({ isOpen, onClose }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    setLoading(true);
    try {
      const result = await api.addExpense(description, parseFloat(amount));
      if (result.success) {
        dashboardData.set(result.report);
        onClose();
        setDescription('');
        setAmount('');
      } else {
        alert('Gagal menambah pengeluaran');
      }
    } catch (err) {
      alert('Error koneksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-6 text-slate-800">Tambah Pengeluaran</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200"
              required
            />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-xl font-bold border-2 border-slate-200 text-slate-600">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-900 text-white">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
