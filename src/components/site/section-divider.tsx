"use client";

import { motion } from "framer-motion";

export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="h-px w-16 origin-right bg-gradient-to-l from-gold to-transparent sm:w-24"
      />
      {label ? (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-serif text-xs uppercase tracking-[0.3em] text-gold"
        >
          {label}
        </motion.span>
      ) : (
        <motion.div
          initial={{ rotate: 0, scale: 0 }}
          whileInView={{ rotate: 45, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring" }}
          className="h-2 w-2 rotate-45 bg-gold"
        />
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="h-px w-16 origin-left bg-gradient-to-r from-gold to-transparent sm:w-24"
      />
    </div>
  );
}
