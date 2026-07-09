import { db } from "../src/lib/db";

async function main() {
  // Clean
  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();
  await db.order.deleteMany();
  await db.newsletterSubscriber.deleteMany();

  // Brands
  const brands = await Promise.all([
    db.brand.create({ data: { name: "Emirates Pride", slug: "emirates-pride", country: "United Arab Emirates", description: "Modern Arabian opulence rooted in heritage oud craftsmanship.", logoColor: "#B8935A" } }),
    db.brand.create({ data: { name: "Maison Lumière", slug: "maison-lumiere", country: "France", description: "Parisian haute parfumerie crafting luminous, sculptural scents.", logoColor: "#C4A661" } }),
    db.brand.create({ data: { name: "Casa Veneziana", slug: "casa-veneziana", country: "Italy", description: "Venetian artistry reimagined for the modern connoisseur.", logoColor: "#8B6F47" } }),
    db.brand.create({ data: { name: "Atelier Noir", slug: "atelier-noir", country: "United Kingdom", description: "Bold, smoky, unconventional fragrances from a London atelier.", logoColor: "#3A3A3A" } }),
    db.brand.create({ data: { name: "Saffron & Co.", slug: "saffron-and-co", country: "Morocco", description: "Spice-route storytelling through rare saffron and amber.", logoColor: "#C2410C" } }),
    db.brand.create({ data: { name: "Kyoto Hana", slug: "kyoto-hana", country: "Japan", description: "Minimalist Japanese perfumery celebrating quiet florals.", logoColor: "#6B8E6B" } }),
  ]);

  // Categories
  const categories = await Promise.all([
    db.category.create({ data: { name: "Oud & Amber", slug: "oud-amber", description: "Resinous, deep, hypnotic", image: "/images/categories/oud.jpg" } }),
    db.category.create({ data: { name: "Floral", slug: "floral", description: "Blooming, romantic, radiant", image: "/images/categories/floral.jpg" } }),
    db.category.create({ data: { name: "Woody", slug: "woody", description: "Cedar, vetiver, sandalwood", image: "/images/categories/woody.jpg" } }),
    db.category.create({ data: { name: "Oriental Spicy", slug: "oriental-spicy", description: "Saffron, spice, warmth", image: "/images/categories/oriental.jpg" } }),
    db.category.create({ data: { name: "Fresh Citrus", slug: "fresh-citrus", description: "Bergamot, neroli, zest", image: "/images/categories/fresh.jpg" } }),
  ]);

  const [oudCat, floralCat, woodyCat, orientalCat, freshCat] = categories;

  type SeedProduct = {
    name: string; slug: string; brandIdx: number; catIdx: number;
    desc: string; longDesc: string; price: number; compareAt?: number;
    size: number; concentration: string; top: string; heart: string; base: string;
    images: string[]; rating: number; reviewCount: number; badge?: string;
    gender: string; trending?: boolean; exclusive?: boolean; bestSeller?: boolean; artisanal?: boolean; featured?: boolean; isNew?: boolean;
  };

  const products: SeedProduct[] = [
    {
      name: "Future Oud", slug: "future-oud", brandIdx: 0, catIdx: 0,
      desc: "A visionary oud wrapped in futuristic amber and digital saffron.",
      longDesc: "Future Oud is a daring reinterpretation of Arabian heritage. A molecular oud accord meets radiant saffron and warm amber, creating a scent that feels simultaneously ancient and otherworldly. Designed for the discerning collector who prizes innovation.",
      price: 1231, compareAt: 1400, size: 100, concentration: "Extrait de Parfum",
      top: "Saffron, Pink Pepper, Bergamot", heart: "Oud, Rose, Geranium", base: "Amber, Sandalwood, Musk",
      images: ["/images/products/future-oud.jpg"], rating: 4.9, reviewCount: 248, badge: "Bestseller", gender: "Unisex",
      trending: true, bestSeller: true, featured: true,
    },
    {
      name: "Rose Noir", slug: "rose-noir", brandIdx: 3, catIdx: 1,
      desc: "A midnight rose veiled in smoke and black leather.",
      longDesc: "Rose Noir unveils the dark side of the rose. Bulgarian rose absolute is wrapped in smoky leather, birch tar, and a whisper of patchouli. Unapologetically bold, endlessly seductive.",
      price: 980, size: 100, concentration: "Eau de Parfum",
      top: "Black Pepper, Bergamot", heart: "Bulgarian Rose, Iris", base: "Leather, Birch, Patchouli",
      images: ["/images/products/rose-noir.jpg"], rating: 4.8, reviewCount: 187, badge: "Exclusive", gender: "Unisex",
      trending: true, exclusive: true, bestSeller: true,
    },
    {
      name: "Velvet Saffron", slug: "velvet-saffron", brandIdx: 4, catIdx: 3,
      desc: "Liquid velvet woven from saffron threads and amber resin.",
      longDesc: "Velvet Saffron is a tactile fragrance — soft, warm, and impossibly luxurious. Moroccan saffron absolute is enveloped in amber, tonka bean, and a touch of rose, creating a sensual oriental signature.",
      price: 1145, compareAt: 1300, size: 100, concentration: "Extrait de Parfum",
      top: "Saffron, Cardamom", heart: "Rose, Amber", base: "Tonka, Vanilla, Sandalwood",
      images: ["/images/products/velvet-saffron.jpg"], rating: 4.9, reviewCount: 203, badge: "New", gender: "Unisex",
      trending: true, artisanal: true, isNew: true,
    },
    {
      name: "Amber Royale", slug: "amber-royale", brandIdx: 1, catIdx: 0,
      desc: "A baroque amber lit from within by golden resins.",
      longDesc: "Amber Royale is a grand, gilded composition. Labdanum and ambergris form the heart, illuminated by benzoin, vanilla, and a sparkle of bergamot. A fragrance for moments of ceremony.",
      price: 1320, size: 100, concentration: "Extrait de Parfum",
      top: "Bergamot, Tangerine", heart: "Amber, Labdanum, Benzoin", base: "Vanilla, Musk, Oakmoss",
      images: ["/images/products/amber-royale.jpg"], rating: 4.7, reviewCount: 156, badge: "Premium", gender: "Unisex",
      featured: true, bestSeller: true,
    },
    {
      name: "Midnight Oud", slug: "midnight-oud", brandIdx: 0, catIdx: 0,
      desc: "An oud that glows like moonlight on still water.",
      longDesc: "Midnight Oud is the quiet cousin of Future Oud — cooler, deeper, more contemplative. Cambodian oud is veiled in blue chamomile, iris, and silver musk for an aura of nocturnal elegance.",
      price: 1090, size: 100, concentration: "Extrait de Parfum",
      top: "Blue Chamomile, Bergamot", heart: "Oud, Iris", base: "Silver Musk, Sandalwood",
      images: ["/images/products/midnight-oud.jpg"], rating: 4.8, reviewCount: 142, gender: "Unisex",
      trending: true, exclusive: true,
    },
    {
      name: "White Musk", slug: "white-musk", brandIdx: 5, catIdx: 1,
      desc: "A whisper-soft musk as clean as fresh linen at dawn.",
      longDesc: "White Musk is the art of restraint. A skin scent built on white musk, cotton flower, and a trace of jasmine — weightless, intimate, and endlessly comforting.",
      price: 720, size: 100, concentration: "Eau de Parfum",
      top: "Bergamot, Aldehydes", heart: "Jasmine, Cotton Flower", base: "White Musk, Cedar",
      images: ["/images/products/white-musk.jpg"], rating: 4.6, reviewCount: 311, gender: "Unisex",
      bestSeller: true, isNew: true,
    },
    {
      name: "Citrus Royale", slug: "citrus-royale", brandIdx: 1, catIdx: 4,
      desc: "A sparkling crown of Calabrian bergamot and neroli.",
      longDesc: "Citrus Royale is effervescent and aristocratic. Calabrian bergamot, Sicilian lemon, and neroli dance over a base of vetiver and white tea — a fragrance for sunlit mornings.",
      price: 845, size: 100, concentration: "Eau de Parfum",
      top: "Bergamot, Lemon, Neroli", heart: "Orange Blossom, Green Tea", base: "Vetiver, White Musk",
      images: ["/images/products/citrus-royale.jpg"], rating: 4.7, reviewCount: 98, badge: "New", gender: "Unisex",
      isNew: true, trending: true,
    },
    {
      name: "Patchouli Noir", slug: "patchouli-noir", brandIdx: 3, catIdx: 2,
      desc: "Dark earthy patchouli refined with cocoa and dark woods.",
      longDesc: "Patchouli Noir transforms the hippie note into haute couture. Aged patchouli is enriched with cocoa absolute, dark woods, and a touch of incense. Grounded, mysterious, magnetic.",
      price: 910, size: 100, concentration: "Eau de Parfum",
      top: "Pink Pepper, Bergamot", heart: "Patchouli, Cocoa", base: "Incense, Sandalwood, Vetiver",
      images: ["/images/products/patchouli-noir.jpg"], rating: 4.8, reviewCount: 134, gender: "Unisex",
      artisanal: true, bestSeller: true,
    },
    {
      name: "Jasmine Supreme", slug: "jasmine-supreme", brandIdx: 5, catIdx: 1,
      desc: "Jasmine sambac picked at the break of dawn.",
      longDesc: "Jasmine Supreme is a love letter to the flower. Jasmine sambac from Grasse is layered with tuberose and a soft musk base — opulent yet translucent, like moonlight on petals.",
      price: 1050, size: 100, concentration: "Extrait de Parfum",
      top: "Green Notes, Bergamot", heart: "Jasmine Sambac, Tuberose", base: "Musk, Sandalwood",
      images: ["/images/products/jasmine-supreme.jpg"], rating: 4.9, reviewCount: 167, badge: "Premium", gender: "Feminine",
      featured: true, exclusive: true,
    },
    {
      name: "Leather Oud", slug: "leather-oud", brandIdx: 3, catIdx: 2,
      desc: "Smoked leather and oud over a saddle of dark woods.",
      longDesc: "Leather Oud is unapologetically masculine. Russian leather, birch tar, and oud form a smoky triad, softened with tobacco and rum. A fragrance for the leather-jacketed romantic.",
      price: 1185, size: 100, concentration: "Extrait de Parfum",
      top: "Bergamot, Rum", heart: "Leather, Oud, Tobacco", base: "Birch, Amber, Musk",
      images: ["/images/products/leather-oud.jpg"], rating: 4.8, reviewCount: 121, gender: "Masculine",
      trending: true, artisanal: true,
    },
    {
      name: "Vanilla Orchid", slug: "vanilla-orchid", brandIdx: 2, catIdx: 1,
      desc: "Madagascar vanilla embracing a single white orchid.",
      longDesc: "Vanilla Orchid is gourmand elegance. Madagascar vanilla absolute wraps around orchid, tonka, and a whisper of sandalwood. Edible yet refined, never cloying.",
      price: 890, compareAt: 1020, size: 100, concentration: "Eau de Parfum",
      top: "Pear, Bergamot", heart: "Orchid, Jasmine", base: "Vanilla, Tonka, Sandalwood",
      images: ["/images/products/vanilla-orchid.jpg"], rating: 4.7, reviewCount: 189, badge: "New", gender: "Feminine",
      isNew: true, bestSeller: true,
    },
    {
      name: "Cedar Mystique", slug: "cedar-mystique", brandIdx: 5, catIdx: 2,
      desc: "Ancient cedar whispered through incense and smoke.",
      longDesc: "Cedar Mystique is meditative. Atlas cedar, incense, and vetiver form an aromatic pyramid grounded in warm ambrette. A fragrance for the quiet seeker.",
      price: 760, size: 100, concentration: "Eau de Parfum",
      top: "Pink Pepper, Elemi", heart: "Atlas Cedar, Incense", base: "Vetiver, Ambrette, Musk",
      images: ["/images/products/cedar-mystique.jpg"], rating: 4.6, reviewCount: 87, gender: "Unisex",
      artisanal: true,
    },
  ];

  for (const p of products) {
    const created = await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        brandId: brands[p.brandIdx].id,
        categoryId: categories[p.catIdx].id,
        description: p.desc,
        longDescription: p.longDesc,
        price: p.price,
        compareAtPrice: p.compareAt ?? null,
        size: p.size,
        concentration: p.concentration,
        topNotes: p.top,
        heartNotes: p.heart,
        baseNotes: p.base,
        images: JSON.stringify(p.images),
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: 50,
        sku: `SG-${p.slug.toUpperCase().replace(/-/g, "")}`,
        badge: p.badge ?? null,
        gender: p.gender,
        isTrending: p.trending ?? false,
        isExclusive: p.exclusive ?? false,
        isBestSeller: p.bestSeller ?? false,
        isArtisanal: p.artisanal ?? false,
        isFeatured: p.featured ?? false,
        isNew: p.isNew ?? false,
      },
    });

    const reviewTemplates = [
      { author: "Layla A.", rating: 5, title: "Absolutely mesmerizing", content: "The longevity is incredible and the sillage turns heads everywhere I go. Worth every dirham.", location: "Dubai, UAE" },
      { author: "Marcus T.", rating: 5, title: "My new signature scent", content: "Complex, refined, and unlike anything in my collection. The dry down is divine.", location: "London, UK" },
      { author: "Sofia R.", rating: 4, title: "Beautiful but pricey", content: "Gorgeous composition with excellent projection. Wish it came in a larger size for the price.", location: "Milan, Italy" },
      { author: "Yuki N.", rating: 5, title: "Pure elegance", content: "Received countless compliments. The packaging alone is a work of art.", location: "Tokyo, Japan" },
    ];
    const numReviews = 2 + (p.slug.length % 2);
    for (let i = 0; i < numReviews; i++) {
      const r = reviewTemplates[i % reviewTemplates.length];
      await db.review.create({
        data: { productId: created.id, author: r.author, rating: r.rating, title: r.title, content: r.content, verified: true, location: r.location },
      });
    }
  }

  console.log("Seed complete: brands", brands.length, "categories", categories.length, "products", products.length);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await db.$disconnect(); });
