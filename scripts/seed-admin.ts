import { db } from "../src/lib/db";

async function main() {
  // Default config settings
  const existing = await db.configSetting.count();
  if (existing === 0) {
    await db.configSetting.createMany({
      data: [
        { key: "store_name", value: "ScentGrade", label: "Store Name", group: "general" },
        { key: "store_email", value: "concierge@scentgrade.com", label: "Contact Email", group: "general" },
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
    console.log("Config settings seeded");
  }

  // Sample banner
  if ((await db.banner.count()) === 0) {
    await db.banner.createMany({
      data: [
        { title: "Holiday Weekend Offer", subtitle: "12% Off The Art of Arabian Oud", image: "/images/hero/hero-main.jpg", link: "#products", position: "hero", isActive: true, sortOrder: 0 },
        { title: "Extrait de Parfum", subtitle: "Pure Concentration. Bold Endurance.", image: "/images/products/amber-royale.jpg", link: "#products", position: "hero", isActive: true, sortOrder: 1 },
        { title: "Free Worldwide Shipping", subtitle: "On orders over Dhs. 500", image: "/images/categories/oud.jpg", link: "#", position: "mid", isActive: true, sortOrder: 2 },
      ],
    });
    console.log("Banners seeded");
  }

  // Sample promotion
  if ((await db.promotion.count()) === 0) {
    await db.promotion.createMany({
      data: [
        { title: "July 4th Holiday", code: "JULY4", type: "percent", value: 12, minSpend: 0, usageLimit: 1000, usedCount: 47, isActive: true },
        { title: "Welcome 10% Off", code: "WELCOME10", type: "percent", value: 10, minSpend: 0, usageLimit: 5000, usedCount: 312, isActive: true },
        { title: "Free Shipping", code: "FREESHIP", type: "shipping", value: 0, minSpend: 500, usageLimit: 9999, usedCount: 89, isActive: true },
      ],
    });
    console.log("Promotions seeded");
  }

  // Sample BOGO
  if ((await db.bogoOffer.count()) === 0) {
    const p1 = await db.product.findFirst({ where: { slug: "future-oud" } });
    const p2 = await db.product.findFirst({ where: { slug: "midnight-oud" } });
    if (p1 && p2) {
      await db.bogoOffer.create({ data: { title: "Oud Lovers BOGO", description: "Buy Future Oud, get Midnight Oud at 50% off", buyProductId: p1.id, getProductId: p2.id, buyQty: 1, getQty: 1, discountPct: 50, isActive: true } });
    }
    console.log("BOGO offers seeded");
  }

  // Sample advertisement
  if ((await db.advertisement.count()) === 0) {
    await db.advertisement.createMany({
      data: [
        { title: "Discovery Sets Now Available", image: "/images/categories/floral.jpg", link: "#", placement: "sidebar", isActive: true },
        { title: "Gift Card from Dhs. 100", image: "/images/journal/journal1.jpg", link: "#", placement: "inline", isActive: true },
      ],
    });
    console.log("Advertisements seeded");
  }

  // Sample CMS pages
  if ((await db.cmsPage.count()) === 0) {
    await db.cmsPage.createMany({
      data: [
        { title: "About Us", slug: "about-us", content: "ScentGrade is a curated luxury fragrance atelier...", isPublished: true },
        { title: "Shipping Policy", slug: "shipping-policy", content: "We offer complimentary worldwide shipping on orders over Dhs. 500...", isPublished: true },
        { title: "Return & Refund Policy", slug: "return-refund-policy", content: "30-day no-questions-asked returns on unopened bottles...", isPublished: true },
        { title: "FAQ", slug: "faq", content: "Frequently asked questions about our fragrances and services...", isPublished: true },
        { title: "Terms of Service", slug: "terms-of-service", content: "Terms governing use of ScentGrade...", isPublished: true },
        { title: "Privacy Policy", slug: "privacy-policy", content: "How we handle your data...", isPublished: true },
      ],
    });
    console.log("CMS pages seeded");
  }

  // Create a few sample orders so the admin has data
  if ((await db.order.count()) === 0) {
    const fo = await db.product.findFirst({ where: { slug: "future-oud" } });
    const rn = await db.product.findFirst({ where: { slug: "rose-noir" } });
    if (fo && rn) {
      const items1 = [{ id: fo.id, name: fo.name, price: fo.price, image: JSON.parse(fo.images)[0], quantity: 1, size: 100, brand: "Emirates Pride" }];
      const items2 = [{ id: rn.id, name: rn.name, price: rn.price, image: JSON.parse(rn.images)[0], quantity: 2, size: 100, brand: "Atelier Noir" }];
      await db.order.createMany({
        data: [
          { email: "amelia@example.com", customerName: "Amelia Hartwell", items: JSON.stringify(items1), subtotal: 1231, shipping: 0, total: 1231, status: "confirmed", address: JSON.stringify({ city: "London", country: "UK" }) },
          { email: "rashid@example.com", customerName: "Rashid Al-Mansouri", items: JSON.stringify(items2), subtotal: 1960, shipping: 0, total: 1960, status: "shipped", address: JSON.stringify({ city: "Abu Dhabi", country: "UAE" }) },
          { email: "isabella@example.com", customerName: "Isabella Romano", items: JSON.stringify(items1), subtotal: 1231, shipping: 35, total: 1266, status: "pending", address: JSON.stringify({ city: "Milan", country: "Italy" }) },
          { email: "yuki@example.com", customerName: "Yuki Nakamura", items: JSON.stringify(items2), subtotal: 1960, shipping: 0, total: 1960, status: "delivered", address: JSON.stringify({ city: "Tokyo", country: "Japan" }) },
        ],
      });
      console.log("Sample orders seeded");
    }
  }

  console.log("Admin seed complete");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await db.$disconnect(); });
