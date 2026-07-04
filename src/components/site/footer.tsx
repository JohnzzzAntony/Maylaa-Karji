"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, Send, ShieldCheck, Leaf, BadgeCheck, Truck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const PAYMENTS = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Amex", "Venmo", "Amazon Pay"];

const TRUST = [
  { icon: BadgeCheck, title: "Authenticity Guaranteed", desc: "100% genuine, sourced directly from houses" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "256-bit SSL encrypted checkout" },
  { icon: Leaf, title: "Sustainable Packaging", desc: "Recyclable, plastic-free materials" },
  { icon: Truck, title: "Worldwide Shipping", desc: "Fast, insured global delivery" },
];

const LINKS = [
  { title: "Shop", links: ["New Arrivals", "Bestsellers", "Exclusive", "Artisanal", "Gift Cards", "Discovery Sets"] },
  { title: "Discover", links: ["The Scent Journal", "Fragrance Guide", "Note Dictionary", "Brand Stories", "Reviews"] },
  { title: "Customer Care", links: ["Contact Us", "Shipping & Returns", "Track Order", "FAQ", "Size Guide", "Authenticity"] },
  { title: "About", links: ["Our Story", "Sustainability", "Careers", "Press", "Wholesale", "Affiliates"] },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      toast.success("Welcome to ScentGrade! Check your inbox for 10% off.");
      setEmail("");
    } catch {
      toast.error("Subscription failed. Try again.");
    }
  };

  return (
    <footer className="mt-auto bg-espresso text-white">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 px-2 py-6 sm:px-4"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10">
                <t.icon size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-xs text-white/50">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
          <div className="max-w-md">
            <h3 className="font-serif text-3xl text-gold">Join The Inner Circle</h3>
            <p className="mt-2 text-sm text-white/60">Subscribe for early access to new arrivals, exclusive offers, and 10% off your first order.</p>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-gold"
              />
            </div>
            <button onClick={subscribe} className="flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-wider text-espresso transition hover:bg-gold-soft">
              <Send size={14} /> Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-gold">
                <span className="font-serif text-lg font-bold text-gold">SG</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-semibold">ScentGrade</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Curated Fragrance</span>
              </div>
            </a>
            <p className="mt-4 text-sm text-white/50">
              Curated luxury fragrances from the world&apos;s finest perfume houses. Where heritage meets modern artistry.
            </p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-gold hover:bg-gold hover:text-espresso" aria-label="Social">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="group inline-flex items-center gap-1 text-sm text-white/60 transition hover:text-white">
                      <ChevronRight size={11} className="text-gold opacity-0 transition group-hover:opacity-100" />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, label: "Mon–Sat: 9AM – 9PM GST" },
            { icon: Mail, label: "concierge@scentgrade.com" },
            { icon: Phone, label: "+971 4 123 4567" },
            { icon: MapPin, label: "DIFC Gate Village, Dubai, UAE" },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/50">
              <c.icon size={14} className="text-gold" /> {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* Payments + Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} ScentGrade. All rights reserved. Crafted with passion in Dubai.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/70">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
