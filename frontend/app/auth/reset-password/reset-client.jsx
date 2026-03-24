"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LockClosedIcon, 
  ArrowRightIcon,
  ShieldCheckIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

// ─── Floating Circles Background ─────────────────────────────────────────────
function AuthBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="fixed inset-0 bg-[#020617] -z-10" />;

  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ADDED: Password Regex
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    // ✅ ADDED: Validation before API call
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be 8+ chars, include uppercase, number & special character");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      setMsg("Password updated successfully!");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Link may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500/30">
      <AuthBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px]"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30 mx-auto mb-6"
          >
             <KeyIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">New Password</h1>
          <p className="text-slate-400 text-sm font-medium">Create a secure new password for <br /><span className="text-indigo-400 font-bold">{email}</span></p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-center text-xs font-bold mb-6">{error}</motion.div>}
              {msg && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-center text-xs font-bold mb-6">{msg}</motion.div>}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-white uppercase tracking-widest px-1">New Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white transition-colors" />
                  <input
                    type="password" placeholder="••••••••" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all font-medium"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="group relative w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-indigo-600/20 disabled:opacity-30"
              >
                {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center text-white text-xs font-medium">
                Wait, I remember it! 
                <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-2 font-bold underline underline-offset-4 decoration-indigo-400/20">Sign In</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}