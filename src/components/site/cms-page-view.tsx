"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, FileText } from "lucide-react";

type CmsPage = { id: string; title: string; slug: string; content: string; metaDescription?: string | null; updatedAt: string };

export function CmsPageView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/cms?slug=${encodeURIComponent(slug)}`).then((r) => (r.ok ? r.json() : null)).then((d) => { setPage(d?.page ?? null); }).catch(() => setPage(null)).finally(() => setLoading(false));
  }, [slug]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
      </motion.article>
    </div>
  );
}
