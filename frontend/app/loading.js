"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060b18]">
      
      {/* Glow Background */}
      <div className="absolute w-[300px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full" />

      {/* Loader Container */}
      <div className="relative flex flex-col items-center gap-6">
        
        {/* Animated Ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-white/10 border-t-teal-400"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

        {/* Brand Text */}
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-sm text-slate-400 font-semibold tracking-wide"
        >
          Loading TrackFin...
        </motion.p>
      </div>
    </div>
  );
}