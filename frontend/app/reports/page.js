"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppBackground from "../components/AppBackground";
import ExportManager from "../components/ExportManager";
import { 
  ChartBarIcon, ArrowTrendingUpIcon, WalletIcon, SparklesIcon, ArrowDownTrayIcon, ArrowTrendingDownIcon, ArrowPathIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const DashboardCharts = dynamic(() => import("../components/DashboardCharts"), { ssr: false });

export default function Reports() {
  const router = useRouter();
  const [summary, setSummary] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const fetchSummary = async () => {
    try {
      const token = getToken();
      if (!token) return router.push("/auth/signin");
      const res = await api.get("/transactions/summary", { headers: { Authorization: `Bearer ${token}` } });
      setSummary({
        balance: res.data.balance ?? 0,
        totalIncome: res.data.totalIncome ?? 0,
        totalExpense: res.data.totalExpense ?? 0
      });
    } catch (err) {} finally { setLoading(false); }
  };

  const fetchAiAdvice = async () => {
    setAiLoading(true);
    try {
      const token = getToken();
      const res = await api.get("/ai/advisor", { headers: { Authorization: `Bearer ${token}` } });
      setAiAdvice(res.data.advice);
    } catch (err) {
      setAiAdvice("Failed to connect to the Financial AI. Please check your configuration.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAiAdvice();
  }, [router]);

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
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Financial Analysis</h1>
              <p className="text-slate-400 font-medium text-sm">Review your overall spending and income performance.</p>
            </div>
            <div className="flex gap-3">
               <button 
                onClick={() => setExportOpen(true)}
                className="flex items-center gap-2 font-bold px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[12px] text-slate-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-xl shadow-black/20 active:scale-95"
               >
                 <ArrowDownTrayIcon className="w-4 h-4" /> Export
               </button>
               <button className="flex items-center gap-2 font-bold px-8 py-3.5 rounded-2xl bg-indigo-600 text-white text-[12px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                 This Quarter
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-white/20 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500"><WalletIcon className="w-7 h-7" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic leading-none">Net Equity</p>
                <h3 className="text-2xl font-black italic text-white">₹{(summary.balance || 0).toLocaleString()}</h3>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.1 }} className="bg-indigo-600/10 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-indigo-500/40 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500"><ArrowTrendingUpIcon className="w-7 h-7" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic leading-none">Total Income</p>
                <h3 className="text-2xl font-black italic text-white">+₹{(summary.totalIncome || 0).toLocaleString()}</h3>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y: 10 }} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.2 }} className="bg-rose-600/10 backdrop-blur-2xl border border-rose-500/20 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-rose-500/40 transition-all sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500"><ArrowTrendingDownIcon className="w-7 h-7" /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 italic leading-none">Total Expense</p>
                <h3 className="text-2xl font-black italic text-white">-₹{(summary.totalExpense || 0).toLocaleString()}</h3>
              </div>
            </motion.div>
          </div>

          <div className="space-y-10">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12 relative z-10">
                   <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight">Active Cash Flow</h3>
                      <p className="text-xs font-medium text-slate-500">Visualization of income vs consumption trajectory</p>
                   </div>
                   <div className="bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-2xl text-[10px] font-black border border-emerald-500/20 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Analysis Active
                   </div>
                </div>
                <div className="h-[400px] sm:h-[500px] relative z-10">
                   <DashboardCharts />
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 pb-10">
               <motion.div 
                  initial={{ opacity:0, x: -10 }} animate={{ opacity:1, x: 0 }}
                  className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 group hover:border-white/20 transition-all"
               >
                  <h4 className="text-[12px] font-bold text-white uppercase tracking-[4px] italic mb-10 flex items-center gap-3 leading-none ring-1 ring-white/5 py-3 px-6 w-fit rounded-full">
                     Growth Projection
                  </h4>
                  <div className="py-24 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01] group-hover:bg-white/[0.02] transition-all">
                     <p className="text-xs font-bold text-slate-700 uppercase tracking-widest italic tracking-[3px]">More data required for prediction...</p>
                  </div>
               </motion.div>

               <motion.div 
                  initial={{ opacity:0, x: 10 }} animate={{ opacity:1, x: 0 }}
                  className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-12 shadow-2xl shadow-indigo-900/40 text-white relative overflow-hidden group min-h-[400px] flex flex-col"
               >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 blur-[100px] rounded-full" />
                  
                  <div className="flex items-center justify-between mb-10 relative z-10">
                    <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-[6px] italic leading-none">Financial Insight</h4>
                    <button 
                      onClick={fetchAiAdvice}
                      disabled={aiLoading}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/5 transiton-all active:scale-95 disabled:opacity-50"
                    >
                      <ArrowPathIcon className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-8 relative z-10 flex-1 flex flex-col justify-center">
                     <AnimatePresence mode="wait">
                       {aiLoading ? (
                         <motion.div 
                           key="loading" 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="space-y-4"
                         >
                            {[1,2,3].map(i => (
                              <div key={i} className="h-20 bg-white/5 rounded-[2rem] animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                            ))}
                         </motion.div>
                       ) : (
                         <motion.div 
                           key="content"
                           initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                           className="p-8 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md"
                         >
                            <div className="flex items-center gap-3 mb-4">
                               <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest italic">Advisor Assessment</p>
                            </div>
                            <div className="text-sm font-medium text-slate-300 leading-relaxed italic whitespace-pre-wrap prose prose-invert max-w-none">
                               {aiAdvice || "Awaiting more transactions for deeper insight..."}
                            </div>
                         </motion.div>
                       )}
                     </AnimatePresence>

                     {!aiAdvice && !aiLoading && (
                        <div className="flex items-center gap-4 px-2">
                           <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black italic shadow-lg shadow-indigo-600/5">!</div>
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Connect your Gemini API Key for live insights.</p>
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
          </div>
        </main>
      </div>

      <ExportManager 
        open={exportOpen} 
        onClose={() => setExportOpen(false)} 
        summary={summary}
      />
    </div>
  );
}
