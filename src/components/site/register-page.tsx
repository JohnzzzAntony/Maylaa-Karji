"use client";

import { useState } from "react";
import { User, Mail, Lock, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/cart-store";
import { toast } from "sonner";
import { SectionDivider } from "./section-divider";

export function RegisterPage({
  onNavigate,
  onSuccess,
}: {
  onNavigate: (view: "login" | "home") => void;
  onSuccess: () => void;
}) {
  const { fetchUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name) { toast.error("Name required"); return; }
    if (!email || !password) { toast.error("Email and password required"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ name, email, password }) 
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Registration failed"); return; }
      await fetchUser();
      toast.success(`Welcome, ${data.user.name}!`);
      onSuccess();
    } catch { 
      toast.error("Network error"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row-reverse min-h-[calc(100vh-64px)]">
        
        {/* Right Side: Form */}
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/5">
                <Sparkles size={20} className="text-gold" />
              </div>
              <h2 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-foreground">Join The House Of Karji</h2>
              <p className="mt-2 text-sm text-muted-foreground">Create an account to track orders and save your favorite fragrances.</p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="relative">
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="John Doe" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" />
                </div>
              </div>

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
                Create Account <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => onNavigate("login")} className="font-semibold text-gold transition hover:underline">
                Sign in
              </button>
            </div>
          </div>
        </div>

        {/* Left Side: Image/Banner */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img src="/images/products/amber-royale.jpg" alt="Register Background" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/20 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h3 className="font-serif text-4xl font-semibold">Discover Extrait</h3>
            <p className="mt-2 text-lg text-white/80">Bold, enduring, unforgettable concentration.</p>
          </div>
        </div>

      </div>
      <SectionDivider />
    </div>
  );
}
