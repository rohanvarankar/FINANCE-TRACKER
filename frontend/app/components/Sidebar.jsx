"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  TagIcon,
  ChartPieIcon,
  FlagIcon,
  ChartBarIcon,
  ArrowPathIcon,
  UserCircleIcon,
  RectangleGroupIcon,
  UserGroupIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function Sidebar({ open, onClose, onLogout }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", Icon: HomeIcon },
    { name: "Categories", href: "/categories", Icon: TagIcon },
    { name: "Budgets", href: "/budgets", Icon: ChartPieIcon },
    { name: "Goals", href: "/goals", Icon: FlagIcon },
    { name: "Reports", href: "/reports", Icon: ChartBarIcon },
    { name: "Recurring", href: "/recurring", Icon: ArrowPathIcon },
    { name: "Households", href: "/households", Icon: UserGroupIcon },
  ];

  const secondaryItems = [
    { name: "Profile Settings", href: "/profile", Icon: UserCircleIcon },
  ];

  return (
    <>
      {/* MOBILE BACKDROP */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#020617]/80 backdrop-blur-3xl z-[70]
          border-r border-white/5 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
                <RectangleGroupIcon className="w-6 h-6" />
              </div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                TRACK<span className="text-indigo-400">FIN</span>
              </span>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden p-2 rounded-xl text-white hover:text-white hover:bg-white/5 transition-all"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 px-6 space-y-10 overflow-y-auto pt-4 selection:bg-indigo-500/30">
            
            <div className="space-y-2">
              <p className="px-4 text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">Workspace Control</p>
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => { if(window.innerWidth < 768) onClose(); }}
                    className={`
                      group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
                      ${active 
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-[1.02] border border-indigo-400/20" 
                        : "hover:bg-white/5 text-white hover:text-white"
                      }
                    `}
                  >
                    <item.Icon className={`w-5.5 h-5.5 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-white"}`} />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                    {active && (
                       <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="space-y-2">
              <p className="px-4 text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">System Registry</p>
              {secondaryItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => { if(window.innerWidth < 768) onClose(); }}
                    className={`
                      group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300
                      ${active 
                        ? "bg-white/10 text-white shadow-xl border border-white/10" 
                        : "hover:bg-white/5 text-white hover:text-white"
                      }
                    `}
                  >
                    <item.Icon className={`w-5.5 h-5.5 transition-transform group-hover:scale-110 ${active ? "text-white" : "text-white"}`} />
                    <span className="text-sm font-bold tracking-tight">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-8 mt-auto">
            <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10 mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                     <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none mb-1">Session Secured</p>
                    <p className="text-[10px] font-medium text-white italic">Financial Link Active</p>
                  </div>
               </div>
            </div>

            <button
              onClick={() => { onLogout(); onClose(); }}
              className="
                w-full flex items-center gap-3 px-6 py-4 rounded-2xl 
                text-[13px] font-bold text-white hover:text-white hover:bg-rose-500/80
                border border-white/5 hover:border-rose-400/40 
                transition-all duration-300 shadow-sm active:scale-95 group
              "
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}
