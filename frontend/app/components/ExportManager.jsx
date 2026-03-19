"use client";

import { useState } from "react";
import { 
  ArrowDownTrayIcon, 
  DocumentIcon, 
  TableCellsIcon, 
  XMarkIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ExportManager({ open, onClose, summary }) {
  const [loading, setLoading] = useState(false);

  const fetchFullData = async () => {
    try {
      const token = getToken();
      // Fetch more data for the report (last 100 transactions)
      const res = await api.get("/transactions/list?limit=100", { headers: { Authorization: `Bearer ${token}` } });
      return res.data.transactions || [];
    } catch (err) {
      console.error("Export fetch error:", err);
      return [];
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    const data = await fetchFullData();
    if (!data.length) return alert("No transactions found to export.");

    const headers = ["Date", "Description", "Type", "Amount", "Category"];
    const rows = data.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.type.toUpperCase(),
      t.amount,
      t.categoryId?.name || "Uncategorized"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `finance_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
    onClose();
  };

  const handleExportExcel = async () => {
    setLoading(true);
    const data = await fetchFullData();
    if (!data.length) return alert("No transactions found.");

    const worksheetData = data.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description,
      Type: t.type.toUpperCase(),
      Amount: t.amount,
      Category: t.categoryId?.name || "Uncategorized"
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, `finance_ledger_${new Date().toLocaleDateString()}.xlsx`);
    setLoading(false);
    onClose();
  };

  const handleExportPDF = async () => {
    setLoading(true);
    const data = await fetchFullData();
    if (!data.length) return alert("No data.");

    const doc = new jsPDF();
    
    // Add Branding
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Indigo-500
    doc.text("Personal Ledger Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Summary Section
    doc.setDrawColor(220);
    doc.line(14, 35, 196, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Income: INR ${summary?.totalIncome || 0}`, 14, 45);
    doc.text(`Total Expense: INR ${summary?.totalExpense || 0}`, 14, 52);
    doc.text(`Net Balance: INR ${summary?.balance || 0}`, 14, 59);

    // Table
    doc.autoTable({
      startY: 70,
      head: [["Date", "Label", "Category", "Magnitude", "Flow"]],
      body: data.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.categoryId?.name || "-",
        `INR ${t.amount}`,
        t.type.toUpperCase()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      margin: { top: 70 }
    });

    doc.save(`finance_statement_${new Date().toLocaleDateString()}.pdf`);
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl" onClick={onClose} />

      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Verified Active Session</span>
             </div>
             <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Export Engine</h2>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all">
             <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
           <ExportOption 
             icon={<DocumentIcon className="w-6 h-6" />}
             title="Premium Digital PDF"
             description="Branded summary with tables and balances."
             onClick={handleExportPDF}
             loading={loading}
           />
           <ExportOption 
             icon={<TableCellsIcon className="w-6 h-6" />}
             title="Spreadsheet Ledger (XLXS)"
             description="Raw data for Excel, Google Sheets, or Numbers."
             onClick={handleExportExcel}
             loading={loading}
           />
           <ExportOption 
             icon={<TableCellsIcon className="w-6 h-6" />}
             title="Classic CSV Flatfile"
             description="Simple text format for data manipulation."
             onClick={handleExportCSV}
             loading={loading}
           />
        </div>

        <p className="mt-8 text-[10px] font-bold text-slate-700 uppercase tracking-widest text-center italic">Supported Formats: PDF, XLXS, CSV</p>
      </motion.div>
    </div>
  );
}

function ExportOption({ icon, title, description, onClick, loading }) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all flex items-center gap-5 text-left group disabled:opacity-50"
    >
      <div className="w-14 h-14 rounded-2.5xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-0.5">{title}</h4>
        <p className="text-[11px] font-medium text-slate-500 leading-tight">{description}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all">
        <ArrowDownTrayIcon className="w-5 h-5 text-indigo-400" />
      </div>
    </button>
  );
}
