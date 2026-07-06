import { db } from "../src/lib/db";

async function main() {
  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();
  await db.banner.deleteMany();
  await db.bogoOffer.deleteMany();
  await db.advertisement.deleteMany();
  await db.promotion.deleteMany();
  await db.cmsPage.deleteMany();
  await db.configSetting.deleteMany();
  await db.order.deleteMany();
  await db.newsletterSubscriber.deleteMany();

  // Brands — real luxury perfume houses
  const brands = await Promise.all([
    db.brand.create({ data: { name: "Tom Ford", slug: "tom-ford", country: "USA", description: "American luxury known for bold, opulent compositions.", logoColor: "#1a1a1a" } }),
    db.brand.create({ data: { name: "Creed", slug: "creed", country: "France", description: "Centuries-old Parisian house of bespoke royal fragrances.", logoColor: "#b8935a" } }),
    db.brand.create({ data: { name: "Maison Francis Kurkdjian", slug: "maison-francis-kurkdjian", country: "France", description: "Contemporary Parisian haute parfumerie.", logoColor: "#d4af37" } }),
    db.brand.create({ data: { name: "Amouage", slug: "amouage", country: "Oman", description: "Omani luxury house crafting opulent Arabian-inspired scents.", logoColor: "#c4a661" } }),
    db.brand.create({ data: { name: "Parfums de Marly", slug: "parfums-de-marly", country: "France", description: "French house reviving 18th-century royal equestrian heritage.", logoColor: "#8b6f47" } }),
    db.brand.create({ data: { name: "Initio Parfums Privés", slug: "initio", country: "France", description: "Niche house exploring the mystical power of scent.", logoColor: "#3a3a3a" } }),
    db.brand.create({ data: { name: "Roja Parfums", slug: "roja-parfums", country: "United Kingdom", description: "British master perfumer of the finest bespoke creations.", logoColor: "#b8935a" } }),
    db.brand.create({ data: { name: "Rasasi", slug: "rasasi", country: "United Arab Emirates", description: "Emirati house renowned for oud and oriental masterpieces.", logoColor: "#c2410c" } }),
  ]);

  const categories = await Promise.all([
    db.category.create({ data: { name: "Oud & Amber", slug: "oud-amber", description: "Resinous, deep, hypnotic", image: "/images/categories/oud.jpg" } }),
    db.category.create({ data: { name: "Floral", slug: "floral", description: "Blooming, romantic, radiant", image: "/images/categories/floral.jpg" } }),
    db.category.create({ data: { name: "Woody", slug: "woody", description: "Cedar, vetiver, sandalwood", image: "/images/categories/woody.jpg" } }),
    db.category.create({ data: { name: "Oriental Spicy", slug: "oriental-spicy", description: "Saffron, spice, warmth", image: "/images/categories/oriental.jpg" } }),
    db.category.create({ data: { name: "Fresh Citrus", slug: "fresh-citrus", description: "Bergamot, neroli, zest", image: "/images/categories/fresh.jpg" } }),
  ]);

  const [oudCat, floralCat, woodyCat, orientalCat, freshCat] = categories;
  const [tomFord, creed, mfk, amouage, pdm, initio, roja, rasasi] = brands;

  type P = {
    name: string; slug: string; brandIdx: number; catIdx: number;
    desc: string; longDesc: string; price: number; compareAt?: number;
    concentration: string; top: string; heart: string; base: string;
    img: string; rating: number; reviews: number; badge?: string;
    gender: string; trending?: boolean; exclusive?: boolean; bestSeller?: boolean; artisanal?: boolean; featured?: boolean; isNew?: boolean;
  };

  const products: P[] = [
    {
      name: "Tobacco Vanille", slug: "tobacco-vanille", brandIdx: 0, catIdx: 3,
      desc: "Rich tobacco leaf warmed by sweet vanilla and dried fruits.",
      longDesc: "Tom Ford's Tobacco Vanille is an opulent, warming composition that evokes a gentleman's library. Pipe tobacco is enveloped in creamy vanilla, dried fruits, and rich wood notes for a scent of uncompromising luxury.",
      price: 1280, compareAt: 1450, concentration: "Eau de Parfum",
      top: "Tobacco Leaf, Spicy Notes", heart: "Vanilla, Tonka Bean, Dried Fruits", base: "Cedar, Sandalwood, Musk",
      img: "/images/products/tobacco-vanille.jpg", rating: 4.9, reviews: 412, badge: "Bestseller", gender: "Unisex",
      trending: true, bestSeller: true, featured: true,
    },
    {
      name: "Aventus", slug: "aventus", brandIdx: 1, catIdx: 2,
      desc: "A fruity-chypre icon of success — pineapple, birch, and oakmoss.",
      longDesc: "Creed Aventus celebrates strength, vision, and success. A masterful blend of blackcurrant, pineapple, and apple over birch, patchouli, and oakmoss. The defining scent of the modern achiever.",
      price: 1390, concentration: "Eau de Parfum",
      top: "Pineapple, Bergamot, Blackcurrant, Apple", heart: "Birch, Patchouli, Morrocan Jasmine", base: "Oakmoss, Musk, Ambergris",
      img: "/images/products/aventus.jpg", rating: 4.9, reviews: 891, badge: "Bestseller", gender: "Masculine",
      trending: true, bestSeller: true, featured: true,
    },
    {
      name: "Baccarat Rouge 540", slug: "baccarat-rouge-540", brandIdx: 2, catIdx: 3,
      desc: "A radiant aura of saffron, amberwood, and jasmine — luminous and addictive.",
      longDesc: "Maison Francis Kurkdjian's Baccarat Rouge 540 is a poetic alchemy. Saffron and jasmine float over a mineral amberwood and cedar base, creating an ethereal, radiant trail that's instantly recognizable.",
      price: 1450, concentration: "Extrait de Parfum",
      top: "Saffron, Jasmine", heart: "Amberwood, Ambergris", base: "Fir Resin, Cedar",
      img: "/images/products/baccarat-rouge.jpg", rating: 5.0, reviews: 1023, badge: "Bestseller", gender: "Unisex",
      trending: true, bestSeller: true, featured: true, exclusive: true,
    },
    {
      name: "Interlude Man", slug: "interlude-man", brandIdx: 3, catIdx: 0,
      desc: "Chaos and order — oregano, amber, and incense in opulent conflict.",
      longDesc: "Amouage Interlude Man is a fragrance of chaos transformed to order. Pungent oregano and pimento meet rich amber, incense, and opoponax. A bold, uncompromising scent for the connoisseur.",
      price: 1320, concentration: "Eau de Parfum",
      top: "Oregano, Pimento, Bergamot", heart: "Amber, Incense, Opoponax, Labdanum", base: "Leather, Agarwood, Patchouli, Sandalwood",
      img: "/images/products/interlude.jpg", rating: 4.8, reviews: 287, badge: "Exclusive", gender: "Masculine",
      exclusive: true, artisanal: true,
    },
    {
      name: "Layton", slug: "layton", brandIdx: 4, catIdx: 3,
      desc: "Vanilla-orchard warmth with apple and lavender over a woody base.",
      longDesc: "Parfums de Marly Layton is a versatile masterpiece — fresh apple and lavender transition to a heart of jasmine and geranium, settling into a warm vanilla and woods base. Universally loved, endlessly wearable.",
      price: 1180, concentration: "Eau de Parfum",
      top: "Apple, Bergamot, Mandarin", heart: "Lavender, Jasmine, Geranium", base: "Vanilla, Sandalwood, Cedar, Patchouli",
      img: "/images/products/layton.jpg", rating: 4.9, reviews: 654, badge: "Bestseller", gender: "Unisex",
      trending: true, bestSeller: true,
    },
    {
      name: "Oud for Greatness", slug: "oud-for-greatness", brandIdx: 5, catIdx: 0,
      desc: "Saffron and oud with lavender and patchouli — a visionary powerhouse.",
      longDesc: "Initio Oud for Greatness harnesses the mystical power of oud. Saffron and lavender open onto a rich agarwood and patchouli base. A modern legend with extraordinary projection and longevity.",
      price: 1250, concentration: "Eau de Parfum",
      top: "Saffron, Nutmeg, Lavender", heart: "Agarwood (Oud)", base: "Patchouli, Musks",
      img: "/images/products/future-oud.jpg", rating: 4.9, reviews: 538, badge: "Bestseller", gender: "Unisex",
      trending: true, bestSeller: true, featured: true,
    },
    {
      name: "Roja Elysium", slug: "roja-elysium", brandIdx: 6, catIdx: 4,
      desc: "A radiant citrus-woody of bergamot, vetiver, and leather — pure parfum.",
      longDesc: "Roja Parfums Elysium is a paradox of freshness and depth. Luminous citrus and herbal notes over a sophisticated leather, vetiver, and woods base. The pinnacle of perfumery artistry.",
      price: 1490, concentration: "Extrait de Parfum",
      top: "Bergamot, Lemon, Grapefruit, Lime, Thyme", heart: "Violet Leaf, Jasmine, Rose, Lily of the Valley", base: "Leather, Cedar, Sandalwood, Vetiver, Musk",
      img: "/images/products/citrus-royale.jpg", rating: 4.9, reviews: 198, badge: "Premium", gender: "Masculine",
      exclusive: true, featured: true,
    },
    {
      name: "Oudh Al Mumaiz", slug: "oudh-al-mumaiz", brandIdx: 7, catIdx: 0,
      desc: "Royal Emirati oud with rose and amber — heritage in a bottle.",
      longDesc: "Rasasi Oudh Al Mumaiz captures the soul of Arabian perfumery. Cambodian oud is enriched with rose, saffron, and amber, grounded in sandalwood and musk. A regal scent honoring centuries of tradition.",
      price: 720, compareAt: 850, concentration: "Eau de Parfum",
      top: "Saffron, Bergamot", heart: "Oud, Rose, Jasmine", base: "Amber, Sandalwood, Musk",
      img: "/images/products/midnight-oud.jpg", rating: 4.7, reviews: 342, badge: "New", gender: "Unisex",
      isNew: true, trending: true,
    },
    {
      name: "Black Orchid", slug: "black-orchid", brandIdx: 0, catIdx: 1,
      desc: "Dark, sensual truffle and black orchid over patchouli and chocolate.",
      longDesc: "Tom Ford Black Orchid is a luxurious, sensual fragrance. Rare black orchid, truffle, and black plum unfold over a rich base of patchouli, vanilla, and chocolate. Mysterious, opulent, unforgettable.",
      price: 1150, concentration: "Eau de Parfum",
      top: "Truffle, Gardenia, Black Currant, Ylang-Ylang", heart: "Black Orchid, Lotus Wood, Jasmine", base: "Patchouli, Vanilla, Incense, Chocolate",
      img: "/images/products/rose-noir.jpg", rating: 4.8, reviews: 567, badge: "Bestseller", gender: "Feminine",
      bestSeller: true, featured: true,
    },
    {
      name: "Silver Mountain Water", slug: "silver-mountain-water", brandIdx: 1, catIdx: 4,
      desc: "Crisp alpine freshness — blackcurrant, tea, and musk over petrichor.",
      longDesc: "Creed Silver Mountain Water evokes the purity of melted snow on alpine peaks. Blackcurrant, bergamot, and green tea dance over a musky, petrichor base. Effervescent, clean, and timeless.",
      price: 1180, concentration: "Eau de Parfum",
      top: "Bergamot, Orange, Blackcurrant", heart: "Tea, Galbanum, Jasmine", base: "Musk, Sandalwood, Petitgrain",
      img: "/images/products/silver-mountain.jpg", rating: 4.8, reviews: 423, gender: "Unisex",
      trending: true, isNew: true,
    },
    {
      name: "Portrait of a Lady", slug: "portrait-of-a-lady", brandIdx: 2, catIdx: 1,
      desc: "A magnificent Turkish rose over dark patchouli and incense.",
      longDesc: "Frederic Malle's Portrait of a Lady is a rose transformed — dark, powerful, and complex. Turkish rose absolute meets patchouli, incense, and civet. A masterpiece of modern perfumery.",
      price: 1380, concentration: "Eau de Parfum",
      top: "Bergamot, Black Currant", heart: "Turkish Rose, Patchouli, Incense", base: "Civet, Amber, Sandalwood, Musk",
      img: "/images/products/portrait-lady.jpg", rating: 4.9, reviews: 312, badge: "Premium", gender: "Feminine",
      featured: true, exclusive: true,
    },
    {
      name: "Jubilation XXV", slug: "jubilation-xxv", brandIdx: 3, catIdx: 3,
      desc: "Frankincense and amber with bay and rose — regal celebration.",
      longDesc: "Amouage Jubilation XXV is a fragrance of celebration and triumph. Frankincense, orange, and bay open to a rich heart of rose, honey, and orchid, settling into amber, musk, and leather. Truly opulent.",
      price: 1250, concentration: "Eau de Parfum",
      top: "Bergamot, Orange, Tarragon, Bay", heart: "Carnation, Jasmine, Rose, Orchid, Honey", base: "Amber, Civet, Leather, Musk, Sandalwood, Opoponax",
      img: "/images/products/amber-royale.jpg", rating: 4.8, reviews: 189, badge: "Exclusive", gender: "Masculine",
      exclusive: true, artisanal: true,
    },
    {
      name: "Herod", slug: "herod", brandIdx: 4, catIdx: 3,
      desc: "Tobacco and cinnamon warmed by vanilla and woody amber.",
      longDesc: "Parfums de Marly Herod is a warm, spicy oriental. Cinnamon and pepper accent rich tobacco leaf, enveloped in vanilla and woody amber. A majestic scent of strength and sophistication.",
      price: 1190, concentration: "Eau de Parfum",
      top: "Cinnamon, Pepper, Bergamot", heart: "Tobacco Leaf, Incense, Osmanthus", base: "Vanilla, Woody Notes, Amber, Musk, Cedar",
      img: "/images/products/herod.jpg", rating: 4.8, reviews: 267, gender: "Masculine",
      bestSeller: true, isNew: true,
    },
    {
      name: "Side Effect", slug: "side-effect", brandIdx: 5, catIdx: 3,
      desc: "Tobacco, rum, vanilla, and leather — a decadent evening indulgence.",
      longDesc: "Initio Side Effect is a sensory indulgence. Rum-soaked tobacco and warm vanilla meet supple leather and cedar. A decadent, seductive composition for unforgettable evenings.",
      price: 1280, concentration: "Eau de Parfum",
      top: "Rum, Tobacco, Cinnamon", heart: "Vanilla, Leather, Cedar", base: "Sandalwood, Musk, Amber",
      img: "/images/products/leather-oud.jpg", rating: 4.9, reviews: 234, badge: "Exclusive", gender: "Unisex",
      exclusive: true, trending: true,
    },
    {
      name: "Roja Danger", slug: "roja-danger", brandIdx: 6, catIdx: 2,
      desc: "Lemon, tarragon, and leather — a daring, sophisticated chypre.",
      longDesc: "Roja Danger is a fragrance of audacity. Bright lemon and tarragon meet a sophisticated leather, oakmoss, and vetiver base. A bold chypre for those who live on the edge.",
      price: 1420, concentration: "Extrait de Parfum",
      top: "Lemon, Tarragon, Bergamot, Peppermint", heart: "Jasmine, Rose, Violet, Neroli", base: "Leather, Oakmoss, Vetiver, Sandalwood, Musk",
      img: "/images/products/cedar-mystique.jpg", rating: 4.8, reviews: 156, badge: "Premium", gender: "Masculine",
      exclusive: true, artisanal: true,
    },
    {
      name: "Hawas for Him", slug: "hawas-for-him", brandIdx: 7, catIdx: 4,
      desc: "A fresh aquatic with cinnamon, apple, and amber — modern masculinity.",
      longDesc: "Rasasi Hawas for Him is a vibrant aquatic fragrance. Crisp apple and bergamot are spiced with cinnamon, drying down to amber, musk, and driftwood. A modern, energetic signature.",
      price: 680, compareAt: 780, concentration: "Eau de Parfum",
      top: "Bergamot, Lemon, Cinnamon, Apple", heart: "Orange Blossom, Cardamom, Plum", base: "Amber, Driftwood, Musk, Patchouli",
      img: "/images/products/white-musk.jpg", rating: 4.6, reviews: 478, badge: "New", gender: "Masculine",
      isNew: true, bestSeller: true,
    },
    {
      name: "Oud Wood", slug: "oud-wood", brandIdx: 0, catIdx: 2,
      desc: "Rare oud with rosewood, cardamom, and sandalwood — understated luxury.",
      longDesc: "Tom Ford Oud Wood is a refined, understated interpretation of oud. Rosewood, cardamom, and Chinese pepper complement the rare oud, grounded in sandalwood and vetiver. Effortlessly elegant.",
      price: 1220, concentration: "Eau de Parfum",
      top: "Rosewood, Cardamom, Chinese Pepper", heart: "Oud, Sandalwood, Vetiver", base: "Tonka Bean, Vanilla, Amber",
      img: "/images/products/cedar-mystique.jpg", rating: 4.8, reviews: 389, badge: "Bestseller", gender: "Unisex",
      bestSeller: true, trending: true,
    },
    {
      name: "Green Irish Tweed", slug: "green-irish-tweed", brandIdx: 1, catIdx: 4,
      desc: "Fresh-cut grass, violet, and ambergris — timeless elegance.",
      longDesc: "Creed Green Irish Tweed is a legendary fresh fougère. Verbena and iris evoke fresh-cut grass, while violet leaf and ambergris add depth. A timeless classic of refined masculinity.",
      price: 1150, concentration: "Eau de Parfum",
      top: "Lemon, Verbena, Peppermint", heart: "Iris, Violet Leaf", base: "Ambergris, Sandalwood, Mysore Sandalwood",
      img: "/images/products/silver-mountain.jpg", rating: 4.8, reviews: 512, badge: "Bestseller", gender: "Masculine",
      bestSeller: true,
    },
    {
      name: "Oud Satin Mood", slug: "oud-satin-mood", brandIdx: 2, catIdx: 1,
      desc: "Rose, oud, and vanilla in a sensual, velvety embrace.",
      longDesc: "Maison Francis Kurkdjian Oud Satin Mood is a velvety, sensual composition. Bulgarian rose and Turkish rose wrap around Cambodian oud, vanilla, and amber. A luxurious, enveloping scent.",
      price: 1390, concentration: "Extrait de Parfum",
      top: "Bulgarian Rose, Turkish Rose, Saffron", heart: "Cambodian Oud, Geranium", base: "Vanilla, Amber, Musk, Sandalwood",
      img: "/images/products/velvet-saffron.jpg", rating: 4.9, reviews: 245, badge: "Premium", gender: "Feminine",
      featured: true, exclusive: true,
    },
    {
      name: "Reflection Man", slug: "reflection-man", brandIdx: 3, catIdx: 1,
      desc: "White florals and woods — a mirror of refined masculinity.",
      longDesc: "Amouage Reflection Man is a white floral masterpiece for men. Jasmine, neroli, and orange blossom meet rosemary and bay, over a woody, powdery base. Sophisticated and unexpectedly beautiful.",
      price: 1280, concentration: "Eau de Parfum",
      top: "Rosemary, Red Pepper, Neroli, Petitgrain", heart: "Jasmine, Orange Blossom, Orris", base: "Sandalwood, Patchouli, Cedar, Musk",
      img: "/images/products/jasmine-supreme.jpg", rating: 4.7, reviews: 178, badge: "Exclusive", gender: "Masculine",
      exclusive: true, artisanal: true,
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
        size: 100,
        concentration: p.concentration,
        topNotes: p.top,
        heartNotes: p.heart,
        baseNotes: p.base,
        images: JSON.stringify([p.img]),
        rating: p.rating,
        reviewCount: p.reviews,
        stock: 20 + Math.floor(Math.random() * 40),
        sku: `KARJI-${p.slug.toUpperCase().replace(/-/g, "")}`,
        badge: p.badge ?? null,
        gender: p.gender,
        isTrending: p.trending ?? false,
        isExclusive: p.exclusive ?? false,
        isBestSeller: p.bestSeller ?? false,
        isArtisanal: p.artisanal ?? false,
        isFeatured: p.featured ?? false,
        isNew: p.isNew ?? false,
        metaTitle: `${p.name} by ${brands[p.brandIdx].name} | The House Of Karji`,
        metaDescription: p.desc,
        metaKeywords: `${p.name.toLowerCase()}, ${brands[p.brandIdx].name.toLowerCase()}, luxury perfume, fragrance, ${categories[p.catIdx].name.toLowerCase()}`,
        ogImage: p.img,
      },
    });

    const rt = [
      { author: "Layla A.", rating: 5, title: "Absolutely mesmerizing", content: "The longevity is incredible and the sillage turns heads everywhere I go. Worth every dirham.", location: "Dubai, UAE" },
      { author: "Marcus T.", rating: 5, title: "My new signature scent", content: "Complex, refined, and unlike anything in my collection. The dry down is divine.", location: "London, UK" },
      { author: "Sofia R.", rating: 4, title: "Beautiful but pricey", content: "Gorgeous composition with excellent projection. Wish it came in a larger size for the price.", location: "Milan, Italy" },
      { author: "Yuki N.", rating: 5, title: "Pure elegance", content: "Received countless compliments. The packaging alone is a work of art.", location: "Tokyo, Japan" },
    ];
    for (let i = 0; i < 3; i++) {
      const r = rt[i % rt.length];
      await db.review.create({
        data: { productId: created.id, author: r.author, rating: r.rating, title: r.title, content: r.content, verified: true, location: r.location },
      });
    }
  }

  // Banners
  await db.banner.createMany({
    data: [
      { title: "The House Of Karji", subtitle: "Curated Luxury Fragrances", image: "/images/hero/hero-main.jpg", link: "#products", position: "hero", isActive: true, sortOrder: 0 },
      { title: "12% Off Holiday Offer", subtitle: "Use Code KARJI10 at Checkout", image: "/images/products/amber-royale.jpg", link: "#products", position: "hero", isActive: true, sortOrder: 1 },
      { title: "Free Worldwide Shipping", subtitle: "On orders over Dhs. 500", image: "/images/categories/oud.jpg", link: "#", position: "mid", isActive: true, sortOrder: 2 },
    ],
  });

  // Promotions
  await db.promotion.createMany({
    data: [
      { title: "Holiday 12% Off", code: "KARJI10", type: "percent", value: 12, minSpend: 0, usageLimit: 1000, usedCount: 47, isActive: true },
      { title: "Welcome 10% Off", code: "WELCOME10", type: "percent", value: 10, minSpend: 0, usageLimit: 5000, usedCount: 312, isActive: true },
      { title: "Free Shipping", code: "FREESHIP", type: "shipping", value: 0, minSpend: 500, usageLimit: 9999, usedCount: 89, isActive: true },
    ],
  });

  // BOGO
  const bacc = await db.product.findFirst({ where: { slug: "baccarat-rouge-540" } });
  const aventus = await db.product.findFirst({ where: { slug: "aventus" } });
  if (bacc && aventus) {
    await db.bogoOffer.create({ data: { title: "Royal Bundle", description: "Buy Baccarat Rouge 540, get Aventus at 50% off", buyProductId: bacc.id, getProductId: aventus.id, buyQty: 1, getQty: 1, discountPct: 50, isActive: true } });
  }

  // Ads
  await db.advertisement.createMany({
    data: [
      { title: "Discovery Sets Now Available", image: "/images/categories/floral.jpg", link: "#", placement: "sidebar", isActive: true },
      { title: "Gift Cards from Dhs. 100", image: "/images/journal/journal1.jpg", link: "#", placement: "inline", isActive: true },
    ],
  });

  // CMS pages
  await db.cmsPage.createMany({
    data: [
      { title: "About Us", slug: "about-us", content: "The House Of Karji is a curated luxury fragrance atelier, bringing together the world's finest perfume houses under one roof. Founded in Dubai, we source authentic fragrances from Tom Ford, Creed, Amouage, Maison Francis Kurkdjian, and more. Our mission is to make luxury fragrance accessible, with guaranteed authenticity, expert guidance, and worldwide shipping.", isPublished: true, metaTitle: "About The House Of Karji — Luxury Fragrance Atelier", metaDescription: "Discover the story of The House Of Karji, Dubai's premier luxury fragrance destination." },
      { title: "Shipping Policy", slug: "shipping-policy", content: "We offer complimentary worldwide shipping on all orders over Dhs. 500. Standard delivery within the UAE takes 3-5 business days. International orders typically arrive within 5-10 business days. Express shipping options are available at checkout. All shipments are fully insured and include tracking from our Dubai atelier to your door.", isPublished: true, metaTitle: "Shipping Policy — The House Of Karji", metaDescription: "Learn about our worldwide shipping options, delivery times, and free shipping threshold." },
      { title: "Return & Refund Policy", slug: "return-refund-policy", content: "We offer a 30-day, no-questions-asked return policy on all unopened bottles. If you're not completely satisfied, even opened fragrances can be returned within 14 days under our ScentGrade Guarantee. Refunds are processed within 5-7 business days to your original payment method.", isPublished: true, metaTitle: "Return & Refund Policy — The House Of Karji", metaDescription: "30-day returns on unopened bottles. Our satisfaction guarantee covers opened fragrances too." },
      { title: "FAQ", slug: "faq", content: "Frequently Asked Questions:\n\nQ: Are your fragrances authentic?\nA: Yes, 100%. We source directly from the perfume houses and verify each bottle through our multi-point authentication process.\n\nQ: How long does shipping take?\nA: 3-5 business days within the UAE, 5-10 days internationally.\n\nQ: Can I return a fragrance I've opened?\nA: Yes, within 14 days under our satisfaction guarantee.\n\nQ: Do you offer gift wrapping?\nA: Yes, complimentary luxury gift packaging on every order.", isPublished: true, metaTitle: "FAQ — The House Of Karji", metaDescription: "Answers to common questions about authenticity, shipping, returns, and gift wrapping." },
      { title: "Terms of Service", slug: "terms-of-service", content: "These terms govern your use of The House Of Karji website and services. By placing an order, you agree to these terms. All products are subject to availability. Prices are in AED and include VAT where applicable. We reserve the right to refuse or cancel orders at our discretion.", isPublished: true, metaTitle: "Terms of Service — The House Of Karji" },
      { title: "Privacy Policy", slug: "privacy-policy", content: "We respect your privacy and are committed to protecting your personal data. We only collect information necessary to process your orders and improve your shopping experience. We never sell your data to third parties. You may request deletion of your account and data at any time.", isPublished: true, metaTitle: "Privacy Policy — The House Of Karji" },
    ],
  });

  // Config settings
  await db.configSetting.createMany({
    data: [
      { key: "store_name", value: "The House Of Karji", label: "Store Name", group: "general" },
      { key: "store_email", value: "concierge@karjistore.com", label: "Contact Email", group: "general" },
      { key: "store_phone", value: "+971 4 123 4567", label: "Contact Phone", group: "general" },
      { key: "store_address", value: "DIFC Gate Village, Dubai, UAE", label: "Store Address", group: "general" },
      { key: "currency", value: "AED", label: "Default Currency", group: "general" },
      { key: "free_ship_threshold", value: "500", label: "Free Shipping Threshold", group: "shipping" },
      { key: "flat_ship_rate", value: "35", label: "Flat Shipping Rate", group: "shipping" },
      { key: "ship_days_domestic", value: "3-5", label: "Domestic Shipping Days", group: "shipping" },
      { key: "ship_days_intl", value: "5-10", label: "International Shipping Days", group: "shipping" },
      { key: "paypal_enabled", value: "true", label: "PayPal Enabled", group: "payment" },
      { key: "apple_pay_enabled", value: "true", label: "Apple Pay Enabled", group: "payment" },
      { key: "stripe_enabled", value: "true", label: "Stripe / Card Payments", group: "payment" },
      { key: "tax_rate", value: "5", label: "Tax Rate (%)", group: "tax" },
      { key: "tax_included", value: "true", label: "Tax Included in Prices", group: "tax" },
    ],
  });

  // Sample orders
  if (bacc && aventus) {
    const items1 = [{ id: bacc.id, name: bacc.name, price: bacc.price, image: JSON.parse(bacc.images)[0], quantity: 1, size: 100, brand: "Maison Francis Kurkdjian" }];
    const items2 = [{ id: aventus.id, name: aventus.name, price: aventus.price, image: JSON.parse(aventus.images)[0], quantity: 2, size: 100, brand: "Creed" }];
    await db.order.createMany({
      data: [
        { email: "amelia@example.com", customerName: "Amelia Hartwell", items: JSON.stringify(items1), subtotal: 1450, shipping: 0, total: 1450, status: "confirmed", address: JSON.stringify({ city: "London", country: "UK" }) },
        { email: "rashid@example.com", customerName: "Rashid Al-Mansouri", items: JSON.stringify(items2), subtotal: 2780, shipping: 0, total: 2780, status: "shipped", address: JSON.stringify({ city: "Abu Dhabi", country: "UAE" }) },
        { email: "isabella@example.com", customerName: "Isabella Romano", items: JSON.stringify(items1), subtotal: 1450, shipping: 35, total: 1485, status: "pending", address: JSON.stringify({ city: "Milan", country: "Italy" }) },
        { email: "yuki@example.com", customerName: "Yuki Nakamura", items: JSON.stringify(items2), subtotal: 2780, shipping: 0, total: 2780, status: "delivered", address: JSON.stringify({ city: "Tokyo", country: "Japan" }) },
      ],
    });
  }

  console.log("Seed complete: brands", brands.length, "categories", categories.length, "products", products.length);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await db.$disconnect(); });
