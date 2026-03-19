"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UsersIcon, 
  UserGroupIcon, 
  ArrowRightOnRectangleIcon, 
  PlusIcon,
  SparklesIcon,
  HomeIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppBackground from "../components/AppBackground";
import ChatbotBubble from "../components/ChatbotBubble";

export default function Households() {
  const router = useRouter();
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ name: "", inviteCode: "" });
  const [showJoin, setShowJoin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const fetchHousehold = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await api.get("/households/details", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setHousehold(res.data.household);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHousehold();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api.post("/households/create", { name: form.name }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchHousehold();
      setShowCreate(false);
    } catch (err) { alert("Failed to create household"); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api.post("/households/join", { inviteCode: form.inviteCode }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchHousehold();
      setShowJoin(false);
    } catch (err) { alert("Invalid invite code"); }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this household?")) return;
    try {
      const token = getToken();
      await api.post("/households/leave", {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setHousehold(null);
    } catch (err) { alert(err.response?.data?.message || "Failed to leave"); }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <AppBackground />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={() => router.push("/auth/signin")} />
      
      <div className="flex-1 flex flex-col md:ml-72 relative z-10 min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6 md:p-12 w-full mx-auto max-w-[1400px]">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                   <UserGroupIcon className="w-4 h-4" />
                 </div>
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Shared Ecosystem</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Households</h1>
              <p className="text-slate-400 font-medium text-sm">Managing family-wide financial goals & collective budgets.</p>
            </div>
          </div>

          {!household ? (
            <div className="grid md:grid-cols-2 gap-8">
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center flex flex-col items-center group transition-all"
               >
                  <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600 mb-8 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                     <HomeIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Create a Home</h3>
                  <p className="text-slate-500 mb-10 max-w-xs text-sm font-medium leading-relaxed italic">Start a fresh financial shared space and invite your family members today.</p>
                  <button 
                    onClick={() => setShowCreate(true)}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-3"
                  >
                    <PlusIcon className="w-5 h-5" /> Start New Household
                  </button>
               </motion.div>

               <motion.div 
                 whileHover={{ y: -5 }}
                 className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center flex flex-col items-center group transition-all"
               >
                  <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-600/10 mb-8 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-600/10 group-hover:scale-110 transition-transform border border-indigo-500/20">
                     <SparklesIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Join Existing</h3>
                  <p className="text-slate-500 mb-10 max-w-xs text-sm font-medium leading-relaxed italic">Have an invite code? Enter it to sync your budgets with your team.</p>
                  <button 
                    onClick={() => setShowJoin(true)}
                    className="w-full py-5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 text-slate-300 rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
                  >
                    <UsersIcon className="w-5 h-5" /> Enter Invite Code
                  </button>
               </motion.div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-10">
               {/* MAIN HOUSEHOLD CARD */}
               <div className="lg:col-span-8 space-y-10">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full" />
                     <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3">
                              <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                              <h2 className="text-4xl font-extrabold text-white tracking-tight uppercase italic">{household.name}</h2>
                           </div>
                           <p className="text-slate-500 text-sm font-medium tracking-[2px] uppercase">Established on {new Date(household.createdAt).toLocaleDateString()} • {household.members.length} Members</p>
                           <div className="pt-6 flex items-center gap-4">
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6 group/code cursor-pointer active:scale-95 transition-all">
                                 <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Invite Code</p>
                                    <p className="text-xl font-black text-indigo-400 tracking-[5px] uppercase">{household.inviteCode}</p>
                                 </div>
                                 <button onClick={() => { navigator.clipboard.writeText(household.inviteCode); alert("Copied!"); }} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white group-hover/code:bg-indigo-600 group-hover/code:text-white transition-all">
                                    <ClipboardDocumentIcon className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col gap-4">
                           <button onClick={handleLeave} className="px-8 py-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl font-bold flex items-center gap-3 hover:bg-rose-500/20 transition-all uppercase text-[10px] tracking-widest">
                             <ArrowRightOnRectangleIcon className="w-5 h-5" /> Leave Household
                           </button>
                        </div>
                     </div>
                  </motion.div>

                  {/* MEMBERS LIST */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-3 px-4">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">Active Members</h3>
                     </div>
                     <div className="grid sm:grid-cols-2 gap-6">
                        {household.members.map((member, i) => (
                           <motion.div 
                             initial={{ opacity:0, x: -20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1 }}
                             key={member._id} 
                             className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-6 group hover:border-white/20 transition-all"
                           >
                              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group-hover:scale-105 transition-transform">
                                 {member.avatarUrl ? <img src={member.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <UserCircleIcon className="w-full h-full text-slate-700" />}
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-lg font-bold text-white uppercase tracking-tight">{member.username}</h4>
                                 <p className="text-xs font-bold text-slate-500">{member.email}</p>
                              </div>
                              <ChevronRightIcon className="w-5 h-5 text-slate-800" />
                           </motion.div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* SIDEBAR INSIGHTS */}
               <div className="lg:col-span-4 space-y-10">
                  <div className="bg-slate-900/50 border border-indigo-500/30 rounded-[3rem] p-10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full" />
                     <div className="relative z-10 space-y-8">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Shared Power</p>
                           <h4 className="text-xl font-bold text-white uppercase tracking-tight">Household Stats</h4>
                        </div>
                        <div className="space-y-6">
                           <div className="flex justify-between items-end border-b border-white/5 pb-4">
                              <span className="text-[10px] font-black italic text-slate-500 uppercase tracking-widest">Total Members</span>
                              <span className="text-2xl font-black italic text-white uppercase">{household.members.length}</span>
                           </div>
                           <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 text-center italic space-y-3">
                              <p className="text-[10px] font-black italic text-indigo-400 uppercase tracking-widest">Collective Goal</p>
                              <p className="text-sm font-medium text-slate-300">Invite your friends to start setting shared goals!</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* MODALS */}
          <AnimatePresence>
            {showCreate && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl relative">
                   <button onClick={() => setShowCreate(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                   <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Create Household</h3>
                   <p className="text-slate-500 text-sm mb-8 italic">Name your shared financial space.</p>
                   <form onSubmit={handleCreate} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 italic">Household Name</label>
                        <input type="text" placeholder="e.g. My Family" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:border-indigo-500/50 transition-all" required />
                      </div>
                      <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all">Confirm Creation</button>
                   </form>
                </motion.div>
              </div>
            )}

            {showJoin && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl relative">
                   <button onClick={() => setShowJoin(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                   <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Join Household</h3>
                   <p className="text-slate-500 text-sm mb-8 italic">Enter the unique code shared with you.</p>
                   <form onSubmit={handleJoin} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 italic">Invite Code</label>
                        <input type="text" placeholder="PLACEHOLDER" value={form.inviteCode} onChange={e => setForm({...form, inviteCode: e.target.value.toUpperCase()})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:border-indigo-500/50 tracking-[5px] text-center transition-all uppercase" required />
                      </div>
                      <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all">Join Team</button>
                   </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <ChatbotBubble />
        </main>
      </div>
    </div>
  );
}

function XMarkIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
