import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { dashboardData } from '../../stores/user';

export default function ExpenseModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
      setIsOpen(false);
      // Bersihkan form saat ditutup
      setDescription('');
      setAmount('');
  };

  useEffect(() => {
    // Event listener untuk membuka modal dari Astro
    const btn = document.getElementById('add-expense-btn');
    if (btn) {
      btn.addEventListener('click', openModal);
    }
    // Cleanup
    return () => {
      if (btn) btn.removeEventListener('click', openModal);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount) <= 0) {
      alert("Deskripsi dan jumlah harus diisi dengan benar.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.addExpense(description, parseFloat(amount));
      if (result.success) {
        dashboardData.set(result.report);
        closeModal();
      } else {
        alert('Gagal menambah pengeluaran: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-6 text-slate-800">Tambah Pengeluaran</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none" 
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none" 
              required 
            />
          </div>
          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={closeModal} 
              className="flex-1 py-3 px-4 rounded-xl font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
