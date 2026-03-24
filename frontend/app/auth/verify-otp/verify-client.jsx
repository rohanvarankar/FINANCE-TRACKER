"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, ShieldCheckIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";

// ─── Floating Circles Background ─────────────────────────────────────────────
function AuthBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="fixed inset-0 bg-[#020617] -z-10" />;

  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden -z-10">
      <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
    </div>
  );
}

export default function VerifyOtpClient() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";
  const purpose = params.get("purpose") || "signup";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleDigitChange = (index, value) => {
    const val = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((ch, i) => { if (i < 6) newDigits[i] = ch; });
    setDigits(newDigits);
    inputRefs.current[pasted.length === 6 ? 5 : pasted.length]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) return setError("Please enter full 6-digit code");
    setLoading(true); setError(""); setMsg("");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp, purpose });
      setMsg("Verification successful!");
      setTimeout(() => {
        router.push(purpose === "reset-password" ? `/auth/reset-password?email=${encodeURIComponent(email)}` : "/auth/signin");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email, purpose });
      setMsg("New code has been sent to your email.");
      setCountdown(60); setCanResend(false);
    } catch (err) { setError("Failed to resend code"); }
    finally { setResending(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500/30">
      <AuthBackground />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px]"
      >
        <button 
          onClick={() => router.push(purpose === 'signup' ? '/auth/signup' : '/auth/forgot-password')} 
          className="mb-8 p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition active:scale-95 group flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30 mx-auto mb-6"
          >
             <EnvelopeOpenIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">Verify Email</h1>
          <p className="text-slate-400 text-sm font-medium">We've sent a 6-digit code to <br /><span className="text-indigo-400 font-bold">{email}</span></p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-teal-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-center text-xs font-bold mb-6">{error}</motion.div>}
              {msg && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-center text-xs font-bold mb-6">{msg}</motion.div>}
            </AnimatePresence>

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i} ref={el => inputRefs.current[i] = el} type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={e => handleDigitChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
                    className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl border border-white/10 outline-none transition-all duration-300 ${d ? "border-indigo-500 bg-white/10 text-white shadow-xl shadow-indigo-500/10" : "bg-white/5 text-slate-300"} focus:border-indigo-500 focus:bg-white/10`}
                  />
                ))}
              </div>

              <button 
                 type="submit" disabled={loading || digits.join("").length < 6} 
                 className="group relative w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-indigo-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                 {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                    "Verify Code"
                 )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Didn't receive code?</p>
              {canResend ? (
                <button onClick={handleResend} className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold text-sm underline underline-offset-4 decoration-indigo-400/20 hover:decoration-indigo-400">{resending ? "Sending..." : "Resend Code"}</button>
              ) : (
                 <div className="text-white text-xs font-medium">
                    Resend available in <span className="text-white font-bold">{countdown}s</span>
                 </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
