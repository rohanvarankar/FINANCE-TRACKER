"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppBackground from "../components/AppBackground";
import { motion, AnimatePresence } from "framer-motion";
import { ChartPieIcon, TrashIcon, PlusIcon, SparklesIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Budgets() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ categoryId: "", amount: "", period: "monthly" });

  const fetchData = async () => {
    try {
      const token = getToken();
      if (!token) return router.push("/auth/signin");
      const [bRes, cRes] = await Promise.all([
        api.get("/budgets/list", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/categories/list", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setBudgets(bRes.data);
      setCategories(cRes.data.filter(c => c.type === "expense"));
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api.post("/budgets/add", form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ categoryId: "", amount: "", period: "monthly" });
      setShowForm(false);
      fetchData();
    } catch (err) { alert("Budget failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = getToken();
      await api.delete(`/budgets/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
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
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Budgets</h1>
              <p className="text-slate-400 font-medium text-sm">Monitor and manage your spending limits.</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(!showForm)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl ${showForm ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}
            >
              {showForm ? 'Cancel' : <><PlusIcon className="w-5 h-5" /> Create Plan</>}
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative">
                   <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-500 rounded-full" /> Plan Configuration
                   </h3>
                   <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Select Category</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-700 outline-none focus:border-indigo-500/50 appearance-none bg-[#0f172a] transition-all cursor-pointer" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required>
                            <option value="">Select pool</option>
                            {categories.map(c => <option key={c._id} value={c._id} className="text-white">{c.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Limit (₹)</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-all italic" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Reset Cycle</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-700 outline-none focus:border-indigo-500/50 appearance-none bg-[#0f172a] transition-all cursor-pointer" value={form.period} onChange={e => setForm({...form, period: e.target.value})}>
                            <option value="monthly">Monthly Reset</option>
                            <option value="yearly">Annual Reset</option>
                        </select>
                      </div>
                      <button type="submit" className="md:col-span-3 py-4 rounded-2xl bg-indigo-600 text-white font-bold transition-all shadow-xl shadow-indigo-600/10 hover:bg-indigo-500 mt-2">Deploy Plan</button>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
             <div className="py-24 flex justify-center"><div className="w-10 h-10 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets.map((budget, i) => {
                const spending = budget.spentAmount || 0;
                const limit = budget.amount || 1;
                const percent = Math.min((spending / limit) * 100, 100);
                const isOver = spending > limit;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={budget._id} 
                    className="group bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                     <div className="flex items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 rounded-2.5xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 group-hover:shadow-xl group-hover:shadow-indigo-600/20">
                             <ChartPieIcon className="w-7 h-7" />
                           </div>
                           <div className="overflow-hidden">
                              <h4 className="text-base font-bold text-white tracking-tight uppercase leading-none truncate mb-1">{budget.categoryId?.name || "Global Plan"}</h4>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{budget.period} Cycle Status</p>
                           </div>
                        </div>
                        <button onClick={() => handleDelete(budget._id)} className="p-3 rounded-xl bg-white/5 text-slate-600 hover:bg-rose-500/20 hover:text-rose-400 border border-white/5 transition-all active:scale-[0.9]">
                           <TrashIcon className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none italic">Total Consumption</p>
                              <h3 className={`text-2xl font-black italic leading-none ${isOver ? 'text-rose-400' : 'text-white'}`}>₹{spending.toLocaleString()} <span className="text-white/20 font-normal italic">/</span> ₹{limit.toLocaleString()}</h3>
                           </div>
                           <p className={`text-[10px] font-black uppercase tracking-widest leading-none px-3 py-1.5 rounded-full border ${isOver ? 'bg-rose-400/10 text-rose-400 border-rose-400/20' : 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20'}`}>{percent.toFixed(0)}%</p>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                           <motion.div 
                              initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1.5, ease: "circOut" }}
                              className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-rose-500 shadow-xl shadow-rose-500/20' : 'bg-indigo-600 shadow-xl shadow-indigo-600/20'}`} 
                           />
                        </div>
                        {isOver && (
                           <div className="flex items-center gap-2 py-1 bg-rose-500/5 rounded-xl px-4 border border-rose-500/10">
                              <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" />
                              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-none">Limit Exceeded</p>
                           </div>
                        )}
                     </div>
                  </motion.div>
                );
              })}
              {budgets.length === 0 && !loading && (
                 <div className="md:col-span-2 py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6"><ChartPieIcon className="w-8 h-8 text-slate-700" /></div>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest italic tracking-[3px]">Assign your first budget plan...</p>
                 </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
