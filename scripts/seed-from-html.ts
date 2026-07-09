import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Reading HTML file...');
  const htmlContent = fs.readFileSync('Buy Niche Perfumes Online in UAE at Best Price - A.html', 'utf8');
  console.log('Parsing HTML...');
  const $ = cheerio.load(htmlContent);

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Create a default category if it doesn't exist
  console.log('Ensuring default category exists...');
  const categoryName = 'Niche Perfumes';
  let category = await prisma.category.findFirst({
    where: { name: categoryName }
  });
  
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: generateSlug(categoryName),
        description: "Imported Niche Perfumes Catalog",
        image: "",
        showOnHomepage: true,
      }
    });
  }

  // Create a default brand
  const brandName = 'Niche Brands';
  let brand = await prisma.brand.findFirst({ where: { name: brandName } });
  if (!brand) {
    brand = await prisma.brand.create({
        data: {
            name: brandName,
            slug: generateSlug(brandName),
            description: "Niche Brands",
            country: "UAE"
        }
    })
  }

  // Find all elements containing 'AED' to identify products
  const prices = $('*:contains("AED")').filter((i, el) => $(el).children().length === 0);
  
  const extractedProducts = new Map();

  prices.each((i, priceEl) => {
    let container = $(priceEl).parent();
    let img = null;
    let title = null;
    
    // traverse up to 5 levels
    for (let level = 0; level < 5; level++) {
        img = container.find('img').first();
        if (img.length > 0) {
            break;
        }
        container = container.parent();
    }

    if (img && img.length > 0) {
        title = container.find('h1, h2, h3, h4, strong, .title, .name').first().text().trim();
        if (!title) {
            let longest = "";
            container.find('*').each((j, child) => {
                const t = $(child).text().trim();
                if (t.length > longest.length && !t.includes("AED")) {
                    longest = t;
                }
            });
            title = longest;
        }

        const priceStr = $(priceEl).text().trim();
        const cleanTitle = title.replace(/\n/g, '').replace(/\s+/g, ' ').substring(0, 100);
        const imgSrc = img.attr('src');
        
        if (cleanTitle && imgSrc && cleanTitle.length > 3 && !extractedProducts.has(cleanTitle)) {
           // Parse price to number
           const priceMatch = priceStr.match(/[\d,.]+/);
           const price = (priceMatch && !isNaN(parseFloat(priceMatch[0].replace(/,/g, '')))) ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;
           
           extractedProducts.set(cleanTitle, {
              title: cleanTitle,
              price: price,
              imgSrc: imgSrc
           });
        }
    }
  });

  console.log(`Extracted ${extractedProducts.size} unique products.`);
  
  let inserted = 0;
  for (const [title, p] of extractedProducts.entries()) {
    let imagePath = '';
    
    // Handle Base64 Image
    if (p.imgSrc && p.imgSrc.startsWith('data:image')) {
      try {
          const matches = p.imgSrc.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const fileName = `${generateSlug(title)}-${Date.now()}.${ext}`;
            const fullPath = path.join(uploadsDir, fileName);
            
            fs.writeFileSync(fullPath, buffer);
            imagePath = `/uploads/products/${fileName}`;
          }
      } catch (err) {
          console.log(`Failed to process image for ${title}`);
      }
    } else if (p.imgSrc) {
       imagePath = p.imgSrc;
    }

    // Insert to DB
    const slug = generateSlug(title);
    
    try {
        const existing = await prisma.product.findUnique({ where: { slug } });
        if (!existing) {
            await prisma.product.create({
                data: {
                    name: title,
                    slug: slug,
                    description: `Experience the luxury of ${title}.`,
                    longDescription: "",
                    topNotes: "",
                    heartNotes: "",
                    baseNotes: "",
                    price: p.price,
                    images: imagePath ? JSON.stringify([imagePath]) : "[]",
                    categoryId: category.id,
                    brandId: brand.id,
                    isFeatured: true,
                    stock: 100,
                    sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                }
            });
            inserted++;
        }
    } catch (e) {
        console.error(`Error inserting ${title}:`, e.message);
    }
  }

  console.log(`Successfully seeded ${inserted} new products!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
