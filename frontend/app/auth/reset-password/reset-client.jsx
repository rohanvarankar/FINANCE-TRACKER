"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      setMsg(res.data.message);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5] overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-300/30 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/30 blur-3xl rounded-full animate-pulse-slower"></div>

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-white/40 animate-fade-up">

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
          Reset Password
        </h1>

        <p className="text-center text-slate-600 mt-2 text-sm">{email}</p>

        {/* Messages */}
        {msg && <p className="text-green-600 text-center mt-3 text-sm">{msg}</p>}
        {error && <p className="text-red-500 text-center mt-3 text-sm">{error}</p>}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="password"
            placeholder="Enter New Password"
            className="
              w-full p-3 rounded-lg bg-white/60 border border-slate-200 
              placeholder-slate-500 focus:outline-none focus:ring-2 
              focus:ring-teal-300 transition
            "
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 
              text-white font-semibold shadow-lg hover:shadow-xl 
              hover:scale-[1.02] transition disabled:opacity-50
            "
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Back to Sign In */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Remember your password?{" "}
          <span
            onClick={() => router.push("/auth/signin")}
            className="text-teal-700 font-medium hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        .animate-fade-up {
          animation: fade-up 0.8s ease-out forwards;
        }

        @keyframes pulse-slow {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        @keyframes pulse-slower {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
