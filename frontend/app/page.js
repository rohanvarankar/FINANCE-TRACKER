"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5] text-slate-900">

      {/* BACKGROUND FLOATING SHAPES */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-teal-300/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse-slower" />

      {/* MAIN CONTENT */}
      <section className="relative px-6 md:px-16 lg:px-28 py-24 md:py-40 flex flex-col md:flex-row items-center justify-between gap-20">

        {/* HERO TEXT */}
        <div className="max-w-xl space-y-6 animate-fade-up">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Master Your{" "}
            <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
              Money Flow
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Track your expenses effortlessly, analyze your financial habits, and plan smarter.
            Your journey to stress-free money management starts here.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push("/auth/signup")}
              className="px-10 py-3 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.03] transition"
            >
              Create Free Account
            </button>

            <button
              onClick={() => router.push("/auth/signin")}
              className="px-10 py-3 rounded-full border border-teal-600 text-teal-700 font-semibold hover:bg-teal-50 shadow-sm transition"
            >
              Login
            </button>
          </div>

          <p className="text-sm text-slate-500">
            100% secure • No credit card required
          </p>
        </div>

        {/* HERO IMAGE / PREVIEW */}
        <div className="relative animate-float">
          <div className="w-[330px] md:w-[420px] h-[420px] bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              fill
              className="object-cover"
            />
          </div>

          {/* GLOW BEHIND IMAGE */}
          <div className="absolute inset-0 rounded-3xl bg-teal-300/20 blur-2xl -z-10" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-6 md:px-16 lg:px-28 py-20 bg-white/70 backdrop-blur-xl border-y border-teal-100">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-5 animate-fade-up">
          Smart Features, Stunning Simplicity
        </h2>
        <p className="text-center text-slate-600 mb-14 max-w-2xl mx-auto animate-fade-up">
          Everything you need to take control of your money — beautifully designed.
        </p>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Feature */}
          <div className="group p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition duration-300 border border-teal-50 hover:border-teal-200 animate-fade-up">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl flex items-center justify-center text-3xl shadow-lg mb-5 group-hover:scale-110 transition">
              ₹
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Every Transaction</h3>
            <p className="text-slate-600">
              Log income and expenses instantly and categorize with ease.
            </p>
          </div>

          {/* Feature */}
          <div className="group p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition duration-300 border border-teal-50 hover:border-teal-200 animate-fade-up delay-100">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl flex items-center justify-center text-3xl shadow-lg mb-5 group-hover:scale-110 transition">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-3">Beautiful Analytics</h3>
            <p className="text-slate-600">
              Visual charts that help you understand where your money goes.
            </p>
          </div>

          {/* Feature */}
          <div className="group p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition duration-300 border border-teal-50 hover:border-teal-200 animate-fade-up delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl flex items-center justify-center text-3xl shadow-lg mb-5 group-hover:scale-110 transition">
              🔒
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure by Design</h3>
            <p className="text-slate-600">
              Your financial data is encrypted and stored safely.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 md:px-16 lg:px-28 py-24 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-3xl p-16 shadow-2xl animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Take Charge of Your Finances Today</h2>
          <p className="text-lg text-teal-100 mb-10">
            Clear insights. Better habits. Stronger savings.
          </p>

          <button
            onClick={() => router.push("/auth/signup")}
            className="px-12 py-4 rounded-full bg-white text-teal-700 font-semibold shadow-xl hover:bg-slate-100 hover:scale-[1.03] transition"
          >
            Start for Free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Personal Expense Tracker · Manage Money Smarter
      </footer>

      {/* ANIMATIONS */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
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
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          .animate-pulse-slower {
            animation: pulse-slower 10s ease-in-out infinite;
          }

          @keyframes fade-up {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0px); }
          }
          .animate-fade-up {
            animation: fade-up 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
