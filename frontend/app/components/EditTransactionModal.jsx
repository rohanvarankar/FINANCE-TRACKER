"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PencilSquareIcon, CalendarDaysIcon, BanknotesIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function EditTransactionModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ type: "income", description: "", amount: "", date: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || "income",
        description: initialData.description || "",
        amount: initialData.amount !== undefined ? String(initialData.amount) : "",
        date: initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.description || form.amount === "" || !form.type) return setError("Please fill in all fields.");
    const amountNumber = Number(form.amount);
    if (Number.isNaN(amountNumber)) return setError("Invalid amount.");

    setSaving(true);
    try {
      await onSave({
        ...initialData,
        description: form.description,
        amount: amountNumber,
        type: form.type,
        date: form.date || new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update transaction.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white shadow-sm">
                <PencilSquareIcon className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Edit Transaction</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">ID: {initialData?._id?.slice(-8)}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition active:scale-95">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
            {['income', 'expense'].map(t => (
              <button 
                key={t} type="button" onClick={() => setForm({...form, type: t})}
                className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${form.type === t ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-400'}`}
              >{t}</button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Description</label>
            <div className="relative group">
              <DocumentTextIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
              <input
                name="description" value={form.description} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
                placeholder="What was this for?"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Amount (₹)</label>
              <div className="relative group">
                <BanknotesIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
                <input
                  name="amount" value={form.amount} onChange={handleChange} type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Date</label>
              <div className="relative group">
                <CalendarDaysIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
                <input 
                  name="date" value={form.date} onChange={handleChange} type="date" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all cursor-pointer" 
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black text-center p-4 rounded-2xl uppercase tracking-[3px]">{error}</motion.div>}
          </AnimatePresence>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-6 border-t border-white/5">
            <button onClick={onClose} disabled={saving} className="px-8 py-3.5 rounded-2xl bg-white/5 text-slate-500 hover:bg-white/10 font-bold text-xs transition active:scale-95">
              Cancel
            </button>
            <button 
              onClick={handleSave} disabled={saving} 
              className="px-10 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/10 transition active:scale-95"
            >
              {saving ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
