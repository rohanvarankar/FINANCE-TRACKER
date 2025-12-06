"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Header({ onToggleSidebar, username = "User" }) {
  return (
    <header
      className="
        w-full flex items-center justify-between 
        px-4 md:px-8 py-4
        bg-white/60 backdrop-blur-xl
        border-b border-slate-200 shadow-sm 
        sticky top-0 z-30
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* MOBILE TOGGLE BUTTON (HIDDEN ON DESKTOP) */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="md:hidden p-2 rounded-lg hover:bg-slate-200 active:scale-95 transition"
        >
          <Bars3Icon className="w-6 h-6 text-slate-700" />
        </button>

        {/* LOGO + TEXT */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3"
        >
          {/* LOGO ICON */}
          <div className="
            w-10 h-10 rounded-lg 
            bg-gradient-to-br from-teal-500 to-teal-700
            text-white flex items-center justify-center 
            font-bold text-xl shadow-md
          ">
            ₹
          </div>

          {/* TITLE */}
          <div className="leading-tight">
            <h1 className="text-lg md:text-xl font-semibold text-slate-800">
              Personal Expense Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Manage your money smartly
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE — GREETING */}
      <div className="hidden md:flex items-center text-sm text-slate-700">
        Welcome,&nbsp;
        <span className="font-semibold">{username}</span>
      </div>
    </header>
  );
}
