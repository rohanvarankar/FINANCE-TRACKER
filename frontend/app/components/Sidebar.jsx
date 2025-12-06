"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CurrencyDollarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ open, onClose, onLogout }) {
  const pathname = usePathname();

  const items = [
    { name: "Manage Expense", href: "/dashboard", Icon: CurrencyDollarIcon },
    { name: "Profile", href: "/profile", Icon: UserIcon },
  ];

  return (
    <>
      {/* BACKDROP OVERLAY (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden 
          transition-opacity duration-300 
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* SIDEBAR PANEL */}
      <aside
        className={`
          fixed top-0 left-0 
          h-screen w-64 bg-white shadow-xl border-r border-slate-200 
          z-40 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER WITH CLOSE BUTTON (mobile only) */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h2 className="font-semibold text-slate-800">Menu</h2>
          <button onClick={onClose} className="p-2 rounded hover:bg-slate-100">
            <XMarkIcon className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-5 overflow-y-auto h-full">

          {/* MENU BUTTONS */}
          {items.map(({ name, href, Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={name}
                href={href}
                onClick={onClose}   // 🔥 AUTO CLOSE SIDEBAR ON MOBILE
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all 
                  ${active
                    ? "bg-teal-600 text-white shadow-md"
                    : "hover:bg-teal-50 text-slate-700"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${active ? "text-white" : "text-teal-600"}`}
                />
                <span className="text-sm font-medium">{name}</span>
              </Link>
            );
          })}

          {/* LOGOUT BUTTON */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="
                w-full flex items-center justify-center gap-2 p-2
                rounded-lg text-sm font-medium bg-rose-50 text-rose-700 
                hover:bg-rose-100 transition
              "
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* TIP BOX */}
          <div className="mt-6 text-xs text-slate-500 pb-10">
            <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-medium">
              Tip
            </span>
            <p className="mt-2">
              Track expenses regularly to improve financial discipline.
            </p>
          </div>

        </nav>
      </aside>
    </>
  );
}
