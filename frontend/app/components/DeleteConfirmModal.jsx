"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function DeleteConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="relative z-10 w-full max-w-sm bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden text-center"
      >
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-6">
          <ExclamationTriangleIcon className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          {message || "This transaction will be permanently removed. This action cannot be reversed."}
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm} 
            className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-xl shadow-rose-500/10 active:scale-95"
          >
            Yes, Delete
          </button>
          <button 
            onClick={onClose} 
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 font-bold text-sm transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
