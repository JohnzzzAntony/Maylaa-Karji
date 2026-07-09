"use client";

import { useState } from "react";
import { useAuth } from "@/lib/cart-store";
import { Mail, Lock, User, Sparkles, Loader2, ArrowLeft, Chrome, Facebook } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function CheckoutAuthGateway({
  onBack,
  onProceedAsGuest,
  onSuccessLogin,
}: {
  onBack: () => void;
  onProceedAsGuest: (email: string) => void;
  onSuccessLogin: () => void;
}) {
  const { fetchUser, setUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [guestEmail, setGuestEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.trim() || !guestEmail.includes("@")) {
      toast.error("Please enter a valid email address to checkout as guest");
      return;
    }
    onProceedAsGuest(guestEmail);
  };

  const submitAuth = async () => {
    if (mode === "register" && !name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "register" ? { name, email, password } : { email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Authentication failed");
        return;
      }
      await fetchUser();
      toast.success(mode === "register" ? `Account created! Welcome, ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
      onSuccessLogin();
    } catch {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mock social login integrations
  const handleSocialLogin = (provider: "Google" | "Facebook") => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Connecting to ${provider} API...`,
        success: () => {
          // Set simulated user session
          setUser({
            id: `social-${provider.toLowerCase()}-${Date.now()}`,
            name: `${provider} User`,
            email: `${provider.toLowerCase()}user@example.com`,
            role: "customer",
          });
          onSuccessLogin();
          return `Signed in successfully with ${provider}!`;
        },
        error: `Could not authenticate with ${provider}.`,
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 transition hover:text-stone-900"
      >
        <ArrowLeft size={14} /> Back to Bag
      </button>

      <div className="grid gap-12 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
        {/* Left Column: Guest Checkout */}
        <div className="pb-8 lg:pb-0 lg:pr-12 flex flex-col justify-center">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-2">Checkout as Guest</h2>
          <p className="text-sm text-stone-500 mb-6">
            You don't need an account to complete your purchase. We will simply use your email to send order updates and receipts.
          </p>
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <label htmlFor="guest-email" className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Email Address</label>
              <input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter email for checkout"
                className="w-full rounded-lg border border-stone-250 bg-background px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-stone-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-stone-700"
            >
              Proceed as Guest
            </button>
          </form>
        </div>

        {/* Right Column: Account Gate */}
        <div className="pt-8 lg:pt-0 lg:pl-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("login")}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition ${mode === "login" ? "bg-stone-100 text-stone-900" : "text-stone-400 hover:text-stone-900"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("register")}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded transition ${mode === "register" ? "bg-stone-100 text-stone-900" : "text-stone-400 hover:text-stone-900"}`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 transition hover:bg-stone-50"
            >
              <Chrome size={14} className="text-red-500" />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-stone-700 transition hover:bg-stone-50"
            >
              <Facebook size={14} className="text-blue-600 fill-blue-600" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-stone-400 font-semibold tracking-widest">Or credentials</span>
            </div>
          </div>

          {/* Credentials Sign In Form */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3.5"
              >
                {mode === "register" && (
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-stone-250 bg-background py-3 pl-11 pr-3 text-sm outline-none transition focus:border-stone-500"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-lg border border-stone-250 bg-background py-3 pl-11 pr-3 text-sm outline-none transition focus:border-stone-500"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAuth()}
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-lg border border-stone-250 bg-background py-3 pl-11 pr-3 text-sm outline-none transition focus:border-stone-500"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={submitAuth}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-4 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              <span>{mode === "login" ? "Sign In & Continue" : "Create Account & Continue"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
