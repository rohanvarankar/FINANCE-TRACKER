"use client";

import { motion } from "framer-motion";

/**
 * Props:
 * - open (bool)
 * - onClose()
 * - onConfirm()  -> async action
 * - message (optional)
 */

export default function DeleteConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.12 }}
        className="relative z-10 w-full max-w-sm mx-4 bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl p-5 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirm Delete</h3>
        <p className="text-sm text-slate-600">{message || "Are you sure you want to delete this transaction? This action cannot be undone."}</p>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}
