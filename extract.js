const fs = require('fs');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('Buy Niche Perfumes Online in UAE at Best Price - A.html', 'utf8');
const $ = cheerio.load(htmlContent);

const products = [];
$('[class*="product"], .card, .item').each((i, el) => {
  const title = $(el).find('h2, h3, .title, .name').text().replace(/\s+/g, ' ').trim();
  const price = $(el).find('.price, [class*="price"]').text().replace(/\s+/g, ' ').trim();
  const img = $(el).find('img').attr('src');
  if (title && img) {
    products.push({ title, price, img: img.substring(0, 50) + "..." });
  }
});

const uniqueProducts = [];
const seenTitles = new Set();
for (const p of products) {
  if (!seenTitles.has(p.title) && p.title.length > 3) {
    seenTitles.add(p.title);
    uniqueProducts.push(p);
  }
}

console.log(`Found ${uniqueProducts.length} unique products.`);
fs.writeFileSync('products_sample.json', JSON.stringify(uniqueProducts.slice(0, 20), null, 2));

const images = [];
$('img').each((i, el) => {
    images.push({
        src: $(el).attr('src').substring(0, 50) + "...",
        alt: $(el).attr('alt')
    });
});
fs.writeFileSync('images_sample.json', JSON.stringify(images.slice(0, 20), null, 2));

console.log('Saved products_sample.json and images_sample.json');
