"use client";

import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function TransactionCard({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === "income";
  const date = tx.date ? new Date(tx.date).toLocaleDateString() : new Date(tx.createdAt).toLocaleDateString();

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-white/50 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all"
    >
      {/* LEFT */}
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
            isIncome ? "bg-green-50 text-green-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {isIncome ? (
            <ArrowTrendingUpIcon className="w-6 h-6" />
          ) : (
            <ArrowTrendingDownIcon className="w-6 h-6" />
          )}
        </div>

        <div>
          <div className="font-semibold capitalize text-slate-800">
            {tx.type}
            <span className="ml-2 text-xs text-slate-400">• {date}</span>
          </div>

          <div className="text-sm text-slate-600 mt-1">
            {tx.description || "No description"}
          </div>
        </div>
      </div>

      {/* RIGHT: AMOUNT + EDIT + DELETE */}
      <div className="flex items-center gap-3">
        <div className={`font-bold text-lg ${isIncome ? "text-green-600" : "text-rose-600"}`}>
          ₹{Number(tx.amount).toLocaleString()}
        </div>

        <button
          title="Edit"
          onClick={() => onEdit && onEdit(tx)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
        >
          <PencilSquareIcon className="w-5 h-5 text-slate-700" />
        </button>

        <button
          title="Delete"
          onClick={() => onDelete && onDelete(tx._id)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-red-200 transition"
        >
          <TrashIcon className="w-5 h-5 text-red-600" />
        </button>
      </div>
    </motion.li>
  );
}
