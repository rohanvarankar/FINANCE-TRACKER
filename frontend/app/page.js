"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InstallPrompt from "../components/InstallPrompt";

// ── Notification helper (inline — no external util needed) ──────────────────
async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications.");
    return;
  }
  if (Notification.permission === "granted") {
    alert("Notifications are already enabled!");
    return;
  }
  if (Notification.permission === "denied") {
    alert(
      "Notifications are blocked. Please enable them in your browser settings.",
    );
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    new Notification("TrackFin 🎉", {
      body: "Notifications enabled! We'll keep you updated.",
      icon: "/icons/icon-192.png",
    });
  }
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Floating particles ────────────────────────────────────────────────────────
function Particles() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 4,
        dur: Math.random() * 6 + 4,
      })),
    );
  }, []);

  if (!mounted)
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />
    );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [-20, 20, -20], opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Features", "Preview", "How It Works", "Reviews"];

const FEATURES = [
  {
    icon: "💳",
    title: "Smart Tracking",
    desc: "Log income & expenses easily with categories and simple labels.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    icon: "📊",
    title: "Visual Charts",
    desc: "See your spending habits with clear pie and bar charts.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: "🎯",
    title: "Budgeting",
    desc: "Set monthly limits and see how much you have left to spend.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: "🏆",
    title: "Savings Goals",
    desc: "Save for what matters most with progress bars to keep you motivated.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: "🔁",
    title: "Recurring Bills",
    desc: "Never miss a payment. Track rent, subscriptions, and more.",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your financial data is protected and kept private at all times.",
    color: "from-slate-500 to-slate-700",
  },
];

const STEPS = [
  {
    num: "01",
    icon: "👤",
    title: "Create Your Account",
    desc: "Sign up securely with email verification and get access instantly.",
  },
  {
    num: "02",
    icon: "⚙️",
    title: "Personalize Categories",
    desc: "Create custom categories like Food, Travel, Bills for better tracking.",
  },
  {
    num: "03",
    icon: "💬",
    title: "Add Transactions Smartly",
    desc: "Speak like 'I spent ₹500 on food' and AI will auto-detect details.",
  },
  {
    num: "04",
    icon: "🎤",
    title: "Voice Input",
    desc: "Speak your expenses and TrackFin converts them into transactions.",
  },
  {
    num: "05",
    icon: "🤖",
    title: "Chat with AI",
    desc: "Ask insights like 'Where did I spend most this month?'",
  },
  {
    num: "06",
    icon: "📊",
    title: "Track & Analyze",
    desc: "View charts, reports, and insights to control your finances.",
  },
];

const SCREENSHOTS = [
  {
    src: "/hero-dashboard-v2.png",
    title: "All-in-One Dashboard",
    desc: "Your complete financial overview — balance, income, expenses, and savings rate.",
    badge: "Dashboard",
  },
  {
    src: "/feature-charts.png",
    title: "Detailed Analytics",
    desc: "Understand spending with beautiful charts and monthly breakdowns.",
    badge: "Analytics",
  },
  {
    src: "/feature-budgets.png",
    title: "Budgets & Goals",
    desc: "Stay on track with visual progress bars and animated goal rings.",
    badge: "Budgets",
  },
];

