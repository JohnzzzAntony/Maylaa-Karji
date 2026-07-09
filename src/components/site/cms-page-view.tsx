"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, FileText, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type CmsPage = { id: string; title: string; slug: string; content: string; metaDescription?: string | null; updatedAt: string };

function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    scentPreference: "Oud / Woody",
    scentMood: "Mysterious",
    location: "Dubai - DIFC Gate Village",
    callbackMethod: "email",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success("Enquiry submitted successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit enquiry.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-50/50 p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-amber-700 h-12 w-12 animate-pulse" />
        <h3 className="mt-4 font-serif text-2xl font-semibold text-stone-900">Thank You</h3>
        <p className="mt-2 text-sm text-stone-600">Your fragrance enquiry has been submitted. A concierge will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-stone-250 pt-12">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-light text-stone-900">Concierge Enquiry Form</h2>
        <p className="text-xs text-stone-500 mt-2">Request a fragrance recommendation or book a private boutique session.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              placeholder="+971 50 123 4567"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Boutique Location *</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-600"
            >
              <option value="Dubai - DIFC Gate Village">Dubai - DIFC Gate Village</option>
              <option value="Abu Dhabi - Galleria Mall">Abu Dhabi - Galleria Mall</option>
              <option value="Riyadh - Centria Mall">Riyadh - Centria Mall</option>
              <option value="Online Boutique Support">Online Boutique Support</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Scent Preference *</label>
            <select
              value={formData.scentPreference}
              onChange={(e) => setFormData(p => ({ ...p, scentPreference: e.target.value }))}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-600"
            >
              <option value="Oud / Woody">Oud / Woody (Rich, Deep, Earthy)</option>
              <option value="Floral / Sweet">Floral / Sweet (Rose, Jasmine, Sweet)</option>
              <option value="Fresh / Citrus">Fresh / Citrus (Light, Clean, Aquatic)</option>
              <option value="Oriental / Spicy">Oriental / Spicy (Warm, Exotic, Amber)</option>
              <option value="Unsure">Unsure (I need a custom recommendation)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Scent Mood *</label>
            <select
              value={formData.scentMood}
              onChange={(e) => setFormData(p => ({ ...p, scentMood: e.target.value }))}
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-600"
            >
              <option value="Mysterious">Mysterious & Alluring</option>
              <option value="Fresh">Fresh & Energizing</option>
              <option value="Romantic">Romantic & Elegant</option>
              <option value="Warm">Warm & Cozy</option>
              <option value="Bold">Bold & Statement</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Preferred Response Method</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
              <input
                type="radio"
                value="email"
                checked={formData.callbackMethod === "email"}
                onChange={(e) => setFormData(p => ({ ...p, callbackMethod: e.target.value }))}
                className="text-amber-600 focus:ring-amber-600"
              />
              Email
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
              <input
                type="radio"
                value="phone"
                checked={formData.callbackMethod === "phone"}
                onChange={(e) => setFormData(p => ({ ...p, callbackMethod: e.target.value }))}
                className="text-amber-600 focus:ring-amber-600"
              />
              Phone Call / WhatsApp
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Inquiry / Message *</label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
            placeholder="Tell us what you are looking for..."
            className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-amber-700 disabled:opacity-50"
        >
          <Send size={14} />
          {submitting ? "Sending Enquiry..." : "Send Concierge Enquiry"}
        </button>
      </form>
    </div>
  );
}

export function CmsPageView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/cms?slug=${encodeURIComponent(slug)}`).then((r) => (r.ok ? r.json() : null)).then((d) => { setPage(d?.page ?? null); }).catch(() => setPage(null)).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (<div className="mx-auto max-w-3xl px-4 py-24 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-gold" /></div>);
  if (!page) return (<div className="mx-auto max-w-3xl px-4 py-24 text-center"><FileText size={40} className="mx-auto text-muted-foreground/40" /><h1 className="mt-4 font-serif text-2xl">Page not found</h1><button onClick={onBack} className="mt-4 text-sm font-semibold uppercase tracking-wider text-gold hover:underline">Back to Home</button></div>);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-gold"><ArrowLeft size={14} /> Back to Home</button>
        <nav className="flex items-center gap-2 text-[11px] text-muted-foreground"><button onClick={onBack} className="hover:text-gold">Home</button><ChevronRight size={11} /><span className="text-foreground">{page.title}</span></nav>
      </div>
      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-semibold sm:text-5xl">{page.title}</h1>
        {page.metaDescription && <p className="mt-3 text-sm text-muted-foreground">{page.metaDescription}</p>}
        <div className="mt-4 flex items-center gap-3 border-y border-border py-3 text-xs text-muted-foreground"><span>The House Of Karji</span><span>·</span><span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span></div>
        <div className="prose prose-stone mt-8 max-w-none text-sm leading-relaxed text-foreground/80">{page.content.split("\n").map((para, i) => (para.trim() ? <p key={i} className="mb-4">{para}</p> : <br key={i} />))}</div>
        {slug === "faq" && <EnquiryForm />}
      </motion.article>
    </div>
  );
}
