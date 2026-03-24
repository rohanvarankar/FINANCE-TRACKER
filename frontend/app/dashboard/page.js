"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TransactionCard from "../components/TransactionCard";
import AppBackground from "../components/AppBackground";
import ChatbotBubble from "../components/ChatbotBubble";
const DashboardCharts = dynamic(() => import("../components/DashboardCharts"), { ssr: false });
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  WalletIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ChartBarSquareIcon,
  PlusIcon,
  SparklesIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MicrophoneIcon
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isListening, setIsListening] = useState(false);
  
  const [form, setForm] = useState({ type: "expense", description: "", amount: "", date: new Date().toISOString().slice(0,10), categoryId: "" });
  const [filters, setFilters] = useState({ q: "" });
  const [showForm, setShowForm] = useState(false);
  const [chartView, setChartView] = useState("live");

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      
      try {
        const token = getToken();
        const res = await api.post("/ai/process-text", { text: transcript }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { description, amount, date, type, category_suggestion } = res.data;
        
        // Auto-fill form
        const updatedForm = {
          ...form,
          description: description || "",
          amount: amount || "",
          date: date || new Date().toISOString().slice(0, 10),
          type: type || "expense"
        };

        // Try to find matching category
        const matchedCat = categories.find(c => 
          c.name.toLowerCase() === category_suggestion?.toLowerCase()
        );
        if (matchedCat) updatedForm.categoryId = matchedCat._id;

        setForm(updatedForm);
        setShowForm(true);
      } catch (err) {
        alert("Failed to parse voice command. Try again!");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Voice input failed.");
    };
  };

  const limit = 8;
  const buildParams = useCallback((pageNum) => {
    const params = { page: pageNum, limit, sortBy: "date", sortOrder: "desc" };
    if (filters.q && filters.q.trim()) params.q = filters.q.trim();
    return params;
  }, [filters]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return router.push("/auth/signin");
      const res = await api.get("/transactions/list", { params: buildParams(page), headers: { Authorization: `Bearer ${token}` } });
      const data = res?.data?.transactions ?? res?.data ?? [];
      setTransactions(data);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (err) {} finally { setLoading(false); }
  }, [page, buildParams, router]);

  const fetchSummary = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const [sRes, cRes] = await Promise.all([
        api.get("/transactions/summary", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/categories/list", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (sRes.data) {
        setSummary({ balance: sRes.data.balance ?? 0, totalIncome: sRes.data.totalIncome ?? 0, totalExpense: sRes.data.totalExpense ?? 0 });
      }
      setCategories(cRes.data || []);
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api.post("/transactions/add", form, { headers: { Authorization: `Bearer ${token}` } });
      setForm({ ...form, description: "", amount: "" });
      setShowForm(false);
      fetchTransactions();
      fetchSummary();
    } catch (err) { alert("Failed to add transaction"); }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const token = getToken();
      await api.delete(`/transactions/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTransactions();
      fetchSummary();
    } catch (err) { alert("Failed to delete"); }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      <AppBackground />
      <ChatbotBubble />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={() => router.push("/auth/signin")} />
      
      <div className="flex-1 flex flex-col md:ml-72 relative z-10 min-w-0 transition-all">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 w-full mx-auto max-w-[1400px]">
          
          {/* HEADER ACTION AREA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2 px-1">
                 <SparklesIcon className="w-4 h-4 text-indigo-400" />
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Verified Active Session</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Dashboard</h1>
              <p className="text-slate-400 font-medium text-sm">Managing {(transactions.length || 0)} transactions in current cycle.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 relative overflow-hidden group ${isListening ? 'ring-2 ring-indigo-500 animate-pulse' : ''}`}
                >
                  <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {isListening ? 'Listening...' : 'Quick Voice'}
                  <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(!showForm)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl ${showForm ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'}`}
                >
                  {showForm ? 'Cancel' : <><PlusIcon className="w-5 h-5" /> Add Transaction</>}
                </motion.button>
             </div>
          </div>

          <AnimatePresence>
             {showForm && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
                  <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl relative">
                     <div className="absolute top-0 right-0 p-8 opacity-10"><BanknotesIcon className="w-24 h-24 text-white" /></div>
                     <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" /> New Transaction
                     </h3>
                     <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                        <div className="md:col-span-1 space-y-2">
                           <label className="text-[11px] font-black text-white uppercase tracking-widest px-1">Type</label>
                           <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/5">
                              <button type="button" onClick={() => setForm({...form, type:'income'})} className={`flex-1 py-3 rounded-xl text-[11px] font-bold uppercase transition-all ${form.type === 'income' ? 'bg-white/10 text-emerald-400 shadow-lg' : 'text-white'}`}>Income</button>
                              <button type="button" onClick={() => setForm({...form, type:'expense'})} className={`flex-1 py-3 rounded-xl text-[11px] font-bold uppercase transition-all ${form.type === 'expense' ? 'bg-white/10 text-rose-400 shadow-lg' : 'text-white'}`}>Expense</button>
                           </div>
                        </div>
                        <div className="md:col-span-1 space-y-2">
                           <label className="text-[11px] font-black text-white uppercase tracking-widest px-1">Amount (₹)</label>
                           <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xl font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-all" required />
                        </div>
                        <div className="md:col-span-1 space-y-2">
                           <label className="text-[11px] font-black text-white uppercase tracking-widest px-1">Description</label>
                           <input type="text" placeholder="What was it for?" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-all" required />
                        </div>
                        <div className="md:col-span-1 space-y-2">
                           <label className="text-[11px] font-black text-white uppercase tracking-widest px-1">Category</label>
                           <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-slate-700 outline-none focus:border-indigo-500/50 appearance-none bg-no-repeat bg-[right_1.5rem_center] transition-all cursor-pointer" required>
                              <option value="" className="bg-[#0f172a]">Select category</option>
                              {categories.filter(c => c.type === form.type).map(c => <option key={c._id} value={c._id} className="bg-[#0f172a]">{c.name}</option>)}
                           </select>
                        </div>
                        <div className="md:col-span-4 mt-2">
                           <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/10">Confirm Transaction</button>
                        </div>
                     </form>
                  </div>
               </motion.div>
             )}
          </AnimatePresence>

          {/* MAIN STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl transition-all duration-500">
                   <WalletIcon className="w-7 h-7" />
                 </div>
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">Operational</span>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-white uppercase tracking-[3px] mb-2 italic">Total Balance</p>
                 <h3 className="text-3xl font-extrabold text-white mb-2">₹{(summary.balance || 0).toLocaleString()}</h3>
                 <div className="flex items-center gap-2">
                   <div className="h-1 bg-white/5 rounded-full flex-1 overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[65%]" />
                   </div>
                   <span className="text-[10px] font-bold text-white uppercase">Vault</span>
                 </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.1 }} className="bg-indigo-600/10 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] p-8 flex flex-col gap-6 group hover:border-indigo-500/40 transition-all">
               <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 transition-all duration-500">
                   <ArrowTrendingUpIcon className="w-7 h-7" />
                 </div>
                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">Income</span>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-white uppercase tracking-[3px] mb-2 italic">Total Income</p>
                 <h3 className="text-3xl font-extrabold text-white mb-2">+₹{(summary.totalIncome || 0).toLocaleString()}</h3>
                 <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                   <ArrowUpIcon className="w-3 h-3" /> 12% Growth
                 </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y: 0 }} transition={{ delay: 0.2 }} className="bg-rose-600/5 backdrop-blur-2xl border border-rose-500/10 rounded-[2.5rem] p-8 flex flex-col gap-6 group hover:border-rose-500/30 transition-all">
               <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/20 transition-all duration-500">
                   <ArrowTrendingDownIcon className="w-7 h-7" />
                 </div>
                 <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-400/10 px-3 py-1 rounded-full border border-rose-400/20">Spending</span>
              </div>
              <div>
                 <p className="text-[11px] font-bold text-white uppercase tracking-[3px] mb-2 italic">Total Expenses</p>
                 <h3 className="text-3xl font-extrabold text-white mb-2">-₹{(summary.totalExpense || 0).toLocaleString()}</h3>
                 <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                   <ArrowDownIcon className="w-3 h-3" /> 5% Increase
                 </p>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            
            <div className="lg:col-span-8 flex flex-col gap-10">
               {/* CHART AREA */}
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 relative z-10">
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold text-white uppercase tracking-tight">Income Flow</h3>
                       <p className="text-xs font-medium text-white">Analytics visualization across recordsets</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                       <button onClick={() => setChartView("live")} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest italic transition-all ${chartView === 'live' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}>Live</button>
                       <button onClick={() => setChartView("history")} className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest italic transition-all ${chartView === 'history' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}>History</button>
                    </div>
                  </div>
                  <div className="h-[350px] sm:h-[450px] relative z-10">
                    <DashboardCharts view={chartView} />
                  </div>
               </motion.div>

               {/* ACTIVITY FEED */}
               <div className="space-y-8">
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Recent Activity</h3>
                     </div>
                     <div className="bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 overflow-hidden focus-within:border-indigo-500/50 transition-all min-w-[250px]">
                        <MagnifyingGlassIcon className="w-4 h-4 text-white" />
                        <input 
                           type="text" placeholder="Search..." className="w-full h-11 bg-transparent pl-3 text-xs font-medium text-white outline-none placeholder:text-white" 
                           onChange={e => setFilters({...filters, q: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="grid gap-3">
                    <AnimatePresence mode="popLayout">
                      {transactions.map((tx, i) => (
                        <TransactionCard key={tx._id} transaction={tx} onDelete={handleDelete} index={i} />
                      ))}
                    </AnimatePresence>
                    {transactions.length === 0 && !loading && (
                       <div className="py-24 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                          <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                             <ChartBarSquareIcon className="w-8 h-8 text-slate-700" />
                          </div>
                          <p className="text-sm font-bold text-white uppercase tracking-widest">No activity found</p>
                       </div>
                    )}
                  </div>

                  {/* PAGINATION */}
                  <div className="flex justify-between items-center py-6 px-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem]">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white uppercase tracking-[2px]">Page <span className="text-white">{page}</span> of {totalPages}</p>
                        <div className="h-1 bg-white/5 rounded-full w-20 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${(page/totalPages)*100}%` }} /></div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center active:scale-90"><ChevronLeftIcon className="w-5 h-5 text-slate-400" /></button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center active:scale-90"><ChevronRightIcon className="w-5 h-5 text-slate-400" /></button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8">
               {/* SUMMARY CARD */}
               <div className="bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-indigo-900/40">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 blur-[100px] rounded-full" />
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Account Hub</p>
                           <h4 className="text-lg font-bold text-white uppercase tracking-tight">Summary</h4>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/50 animate-pulse" />
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end border-b border-white/5 pb-4">
                              <span className="text-xs font-bold text-white uppercase tracking-widest italic leading-none">Net Balance</span>
                              <span className="text-2xl font-black italic text-white leading-none">₹{(summary.balance || 0).toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between items-end border-b border-white/5 pb-4">
                              <span className="text-xs font-bold text-white uppercase tracking-widest italic leading-none">Expense Ratio</span>
                              <span className="text-2xl font-black italic text-rose-400 leading-none">{(summary.totalExpense / (summary.totalIncome || 1) * 100).toFixed(1)}%</span>
                           </div>
                        </div>

                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 text-center space-y-4">
                           <p className="text-[10px] font-bold text-white uppercase tracking-widest">Financial Tip</p>
                           <p className="text-sm font-medium text-slate-300 italic leading-relaxed">"Aim for <span className="text-indigo-400 font-bold">20% savings</span> this month to hit your goals."</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* CATEGORY EXPLORER */}
               <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-8">Categories</h3>
                  <div className="space-y-6">
                     {categories.slice(0, 4).map((cat, i) => (
                        <div key={cat._id} className="group cursor-pointer">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">{cat.name}</span>
                              <span className="text-[10px] font-bold text-white/20 select-none">0{i+1}</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.3)] shadow-[cat.color]" 
                                   style={{ width: `${Math.random() * 60 + 20}%`, backgroundColor: cat.color }} />
                           </div>
                        </div>
                     ))}
                     <button 
                        onClick={() => router.push("/reports")}
                        className="w-full py-4 border border-dashed border-white/10 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all mt-4 italic active:scale-95"
                     >
                        View Full Statistics
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
