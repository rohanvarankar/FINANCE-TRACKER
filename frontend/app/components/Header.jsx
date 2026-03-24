"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon, 
  RectangleGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { getToken } from "../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Monthly Budget Alert",
    message: "You've spent 85% of your 'Dining Out' budget.",
    time: "2 hours ago",
    type: "warning",
    read: false,
  },
  {
    id: 2,
    title: "Savings Goal Milestone",
    message: "Congratulations! You've reached 50% of your 'New Laptop' goal.",
    time: "5 hours ago",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "Security Update",
    message: "Your password was successfully changed yesterday.",
    time: "1 day ago",
    type: "info",
    read: true,
  }
];

export default function Header({ onToggleSidebar, username = "User" }) {
  const [user, setUser] = useState({ username, avatarUrl: null });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("user_notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (err) {
        setNotifications(MOCK_NOTIFICATIONS);
      }
    }
  }, []);

  useEffect(() => {
    if (notifications !== MOCK_NOTIFICATIONS) {
      localStorage.setItem("user_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await api.get("/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (res.data?.user) {
          setUser({ username: res.data.user.username, avatarUrl: res.data.user.avatarUrl });
        }
      } catch(err) {}
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
      default: return <InformationCircleIcon className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <header className="h-20 md:h-24 px-6 md:px-10 flex items-center justify-between bg-transparent sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar} 
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition md:hidden active:scale-95"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* FIX: TrackFin logo — clicking redirects to /dashboard */}
        <Link href="/dashboard" className="flex items-center gap-3 md:hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <RectangleGroupIcon className="w-5 h-5" />
          </div>
          <span className="text-base font-black italic tracking-tighter text-white uppercase leading-none">
            TRACK<span className="text-indigo-400">FIN</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 w-80 focus-within:border-indigo-500/50 transition-all">
          <MagnifyingGlassIcon className="w-5 h-5 text-white" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-transparent border-none text-sm font-medium text-white outline-none w-full ml-3 placeholder:text-white" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl border transition active:scale-95 ${
              showNotifications ? 'bg-indigo-500/10 border-indigo-500/50 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <BellIcon className="w-5.5 h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 border-2 border-[#020617] rounded-full shadow-lg shadow-indigo-500/5" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed md:absolute right-4 md:right-0 inset-x-4 md:inset-x-auto mt-4 md:w-[380px] bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl z-[60]"
              >
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <h3 className="text-white font-bold tracking-tight">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-500/20">{unreadCount} New</span>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-lg hover:bg-white/5 text-white md:hidden"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className="group flex gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer mb-1 last:mb-0 relative"
                    >
                      {!notif.read && (
                        <div className="absolute top-1/2 -left-0.5 -translate-y-1/2 w-1 h-10 bg-indigo-500 rounded-full shadow-[0_0_10px_indigo]" />
                      )}
                      <div className="shrink-0 mt-0.5">
                        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                          {getIcon(notif.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{notif.title}</p>
                        <p className="text-[13px] text-white leading-relaxed mt-1 line-clamp-2 italic">{notif.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{notif.time}</p>
                          <div className={`w-1.5 h-1.5 rounded-full bg-indigo-500 transition-opacity ${notif.read ? 'opacity-0' : 'opacity-100 group-hover:animate-pulse'}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-10 text-center">
                      <p className="text-white text-sm italic">Nothing but calm...</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white/[0.01] border-t border-white/5">
                  <button 
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="w-full py-3.5 text-[11px] font-black text-white hover:text-white transition uppercase tracking-[2px] bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-white/5 hidden sm:block" />

        {/* FIX: Avatar wrapped in Link — clicking redirects to /profile */}
        <Link href="/profile" className="flex items-center gap-4 group cursor-pointer p-1 rounded-full hover:bg-white/5 transition-all active:scale-[0.98]">
          <div className="text-right hidden sm:block pl-3">
            <p className="text-sm font-bold text-white leading-none mb-1">{user.username}</p>
            <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Verified Manager</p>
          </div>
          {user.avatarUrl ? (
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl border border-white/10 overflow-hidden bg-white/5">
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.avatarUrl}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-[15px] shadow-lg shadow-indigo-600/20">
              {user.username.charAt(0)}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}