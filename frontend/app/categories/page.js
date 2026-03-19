"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppBackground from "../components/AppBackground";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, TrashIcon, TagIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "expense", color: "#6366f1" });

  const fetchCategories = async () => {
    try {
      const token = getToken();
      if (!token) return router.push("/auth/signin");
      const res = await api.get("/categories/list", { headers: { Authorization: `Bearer ${token}` } });
      setCategories(res.data);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api.post("/categories/add", form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ name: "", type: "expense", color: "#6366f1" });
      setShowForm(false);
      fetchCategories();
    } catch (err) { alert("Failed to add category"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = getToken();
      await api.delete(`/categories/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      <AppBackground />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={() => router.push("/auth/signin")} />
      
      <div className="flex-1 flex flex-col md:ml-72 relative z-10 min-w-0 transition-all">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 w-full mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2 px-1">
                 <SparklesIcon className="w-4 h-4 text-indigo-400" />
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Verified Active Session</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Categories</h1>
              <p className="text-slate-400 font-medium text-sm">Organize and classify your financial activity.</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(!showForm)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl ${showForm ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}
            >
              {showForm ? 'Cancel' : <><PlusIcon className="w-5 h-5" /> Add Category</>}
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative">
                   <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-500 rounded-full" /> New Category
                   </h3>
                   <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Name</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-all uppercase" type="text" placeholder="e.g. Dining, Travel, Rent..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Type</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-700 outline-none focus:border-indigo-500/50 appearance-none bg-[#0f172a] transition-all cursor-pointer" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Color</label>
                        <input className="w-full h-13 sm:h-auto bg-white/5 border border-white/10 rounded-2xl p-2 cursor-pointer outline-none focus:border-indigo-500/50 transition-all shadow-inner" type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                      </div>
                      <button type="submit" className="md:col-span-4 py-4 rounded-2xl bg-indigo-600 text-white font-bold transition-all shadow-xl shadow-indigo-600/10 hover:bg-indigo-500">Confirm and Save</button>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
             <div className="py-24 flex justify-center"><div className="w-10 h-10 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={cat._id} 
                  className="group bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 rounded-2.5xl flex items-center justify-center text-white font-black text-xl shadow-xl transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: cat.color }}>
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-base font-bold text-white tracking-tight uppercase leading-none truncate mb-1">{cat.name}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${cat.type === 'income' ? 'text-indigo-400' : 'text-slate-500'}`}>{cat.type === 'income' ? 'Income' : 'Expense'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full transition-all duration-1000 rounded-full" style={{ width: '100%', backgroundColor: cat.color }} />
                     </div>
                     <button onClick={() => handleDelete(cat._id)} className="ml-5 p-3 rounded-xl bg-white/5 text-slate-600 hover:bg-rose-500/20 hover:text-rose-400 border border-white/5 transition-all active:scale-[0.9]">
                        <TrashIcon className="w-5 h-5" />
                     </button>
                  </div>
                </motion.div>
              ))}
              {categories.length === 0 && !loading && (
                 <div className="md:col-span-3 py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6"><TagIcon className="w-8 h-8 text-slate-700" /></div>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest italic tracking-[3px]">Waiting for your first category...</p>
                 </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
