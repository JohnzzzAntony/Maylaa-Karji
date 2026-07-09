"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/cart-store";
import { toast } from "sonner";
import { SectionDivider } from "./section-divider";

export function LoginPage({
  onNavigate,
  onSuccess,
}: {
  onNavigate: (view: "register" | "home") => void;
  onSuccess: () => void;
}) {
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) { toast.error("Email and password required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ email, password }) 
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Authentication failed"); return; }
      await fetchUser();
      toast.success(`Welcome back, ${data.user.name}!`);
      onSuccess();
    } catch { 
      toast.error("Network error"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        
        {/* Left Side: Form */}
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/5">
                <Sparkles size={20} className="text-gold" />
              </div>
              <h2 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground">Welcome Back</h2>
              <p className="mt-2 text-sm text-muted-foreground">Sign in to access your orders, wishlist, and exclusive offers.</p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="relative">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" />
                </div>
              </div>
              
              <div className="relative">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} type="password" placeholder="••••••••" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" />
                </div>
              </div>
              
              <button onClick={submit} disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-lg bg-espresso py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Sign In <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button onClick={() => onNavigate("register")} className="font-semibold text-gold transition hover:underline">
                Create one
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Image/Banner */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img src="/images/hero/hero-main.jpg" alt="Login Background" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h3 className="font-serif text-4xl font-semibold">The House of Karji</h3>
            <p className="mt-2 text-lg text-white/80">Experience the world's most exquisite artisanal fragrances.</p>
          </div>
        </div>

      </div>
      <SectionDivider />
    </div>
  );
}
