"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/cart-store";
import { Lock, Mail, User, ShieldCheck, ArrowRight, Chrome, Facebook, AlertCircle, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setUser } = useAuth();
  
  const isCheckout = searchParams.get("checkout") === "1";
  
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Social Login Popup Simulation
  const [socialPopup, setSocialPopup] = useState<"google" | "facebook" | null>(null);
  const [popupStep, setPopupStep] = useState(0);

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (user) {
      if (isCheckout) {
        router.push("/?guest=1"); // return to checkout as logged-in user
      } else {
        router.push("/");
      }
    }
  }, [user, isCheckout, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        toast.success("Welcome back, " + data.user.name + "!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("Network error during login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        toast.success("Account created successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("Network error during registration");
    } finally {
      setLoading(false);
    }
  };

  const triggerSocialLogin = (provider: "google" | "facebook") => {
    setSocialPopup(provider);
    setPopupStep(1); // open authentication modal
  };

  const completeSocialLogin = async () => {
    setPopupStep(2); // processing spinner
    await new Promise((r) => setTimeout(r, 1500));
    const mockUser = {
      id: "social_" + Math.random().toString(36).substr(2, 9),
      name: socialPopup === "google" ? "Google User" : "Facebook User",
      email: socialPopup === "google" ? "google.user@gmail.com" : "fb.user@outlook.com",
      role: "customer",
    };
    setUser(mockUser);
    setSocialPopup(null);
    setPopupStep(0);
    toast.success("Successfully signed in with " + (socialPopup === "google" ? "Google" : "Facebook"));
  };

  const handleGuestCheckout = () => {
    router.push("/?guest=1"); // tells the CartDrawer to open in shipping guest mode
  };

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-105 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-espresso/30 blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-stone-900/60 border border-stone-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden relative z-10">
        
        {/* Banner header */}
        <div className="px-8 pt-8 pb-4 flex flex-col items-center justify-center">
          <Link href="/" className="hover:opacity-90 transition block">
            <img src="/images/logo.png" alt="The House Of Karji" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-stone-850 px-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 transition ${
              activeTab === "login"
                ? "border-gold text-gold"
                : "border-transparent text-stone-400 hover:text-stone-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 transition ${
              activeTab === "register"
                ? "border-gold text-gold"
                : "border-transparent text-stone-400 hover:text-stone-300"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Forms content wrapper */}
        <div className="p-8 space-y-6">
          
          {/* Guest Checkout Panel */}
          {isCheckout && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex flex-col items-center text-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                <ShoppingBag size={14} /> Guest Checkout Available
              </div>
              <p className="text-xs text-stone-300">
                You can proceed and place your order as a guest without creating an account.
              </p>
              <button
                onClick={handleGuestCheckout}
                className="w-full py-2.5 rounded-lg bg-gold/10 hover:bg-gold/15 text-gold text-xs font-bold uppercase tracking-wider border border-gold/30 transition flex items-center justify-center gap-1.5"
              >
                Continue as Guest <ArrowRight size={13} />
              </button>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg bg-stone-950/80 border border-stone-800 text-sm py-3 pl-10 pr-4 text-white outline-none focus:border-gold transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-stone-300">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Password reset simulator triggered"); }} className="text-[11px] text-gold hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-stone-950/80 border border-stone-800 text-sm py-3 pl-10 pr-10 text-white outline-none focus:border-gold transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gold hover:bg-gold-light text-stone-950 font-bold uppercase tracking-wider text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950/30 border-t-stone-950" /> : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-lg bg-stone-950/80 border border-stone-800 text-sm py-3 pl-10 pr-4 text-white outline-none focus:border-gold transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg bg-stone-950/80 border border-stone-800 text-sm py-3 pl-10 pr-4 text-white outline-none focus:border-gold transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-stone-950/80 border border-stone-800 text-sm py-3 pl-10 pr-10 text-white outline-none focus:border-gold transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gold hover:bg-gold-light text-stone-950 font-bold uppercase tracking-wider text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950/30 border-t-stone-950" /> : "Create Account"}
              </button>
            </form>
          )}

          {/* Social Logins */}
          <div className="space-y-4 pt-4 border-t border-stone-850">
            <div className="relative flex items-center justify-center">
              <span className="absolute bg-stone-900 px-3 text-[10px] uppercase font-bold tracking-widest text-stone-500">Or continue with</span>
              <div className="w-full border-t border-stone-850" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerSocialLogin("google")}
                className="flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-stone-100 text-stone-950 py-3 text-xs font-semibold transition shadow-sm border border-stone-200"
              >
                <Chrome size={15} className="text-red-500 fill-current" /> Google
              </button>
              <button
                onClick={() => triggerSocialLogin("facebook")}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 text-xs font-semibold transition shadow-sm"
              >
                <Facebook size={15} className="fill-current" /> Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Login Popups Simulation */}
      {socialPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 relative">
            <div className="bg-stone-50 p-4 border-b border-stone-150 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                Sign in with {socialPopup === "google" ? "Google" : "Facebook"}
              </span>
              <button onClick={() => setSocialPopup(null)} className="text-stone-400 hover:text-stone-600 font-semibold text-xs">
                Cancel
              </button>
            </div>
            
            <div className="p-6 text-center space-y-4">
              {popupStep === 1 && (
                <>
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold mb-2">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-sm font-semibold text-stone-850">Katarina App Authorization</h4>
                  <p className="text-xs text-stone-500">
                    Allow Katarina Fragrances to access your public profile name and email address ({socialPopup === "google" ? "google.user@gmail.com" : "fb.user@outlook.com"})?
                  </p>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => setSocialPopup(null)}
                      className="flex-1 py-2 rounded-lg border border-stone-300 text-xs font-medium hover:bg-stone-50 text-stone-750 transition"
                    >
                      Deny
                    </button>
                    <button
                      onClick={completeSocialLogin}
                      className="flex-1 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
                    >
                      Authorize
                    </button>
                  </div>
                </>
              )}

              {popupStep === 2 && (
                <div className="py-8 flex flex-col items-center gap-3">
                  <span className="h-8 w-8 animate-spin rounded-full border-3 border-stone-200 border-t-gold" />
                  <p className="text-xs text-stone-500 font-medium">Establishing secure connection...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-gold">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-800 border-t-gold" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