const REVIEWS = [
  {
    name: "Priya Sharma",
    role: "Freelancer",
    text: "TrackFin completely changed how I manage my income. The budget tracking is a total game-changer!",
    avatar: "P",
    color: "from-teal-500 to-emerald-600",
  },
  {
    name: "Arjun Mehta",
    role: "Engineer",
    text: "The recurring transactions feature alone is worth it. My subscriptions never sneak up on me anymore.",
    avatar: "A",
    color: "from-violet-500 to-purple-600",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [notifPerm, setNotifPerm] = useState("default");

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // 🔥 AUTH CHECK (MAIN FIX)
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.replace("/dashboard"); // redirect if already logged in
    } else {
      setCheckingAuth(false); // allow page render
    }
  }, [router]);

  // ⛔ Prevent flicker (VERY IMPORTANT)
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b18] text-white">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Track whether the install banner is visible so we can push the navbar down

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    if ("Notification" in window) setNotifPerm(Notification.permission);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNotification = async () => {
    await requestNotificationPermission();
    if ("Notification" in window) setNotifPerm(Notification.permission);
  };

  const scrollTo = (id) => {
    document
      .getElementById(id.toLowerCase().replace(/ /g, "-"))
      ?.scrollIntoView({ behavior: "smooth" });
  };

  /*
    Banner heights:
      mobile  (< sm)  ≈ 112 px
      tablet  (sm-lg) ≈  56 px
      desktop (≥ lg)  ≈  56 px
    Navbar height: 80 px (h-20)
    So when banner is visible the navbar top offset equals the banner height.
  */

  return (
    <div className="min-h-screen bg-[#060b18] text-white overflow-x-hidden font-sans">
      <InstallPrompt />

      {/* ── NAVBAR — offset downward when banner is showing ────────────── */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 top-0 ${
          scrolled
            ? "bg-[#060b18]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-xl"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/40 text-sm sm:text-base">
              ₹
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              Fin<span className="text-teal-400">Track</span>
            </span>
          </div>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-400">
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className="hover:text-white transition-colors"
              >
                {l}
              </button>
            ))}
          </div>

          {/* Right: bell + sign in + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <button
              onClick={handleNotification}
              title={
                notifPerm === "granted"
                  ? "Notifications enabled"
                  : notifPerm === "denied"
                    ? "Notifications blocked — enable in settings"
                    : "Enable notifications"
              }
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all border text-sm ${
                notifPerm === "granted"
                  ? "bg-teal-500/20 border-teal-500/50 text-teal-400"
                  : notifPerm === "denied"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {notifPerm === "denied" ? "🔕" : "🔔"}
            </button>

            <button
              onClick={() => router.push("/auth/signin")}
              className="hidden md:block text-sm text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold bg-teal-500 text-white rounded-full shadow-lg hover:shadow-teal-500/50 transition-all whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className={`relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 transition-all duration-300`}
      >
        <Particles />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-teal-400/25 bg-teal-400/8 text-teal-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            ✓ Smart Financial Insights powered by AI
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight leading-tight">
            Master Your{" "}
            <span className="text-teal-400 font-black italic">
              Financial Life
            </span>
          </h1>
          <p className="max-w-xl sm:max-w-2xl text-base sm:text-lg text-slate-400 mb-8 sm:mb-10 mx-auto leading-relaxed px-2">
            The all-in-one personal finance platform — track your spending, set
            budgets, and achieve your goals with ease.
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs xs:max-w-none">
            <button
              onClick={() => router.push("/auth/signup")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-teal-500/30 hover:bg-teal-400 transition"
            >
              Start Free Today
            </button>
            <button
              onClick={() => scrollTo("Preview")}
              className="px-6 sm:px-8 py-3 sm:py-4 border border-white/10 bg-white/5 text-white rounded-2xl font-bold text-base sm:text-lg hover:bg-white/10 transition"
            >
              See it in Action
            </button>
          </div>
        </motion.div>

        {/* Hero dashboard image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 sm:mt-20 w-full max-w-5xl relative px-2 sm:px-4"
        >
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-3xl bg-slate-900">
            <Image
              src="/hero-dashboard-v2.png"
              alt="TrackFin Dashboard"
              width={1200}
              height={750}
              className="w-full h-auto mt-6 sm:mt-8 opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-transparent to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center uppercase tracking-widest">
          {[
            { end: 100, label: "Active Users", suffix: "+" },
            { end: 40, label: "Log Records", suffix: "+" },
            { end: 100, label: "Security", suffix: "%" },
            { end: 100, label: "Productivity", suffix: "%" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <p className="text-[10px] text-white font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-20 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Total Control
          </h2>
          <p className="text-white max-w-md mx-auto text-sm sm:text-base">
            Everything you need to grow your wealth in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-teal-500/50 transition group"
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-lg sm:text-xl mb-5 sm:mb-6 shadow-xl group-hover:scale-110 transition`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                {f.title}
              </h3>
              <p className="text-white text-sm leading-relaxed italic">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            How TrackFin Works
          </h2>
          <p className="text-white max-w-2xl mx-auto text-sm sm:text-base">
            From adding transactions to AI-powered insights — everything is
            simple, fast, and smart.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-teal-500/40 transition group"
            >
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <span className="text-2xl sm:text-3xl">{step.icon}</span>
                <span className="text-xs sm:text-sm font-bold text-teal-400">
                  {step.num}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-white text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 sm:mt-16">
          <button
            onClick={() => router.push("/auth/signup")}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-500 text-white rounded-2xl font-bold shadow-lg hover:bg-teal-400 transition text-sm sm:text-base"
          >
            Start Using TrackFin
          </button>
        </div>
      </section>

      {/* ── PREVIEW ──────────────────────────────────────────────────────── */}
      <section
        id="preview"
        className="py-20 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-20 sm:space-y-32"
      >
        {SCREENSHOTS.map((s, i) => (
          <div
            key={s.title}
            className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 sm:gap-12 lg:gap-24`}
          >
            <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest">
                {s.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black italic tracking-tighter uppercase">
                {s.title}
              </h3>
              <p className="text-white text-base sm:text-lg italic leading-relaxed">
                {s.desc}
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                <Image
                  src={s.src}
                  alt={s.title}
                  width={800}
                  height={500}
                  className="w-full h-auto hover:scale-105 transition duration-700"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section
        id="reviews"
        className="py-20 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-12 sm:mb-16">
          Loved by Users
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="p-7 sm:p-10 rounded-2xl sm:rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-left italic"
            >
              <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8 leading-relaxed">
                "{r.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center font-bold text-white flex-shrink-0`}
                >
                  {r.avatar}
                </div>
                <div className="text-xs font-bold">
                  <p className="text-white">{r.name}</p>
                  <p className="text-white">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto rounded-3xl sm:rounded-[3.5rem] bg-teal-500 p-10 sm:p-16 md:p-24 shadow-2xl shadow-teal-500/20">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 sm:mb-6">
            Join the Elite Today
          </h2>
          <p className="text-teal-100 font-bold mb-8 sm:mb-10 max-w-sm mx-auto uppercase tracking-widest leading-relaxed text-sm sm:text-base">
            Start taking control of your future without spending a rupee.
          </p>
          <button
            onClick={() => router.push("/auth/signup")}
            className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-teal-600 rounded-full font-black uppercase text-xs sm:text-sm tracking-widest hover:bg-slate-100 transition shadow-2xl active:scale-95"
          >
            Open Free Account
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-8 sm:py-10 border-t border-white/5 text-center text-white text-[10px] font-bold uppercase tracking-widest px-4">
        © {new Date().getFullYear()} TrackFin — Your Financial Engine. Built
        with ❤️ in India.
      </footer>
    </div>
  );
}
