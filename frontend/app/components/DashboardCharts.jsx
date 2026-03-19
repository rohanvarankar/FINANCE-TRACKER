"use client";

import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-white">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardCharts({ view = "live" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) return;
        
        // Adjust limit based on view: live (recent 10), history (wider 30)
        const limit = view === "history" ? 30 : 10;
        
        const res = await api.get("/transactions/list", {
          params: { limit, sortBy: "date", sortOrder: "asc" },
          headers: { Authorization: `Bearer ${token}` },
        });

        const txs = res?.data?.transactions ?? res?.data ?? [];
        const formattedData = txs.map((t) => ({
          name: new Date(t.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          amount: t.amount,
        }));

        setData(formattedData);
      } catch (err) {} finally { setLoading(false); }
    };
    fetchStats();
  }, [view]);

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center">
       <div className="w-8 h-8 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#475569', fontSize: 10, fontWeight: '700' }}
          dy={15}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#475569', fontSize: 10, fontWeight: '700' }}
          tickFormatter={(val) => `₹${val/1000}k`}
          dx={-15}
        />
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="#6366f1" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorAmount)"
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
