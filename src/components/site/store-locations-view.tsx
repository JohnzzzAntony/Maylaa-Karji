"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, ExternalLink } from "lucide-react";

type StoreLocation = {
  id: string; name: string; image: string | null; address: string; city: string;
  phone: string | null; mapsUrl: string | null;
};

export function StoreLocationsView({ locations }: { locations: StoreLocation[] }) {
  const [selectedCity, setSelectedCity] = useState<string>("All");

  const cities = useMemo(() => {
    const unique = Array.from(new Set(locations.map((l) => l.city))).sort();
    return ["All", ...unique];
  }, [locations]);

  const filtered = useMemo(
    () => selectedCity === "All" ? locations : locations.filter((l) => l.city === selectedCity),
    [locations, selectedCity]
  );

  if (locations.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-[#faf8f5]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Visit Us</p>
          <h2 className="font-serif text-4xl font-light text-stone-900">Our Boutiques</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* City filter pills */}
        {cities.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  selectedCity === city
                    ? "bg-stone-900 text-white"
                    : "border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {/* Location cards */}
        <AnimatePresence mode="popLayout">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((loc, i) => (
              <motion.div
                key={loc.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
              >
                {/* Store image */}
                {loc.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">{loc.city}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100">
                    <MapPin size={40} className="text-amber-300" />
                  </div>
                )}

                {/* Card content */}
                <div className="p-5">
                  <h3 className="font-serif text-xl font-medium text-stone-900 group-hover:text-amber-700 transition">{loc.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-stone-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-amber-500" />
                      <span>{loc.address}</span>
                    </div>
                    {loc.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="shrink-0 text-amber-500" />
                        <a href={`tel:${loc.phone}`} className="hover:text-amber-700 hover:underline">{loc.phone}</a>
                      </div>
                    )}
                  </div>
                  {loc.mapsUrl && (
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 transition hover:text-amber-700"
                    >
                      <ExternalLink size={12} /> Get Directions
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-stone-400 py-12">No stores found in {selectedCity}.</p>
        )}
      </div>
    </section>
  );
}
