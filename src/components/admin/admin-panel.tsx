"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, Gift, Megaphone, Package, BarChart3,
  Users, Tag, FileText, Settings, Store, LogOut, Search, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminDashboard } from "./views/admin-dashboard";
import { AdminBanners } from "./views/admin-banners";
import { AdminBogo } from "./views/admin-bogo";
import { AdminAdvertisements } from "./views/admin-advertisements";
import { AdminCatalog } from "./views/admin-catalog";
import { AdminSales } from "./views/admin-sales";
import { AdminCustomers } from "./views/admin-customers";
import { AdminPromotions } from "./views/admin-promotions";
import { AdminCms } from "./views/admin-cms";
import { AdminConfig } from "./views/admin-config";

export type AdminModule = "dashboard" | "banners" | "bogo" | "ads" | "catalog" | "sales" | "customers" | "promotions" | "cms" | "config";

const NAV: { id: AdminModule; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "banners", label: "Banner", icon: Image },
  { id: "bogo", label: "BOGO Offer", icon: Gift },
  { id: "ads", label: "Advertisement", icon: Megaphone },
  { id: "catalog", label: "Catalog", icon: Package },
  { id: "sales", label: "Sales", icon: BarChart3 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "promotions", label: "Promotions", icon: Tag },
  { id: "cms", label: "CMS", icon: FileText },
  { id: "config", label: "Configuration", icon: Settings },
];

export function AdminPanel({ onExit }: { onExit?: () => void }) {
  const [active, setActive] = useState<AdminModule>("dashboard");

  const switchModule = useCallback((m: AdminModule) => {
    setActive(m);
    window.scrollTo({ top: 0 });
  }, []);

  const exit = () => {
    if (onExit) onExit();
    else window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1410] text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center gap-1 overflow-x-auto border-b border-white/10 bg-gradient-to-r from-[#5c4435] to-[#3d2e24] px-3 shadow-lg no-scrollbar">
        <div className="flex shrink-0 items-center gap-2 pr-4">
          <div className="grid h-8 w-8 place-items-center rounded-full border border-amber-400/50 bg-amber-400/10">
            <Store size={16} className="text-amber-400" />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-sm font-semibold text-amber-100">ScentGrade</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-amber-400/70">Admin</span>
          </div>
        </div>

        <nav className="flex items-center gap-0.5">
          {NAV.map((item) => {
            const isActiveNav = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchModule(item.id)}
                className={cn(
                  "group relative flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition",
                  isActiveNav ? "bg-white/15 text-white" : "text-amber-100/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon size={15} className={cn(isActiveNav && "text-amber-400")} />
                <span className="hidden md:inline">{item.label}</span>
                {isActiveNav && (
                  <motion.span
                    layoutId="admin-nav-active"
                    className="absolute -bottom-px left-2 right-2 h-0.5 rounded-full bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 pl-3">
          <button className="grid h-8 w-8 place-items-center rounded-md text-amber-100/70 transition hover:bg-white/10 hover:text-white" aria-label="Search">
            <Search size={15} />
          </button>
          <button className="relative grid h-8 w-8 place-items-center rounded-md text-amber-100/70 transition hover:bg-white/10 hover:text-white" aria-label="Notifications">
            <Bell size={15} />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
          </button>
          <button
            onClick={exit}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-amber-100/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={14} />
            <span className="hidden lg:inline">Exit Admin</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden bg-[#f7f3ee]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {active === "dashboard" && <AdminDashboard onNavigate={switchModule} />}
            {active === "banners" && <AdminBanners />}
            {active === "bogo" && <AdminBogo />}
            {active === "ads" && <AdminAdvertisements />}
            {active === "catalog" && <AdminCatalog />}
            {active === "sales" && <AdminSales />}
            {active === "customers" && <AdminCustomers />}
            {active === "promotions" && <AdminPromotions />}
            {active === "cms" && <AdminCms />}
            {active === "config" && <AdminConfig />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="flex items-center justify-between border-t border-white/10 bg-[#1a1410] px-4 py-2 text-[10px] text-amber-100/40">
        <span>© {new Date().getFullYear()} ScentGrade Admin · v1.0</span>
        <span>Logged in as Administrator</span>
      </footer>
    </div>
  );
}
