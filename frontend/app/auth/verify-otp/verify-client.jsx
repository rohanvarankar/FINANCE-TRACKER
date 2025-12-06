"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function VerifyOtpClient() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";
  const purpose = params.get("purpose") || "signup";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/verify-otp", {
        email,
        otp,
        purpose,
      });

      setMsg(res.data.message || "OTP verified!");

      setTimeout(() => {
        if (purpose === "reset-password") {
          router.push(`/auth/reset-password?email=${email}`);
        } else {
          router.push("/auth/signin");
        }
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-300/30 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/30 blur-3xl rounded-full animate-pulse-slower"></div>

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl p-10 animate-fade-up">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-teal-700 rounded-full flex items-center justify-center shadow-lg">
            <Image src="/money-icon.png" width={50} height={50} alt="App Icon" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
          Verify OTP
        </h1>

        <p className="text-center text-slate-600 mt-1 mb-4 text-sm">
          OTP sent to <span className="font-medium">{email}</span>
        </p>

        {/* Messages */}
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {msg && <p className="text-green-600 text-center mb-3">{msg}</p>}

        {/* FORM */}
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 rounded-lg bg-white/60 border border-slate-200 placeholder-slate-500
                       focus:ring-2 focus:ring-teal-300 outline-none transition"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 
                       text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl 
                       transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Navigation */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Wrong email?
          <span
            onClick={() =>
              purpose === "signup"
                ? router.push("/auth/signup")
                : router.push("/auth/forgot-password")
            }
            className="text-teal-700 font-medium hover:underline cursor-pointer ml-1"
          >
            Go Back
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
