"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useUI } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "bot"; text: string; ts: number };

const QUICK_PROMPTS = [
  "What's your best oud fragrance?",
  "Do you offer gift wrapping?",
  "How long does shipping take?",
  "What's your return policy?",
];

// Local knowledge base for instant responses
const KB: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ["oud", "best oud", "oud fragrance"],
    answer: "Our finest oud fragrances are Future Oud (Dhs. 1,231) — a visionary molecular oud with saffron and amber, and Midnight Oud (Dhs. 1,090) — cooler and more contemplative with blue chamomile. Both are Extrait de Parfum concentration for exceptional longevity. Would you like a quick view of either?",
  },
  {
    keywords: ["gift", "wrapping", "gift wrap", "present"],
    answer: "Yes! Every order arrives in our signature luxury gift packaging — a velvet-lined box with gold foil detailing, complimentary handwritten note, and a fragrance sample. Gift wrapping is always free. You can also purchase digital gift cards in any denomination.",
  },
  {
    keywords: ["shipping", "delivery", "how long", "when"],
    answer: "We offer complimentary worldwide shipping on orders over Dhs. 500. Standard delivery: 3–5 business days (UAE), 5–10 days (international). Express delivery available at checkout. All shipments are fully insured with tracking.",
  },
  {
    keywords: ["return", "refund", "exchange", "policy"],
    answer: "We offer a 30-day, no-questions-asked return policy on unopened bottles. Even opened fragrances can be returned within 14 days if you're not completely satisfied — that's our ScentGrade Guarantee. Refunds process within 5–7 business days.",
  },
  {
    keywords: ["saffron", "velvet saffron"],
    answer: "Velvet Saffron (Dhs. 1,145) is a tactile, sensual oriental — Moroccan saffron absolute enveloped in amber, tonka bean, and rose. It's part of our Artisanal collection and a current bestseller. Extrait de Parfum concentration, 100ml.",
  },
  {
    keywords: ["price", "expensive", "cost", "afford"],
    answer: "Our fragrances range from Dhs. 720 (White Musk) to Dhs. 1,320 (Amber Royale). We offer 30ml, 50ml, and 100ml sizes, and discovery sets are coming soon. All prices include our luxury packaging and a complimentary sample. Use code JULY4 for 12% off your first order!",
  },
  {
    keywords: ["authentic", "real", "genuine", "fake"],
    answer: "Every bottle is 100% authentic, sourced directly from the perfume houses and verified through our multi-point authentication process. Each order includes a certificate of authenticity. We guarantee it — or your money back.",
  },
  {
    keywords: ["concentration", "extrait", "edp", "parfum"],
    answer: "Extrait de Parfum (our highest concentration, 20–30%+ perfume oils) offers 12+ hours longevity and bold sillage. Eau de Parfum (15–20%) gives 6–8 hours of balanced projection. Our Extrait collection includes Future Oud, Amber Royale, and Jasmine Supreme.",
  },
  {
    keywords: ["recommend", "suggest", "help me choose", "quiz"],
    answer: "I'd love to help you find your signature scent! Try our Scent Concierge Quiz (the wand icon on the right) for a personalized recommendation in under a minute. Or tell me: what mood are you going for — mysterious, fresh, romantic, or warm?",
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    answer: "Hello, and welcome to ScentGrade! I'm your personal fragrance concierge. I can help you discover scents, answer questions about shipping or returns, or guide you to the perfect gift. What can I help you with today?",
  },
];

const DEFAULT_ANSWER = "Great question! I'd recommend trying our Scent Concierge Quiz for a personalized match, or browse our Bestsellers section — Future Oud and Rose Noir are perennial favorites. For anything specific, our team is also reachable at concierge@scentgrade.com. Is there a particular note family you're drawn to?";

function findAnswer(query: string): string {
  const q = query.toLowerCase();
  let best: { score: number; answer: string } = { score: 0, answer: DEFAULT_ANSWER };
  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > best.score) best = { score, answer: entry.answer };
  }
  return best.answer;
}

export function LiveChat() {
  const { chatOpen, setChatOpen } = useUI();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Welcome to ScentGrade! I'm Aria, your personal fragrance concierge. How may I assist you today?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: Msg = { role: "user", text: content, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const answer = findAnswer(content);
      setMessages((m) => [...m, { role: "bot", text: answer, ts: Date.now() }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-espresso text-white shadow-luxury-lg transition hover:bg-gold"
        aria-label="Open live chat"
      >
        <AnimatePresence mode="wait">
          {chatOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!chatOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold" />
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-luxury-lg"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-espresso px-4 py-3.5 text-white">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/20">
                  <Sparkles size={18} className="text-gold" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-espresso bg-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-serif text-base font-medium leading-tight">Aria · Scent Concierge</p>
                <p className="text-[11px] text-white/60">Online · Replies instantly</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-luxury bg-cream/30 p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                      m.role === "user"
                        ? "rounded-br-sm bg-espresso text-white"
                        : "rounded-bl-sm bg-white text-foreground shadow-sm"
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-gold"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border bg-card px-3 py-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-full border border-border bg-cream/50 px-2.5 py-1 text-[11px] text-foreground transition hover:border-gold hover:text-gold"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-border bg-card p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about fragrances, shipping..."
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-gold"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-espresso text-white transition hover:bg-gold disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
