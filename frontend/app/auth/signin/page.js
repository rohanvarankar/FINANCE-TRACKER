"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SigninPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signin", form);
      const token = res.data.accessToken;

      localStorage.setItem("accessToken", token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5] 
        overflow-hidden px-4
      "
    >
      {/* Floating Glow Circles */}
      <div className="absolute top-10 left-10 w-52 h-52 bg-teal-300/30 blur-3xl rounded-full animate-glow"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-400/25 blur-3xl rounded-full animate-glow-slow"></div>

      {/* SIGN-IN CARD */}
      <div
        className="
          relative w-full max-w-md 
          bg-white/40 backdrop-blur-xl 
          shadow-2xl rounded-2xl 
          p-10 border border-white/40
          animate-fade-up
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="
              w-20 h-20 rounded-full shadow-xl 
              bg-gradient-to-br from-teal-500 to-teal-700 
              flex items-center justify-center
            "
          >
            <Image src="/money-icon.png" width={50} height={50} alt="logo" />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="
            text-3xl font-extrabold text-center 
            bg-gradient-to-r from-teal-600 to-teal-800 
            bg-clip-text text-transparent
          "
        >
          Welcome Back
        </h1>
        <p className="text-center text-slate-600 mt-1 mb-6 text-sm">
          Sign in to continue managing your expenses
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg text-center text-sm mb-4">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="
              w-full p-3 rounded-xl bg-white/70 
              border border-slate-300 
              focus:ring-2 focus:ring-teal-300 
              outline-none placeholder-slate-500 
              transition
            "
            onChange={handleChange}
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="
              w-full p-3 rounded-xl bg-white/70 
              border border-slate-300 
              focus:ring-2 focus:ring-teal-300 
              outline-none placeholder-slate-500 
              transition
            "
            onChange={handleChange}
          />

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <span
              onClick={() => router.push("/auth/forgot-password")}
              className="text-teal-700 hover:underline cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl 
              bg-gradient-to-r from-teal-600 to-teal-700 
              text-white font-semibold shadow-lg
              hover:scale-[1.02] transition 
              disabled:opacity-50
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-teal-700 font-medium hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fade-up {
            0% { opacity: 0; transform: translateY(14px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fade-up .7s ease-out forwards;
          }

          @keyframes glow {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          .animate-glow {
            animation: glow 6s infinite ease-in-out;
          }
          .animate-glow-slow {
            animation: glow 10s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
