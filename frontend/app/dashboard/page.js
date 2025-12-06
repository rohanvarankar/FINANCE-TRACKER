"use client";

import { useState, useEffect, useCallback } from "react";
import api from "../api/api";
import { useRouter } from "next/navigation";
import { getToken } from "../../utils/auth";
import { mapSort } from "../../utils/sortMapper";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TransactionCard from "../components/TransactionCard";
import EditTransactionModal from "../components/EditTransactionModal";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  // ---------- FORM STATES ----------
  const [form, setForm] = useState({
    type: "income",
    description: "",
    amount: "",
    date: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // ---------- FILTERS ----------
  const [filters, setFilters] = useState({
    type: "",
    minAmount: "",
    maxAmount: "",
    sort: "date",
    order: "desc",
  });

  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const limit = 6;

  // ---------- UI STATES ----------
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------- EDIT MODAL STATES ----------
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // BUILD QUERY PARAMS
  const buildParams = (filtersObj, pageNum) => {
    const { type, minAmount, maxAmount } = filtersObj;
    const params = { page: pageNum, limit };

    if (type) params.type = type;
    if (minAmount !== "") params.minAmount = minAmount;
    if (maxAmount !== "") params.maxAmount = maxAmount;

    try {
      params.sortBy = mapSort(filtersObj);
    } catch {
      params.sortBy = "latest";
    }

    return params;
  };

  // ================================
  // FETCH TRANSACTIONS
  // ================================
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) return setError("Not authenticated");

      const params = buildParams(filters, page);

      const res = await api.get("/transactions/list", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const txs = res?.data?.transactions ?? res?.data ?? [];
      setTransactions(Array.isArray(txs) ? txs : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // LOAD ON MOUNT
  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) return router.push("/auth/signin");
      await fetchTransactions();
    };
    init();
  }, [router, fetchTransactions]);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------- ADD TRANSACTION ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = getToken();
      if (!token) return router.push("/auth/signin");

      const payloadDate =
        form.date && form.date !== "" ? form.date : new Date().toISOString();

      if (!form.description || form.amount === "") {
        return setError("All fields are required");
      }

      const amountNumber = Number(form.amount);
      if (Number.isNaN(amountNumber)) return setError("Invalid number");

      await api.post(
        "/transactions/add",
        {
          type: form.type,
          description: form.description,
          amount: amountNumber,
          date: payloadDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({
        type: "income",
        description: "",
        amount: "",
        date: "",
      });

      setPage(1);
      await fetchTransactions();
    } catch (err) {
      console.error("ADD ERROR:", err);
      setError("Failed to add transaction");
    }
  };

  // ---------------- DELETE TRANSACTION ----------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const token = getToken();

      await api.delete(`/transactions/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchTransactions();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Failed to delete transaction");
    }
  };

  // ---------------- OPEN EDIT MODAL ----------------
  const openEditModal = (tx) => {
    setEditData(tx);
    setEditOpen(true);
  };

  // ---------------- CLOSE EDIT MODAL ----------------
  const closeEditModal = () => {
    setEditOpen(false);
    setEditData(null);
  };

  // ---------------- SAVE EDIT ----------------
  const handleSaveEdit = async (updatedFields) => {
    if (!editData?._id) return;

    try {
      const token = getToken();

      await api.put(`/transactions/update/${editData._id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchTransactions();
      closeEditModal();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      throw err;
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("accessToken");
    router.push("/auth/signin");
  };

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e8fffb] via-white to-[#d0fff5]">

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-5 md:p-8">

          {/* ---------------- SUMMARY CARDS ---------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

            {/* BALANCE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 rounded-xl p-6 shadow-xl"
            >
              <h4 className="text-sm text-slate-600">Total Balance</h4>
              <div className="mt-3 text-3xl font-bold text-teal-700">
                ₹
                {transactions
                  .reduce(
                    (acc, t) =>
                      t.type === "income"
                        ? acc + Number(t.amount)
                        : acc - Number(t.amount),
                    0
                  )
                  .toFixed(2)}
              </div>
            </motion.div>

            {/* INCOME */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 rounded-xl p-6 shadow-xl"
            >
              <h4 className="text-sm text-slate-600">Total Income</h4>
              <div className="mt-3 text-2xl font-semibold text-green-600">
                ₹
                {transactions
                  .filter((t) => t.type === "income")
                  .reduce((a, b) => a + Number(b.amount), 0)
                  .toFixed(2)}
              </div>
            </motion.div>

            {/* EXPENSE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 rounded-xl p-6 shadow-xl"
            >
              <h4 className="text-sm text-slate-600">Total Expense</h4>
              <div className="mt-3 text-2xl font-semibold text-red-500">
                ₹
                {transactions
                  .filter((t) => t.type === "expense")
                  .reduce((a, b) => a + Number(b.amount), 0)
                  .toFixed(2)}
              </div>
            </motion.div>
          </div>

          {/* ---------------- FORM + FILTERS ---------------- */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* ADD FORM */}
            <div className="bg-white/70 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex gap-3">
                  <select
                    name="type"
                    className="input-field w-1/2"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>

                  <input
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    className="input-field w-1/2"
                    value={form.amount}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <input
                  name="description"
                  type="text"
                  className="input-field"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                />

                <input
                  name="date"
                  type="date"
                  className="input-field"
                  value={form.date}
                  onChange={handleChange}
                />

                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    Add
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        type: "income",
                        description: "",
                        amount: "",
                        date: "",
                      })
                    }
                    className="px-5 py-2 rounded-md bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* FILTERS */}
            <div className="bg-white/70 rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Filters & Sorting</h2>

              <div className="flex flex-wrap gap-3">

                <select
                  className="input-field w-40"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>

                <input
                  type="number"
                  placeholder="Min Amount"
                  className="input-field w-28"
                  value={filters.minAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, minAmount: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Max Amount"
                  className="input-field w-28"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    setFilters({ ...filters, maxAmount: e.target.value })
                  }
                />

                <select
                  className="input-field w-40"
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="type">Sort by Type</option>
                </select>

                <select
                  className="input-field w-40"
                  value={filters.order}
                  onChange={(e) =>
                    setFilters({ ...filters, order: e.target.value })
                  }
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>

                <button
                  onClick={() => {
                    setPage(1);
                    fetchTransactions();
                  }}
                  className="px-3 py-2 rounded-md bg-slate-100"
                >
                  Apply
                </button>

                <button
                  onClick={() => {
                    setFilters({
                      type: "",
                      minAmount: "",
                      maxAmount: "",
                      sort: "date",
                      order: "desc",
                    });
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-md bg-slate-100"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- TRANSACTION LIST ---------------- */}
          <div className="mt-8 bg-white/70 rounded-xl p-6 shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <span className="text-sm text-slate-600">
                {loading ? "Loading..." : `${transactions.length} items`}
              </span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-slate-600">No transactions found.</p>
            ) : (
              <ul className="space-y-3">
                {transactions.map((tx) => (
                  <TransactionCard
                    key={tx._id}
                    tx={tx}
                    onDelete={handleDelete}
                    onEdit={openEditModal}
                  />
                ))}
              </ul>
            )}

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-slate-600">Page {page}</span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-md bg-slate-100 disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-md bg-slate-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- EDIT MODAL ---------------- */}
          <EditTransactionModal
            open={editOpen}
            onClose={closeEditModal}
            onSave={handleSaveEdit}
            initialData={editData}
          />

        </main>
      </div>
    </div>
  );
}
