"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Sparkles, Loader2 } from "lucide-react";
import { useUI, useAuth } from "@/lib/cart-store";
import { toast } from "sonner";

export function AuthDialog() {
  const { authOpen, setAuthOpen } = useUI();
  const { fetchUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!authOpen) { setName(""); setEmail(""); setPassword(""); setMode("login"); } }, [authOpen]);

  const submit = async () => {
    if (mode === "register" && !name) { toast.error("Name required"); return; }
    if (!email || !password) { toast.error("Email and password required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mode === "register" ? { name, email, password } : { email, password }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Authentication failed"); return; }
      await fetchUser();
      toast.success(mode === "register" ? `Welcome, ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
      setAuthOpen(false);
    } catch { toast.error("Network error"); } finally { setLoading(false); }
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="max-w-md overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">{mode === "login" ? "Sign in" : "Create account"}</DialogTitle>
        <div className="relative bg-espresso px-6 py-8 text-center text-white">
          <button onClick={() => setAuthOpen(false)} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white" aria-label="Close"><X size={16} /></button>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10"><Sparkles size={20} className="text-gold" /></div>
          <h2 className="mt-3 font-serif text-2xl font-semibold">{mode === "login" ? "Welcome Back" : "Join The House Of Karji"}</h2>
          <p className="mt-1 text-xs text-white/60">{mode === "login" ? "Sign in to access your wishlist and orders" : "Create an account for 10% off your first order"}</p>
        </div>
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-3">
              {mode === "register" && (<div className="relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" /></div>)}
              <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" /></div>
              <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} type="password" placeholder="Password" className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3 text-sm outline-none transition focus:border-gold" /></div>
              <button onClick={submit} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-espresso py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gold disabled:opacity-60">{loading ? <Loader2 size={16} className="animate-spin" /> : null}{mode === "login" ? "Sign In" : "Create Account"}</button>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 text-center text-xs text-muted-foreground">{mode === "login" ? <>Don&apos;t have an account? <button onClick={() => setMode("register")} className="font-semibold text-gold hover:underline">Sign up</button></> : <>Already have an account? <button onClick={() => setMode("login")} className="font-semibold text-gold hover:underline">Sign in</button></>}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
