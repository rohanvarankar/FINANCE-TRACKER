"use client";

import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function TransactionCard({ transaction, onDelete, onEdit, index }) {
  const tx = transaction;
  const isIncome = tx.type === "income";
  const date = tx.date ? new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 sm:p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 gap-4"
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
            isIncome 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5" 
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xl shadow-rose-500/5"
          }`}
        >
          {isIncome ? (
            <ArrowTrendingUpIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <ArrowTrendingDownIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          )}
        </div>

        <div className="overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
              isIncome 
                ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" 
                : "bg-rose-400/10 text-rose-400 border-rose-400/20"
            }`}>
              {tx.type === 'income' ? 'Income' : 'Expense'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-tight">{date}</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none truncate w-40 sm:w-64">
            {tx.description || "Unlabeled Entry"}
          </h4>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-10 pl-16 sm:pl-0">
        <div className="text-left sm:text-right">
           <p className={`text-lg sm:text-xl font-extrabold tracking-tight leading-none ${isIncome ? "text-emerald-400" : "text-white"}`}>
             {isIncome ? "+" : "-"}₹{Number(tx.amount).toLocaleString()}
           </p>
           {tx.categoryId?.name && (
              <p className="text-[10px] font-bold text-slate-600 tracking-widest mt-1 uppercase">
                 {tx.categoryId.name}
              </p>
           )}
        </div>

        <div className="flex gap-2">
           <button 
              onClick={() => onEdit && onEdit(tx)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white border border-white/5 transition-all active:scale-95"
           >
              <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
           </button>
           <button 
              onClick={() => onDelete && onDelete(tx._id)}
              className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-white/5 transition-all active:scale-95"
           >
              <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
