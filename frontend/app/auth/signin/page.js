"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/utils/auth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

// ─── Floating Circles Background ─────────────────────────────────────────────
function AuthBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="fixed inset-0 bg-[#020617] -z-10" />;

  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden -z-10">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[20%] right-[20%] w-[20%] h-[20%] bg-purple-600/10 rounded-full blur-[100px]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
    </div>
  );
}

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get("registered") === "true";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/signin", form);
      setToken(res.data.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500/30">
      <AuthBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[450px]"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 mx-auto mb-6"
          >
            <ShieldCheckIcon className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Welcome Back</h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium">Log in to manage your financial portfolio.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {showSuccess && !error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 mb-4"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    Account created successfully. Please sign in.
                  </motion.div>
                )}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all font-medium" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <Link href="/auth/forgot-password" size="sm" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors" />
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all font-medium" 
                    type="password" 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-indigo-600/20"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-slate-400 text-sm font-medium">
                New to FinTrack? 
                <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-2 font-bold underline underline-offset-4 decoration-indigo-400/20 hover:decoration-indigo-400">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <p className="text-[11px] text-slate-500 uppercase tracking-[4px] font-black">Encrypted • Private • Fast</p>
        </div>
      </motion.div>
    </div>
  );
}
