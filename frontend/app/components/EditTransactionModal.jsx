"use client";

import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onSave: async (updatedFields) => void  // returns/resolves on success
 * - initialData: { _id, description, amount, type, date }
 */

export default function EditTransactionModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ type: "income", description: "", amount: "", date: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type || "income",
        description: initialData.description || "",
        amount: initialData.amount !== undefined ? String(initialData.amount) : "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setForm({ type: "income", description: "", amount: "", date: "" });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setError("");
    if (!form.description || form.amount === "" || !form.type) {
      setError("All fields are required");
      return;
    }
    const amountNumber = Number(form.amount);
    if (Number.isNaN(amountNumber)) {
      setError("Amount must be a number");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        description: form.description,
        amount: amountNumber,
        type: form.type,
        date: form.date || new Date().toISOString(),
      });
      // parent should close modal on success, but we can also call onClose if desired
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setError(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.14 }}
        className="relative z-10 w-full max-w-md mx-4 bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-800">Edit Transaction</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <XMarkIcon className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <select name="type" value={form.type} onChange={handleChange} className="input-field w-1/2">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              type="number"
              min="0"
              className="input-field w-1/2"
              placeholder="Amount"
            />
          </div>

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            type="text"
            placeholder="Description"
            className="input-field w-full"
          />

          <input name="date" value={form.date} onChange={handleChange} type="date" className="input-field w-full" />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 mt-2">
            <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-md bg-slate-100">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-700 text-white">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
