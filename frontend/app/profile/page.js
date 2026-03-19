"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AppBackground from "../components/AppBackground";
import { motion } from "framer-motion";
import { ShieldCheckIcon, EnvelopeIcon, IdentificationIcon, CameraIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const [user, setUser] = useState({ username: "", email: "", avatarUrl: null });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await api.get("/profile", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.user) {
        setUser({ username: res.data.user.username, email: res.data.user.email, avatarUrl: res.data.user.avatarUrl });
      }
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Select a file first");
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    try {
      const token = getToken();
      await api.post("/profile/upload-avatar", formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });
      alert("Avatar updated successfully");
      fetchProfile();
      setSelectedFile(null);
    } catch (err) { alert("Upload failed"); }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      <AppBackground />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={() => {}} />
      
      <div className="flex-1 flex flex-col md:ml-72 relative z-10 min-w-0 transition-all">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 w-full mx-auto max-w-[1200px]">
          <div className="mb-12 space-y-1">
             <div className="flex items-center gap-2 mb-2 px-1">
                <SparklesIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Verified Active Session</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">My Profile</h1>
             <p className="text-slate-400 font-medium text-sm">Manage your personal and security preferences.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-24 bg-indigo-600/20 group-hover:bg-indigo-600/30 transition-colors" />
                  <div className="relative z-10 pt-4">
                     {user.avatarUrl ? (
                        <div className="w-28 h-28 rounded-3xl border-4 border-[#020617] shadow-2xl mx-auto overflow-hidden ring-1 ring-white/10 group-hover:scale-105 transition-all duration-500">
                           <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.avatarUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                     ) : (
                        <div className="w-28 h-28 rounded-3xl bg-indigo-600 border-4 border-[#020617] shadow-2xl mx-auto flex items-center justify-center text-white text-3xl font-black ring-1 ring-white/10 group-hover:scale-105 transition-all duration-500 italic">
                           {user.username.charAt(0)}
                        </div>
                     )}
                     <h2 className="mt-6 text-xl font-bold text-white tracking-tight uppercase leading-none">{user.username}</h2>
                     <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Access Provider</p>
                  </div>

                  <div className="mt-10 space-y-4">
                     <label className="flex flex-col items-center gap-3 p-6 border border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all group/upload">
                        <CameraIcon className="w-7 h-7 text-slate-700 group-hover/upload:text-indigo-400 transition-colors" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover/upload:text-slate-400">{selectedFile ? selectedFile.name : "Change Photo"}</span>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                     </label>
                     {selectedFile && (
                        <button onClick={handleUpload} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/10">Update Avatar</button>
                     )}
                  </div>
               </motion.div>
               
               <div className="bg-emerald-500/5 backdrop-blur-2xl border border-emerald-500/10 p-8 rounded-[2rem] flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20"><ShieldCheckIcon className="w-7 h-7" /></div>
                  <div>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Security Ready</p>
                     <p className="text-sm font-bold text-white uppercase italic">Session Encrypted</p>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
               <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 sm:p-12 rounded-[2.5rem]">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-10 flex items-center gap-4">
                     <div className="w-1.5 h-6 bg-indigo-500 rounded-full" /> Personal Details
                  </h3>
                  
                  <div className="grid gap-6">
                     <div className="flex items-center gap-5 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 group hover:border-indigo-500/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-indigo-400 shadow-sm transition-colors"><IdentificationIcon className="w-6 h-6" /></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Account Identifier</p>
                           <p className="text-base font-bold text-white uppercase italic leading-none">{user.username}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-5 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 group hover:border-indigo-500/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-indigo-400 shadow-sm transition-colors"><EnvelopeIcon className="w-6 h-6" /></div>
                        <div className="overflow-hidden">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Verified Email</p>
                           <p className="text-base font-bold text-white uppercase italic leading-none truncate">{user.email}</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 px-2">
                     <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Access Status</p>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Master Administrative Identity</p>
                     </div>
                     <button className="px-8 py-3.5 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-[10px] font-black uppercase tracking-[3px] border border-white/10">Request Data Export</button>
                  </div>
               </motion.div>

               <div className="bg-slate-900 border border-indigo-500/20 rounded-[2.5rem] p-10 sm:p-12 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full" />
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase mb-8 relative z-10 flex items-center gap-4">
                     <div className="w-1.5 h-6 bg-white/20 rounded-full" /> Security Control
                  </h3>
                  <div className="relative z-10">
                     <div className="group/sec p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex justify-between items-center mb-2">
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Multi-Factor Key</p>
                           <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 font-black">ENCRYPTED</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400 italic pr-6 group-hover/sec:text-slate-300 transition-colors">Protect your global access with advanced dual-layer verification protocols.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
