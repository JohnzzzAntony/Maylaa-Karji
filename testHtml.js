const fs = require('fs');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('Buy Niche Perfumes Online in UAE at Best Price - A.html', 'utf8');
const $ = cheerio.load(htmlContent);

// Let's find images that look like products. 
// A typical e-commerce site will have many repeating structures.
// We can find all elements that have a text matching currency like 'AED'.
const prices = $('*:contains("AED")').filter((i, el) => $(el).children().length === 0);

const sampleProducts = [];

prices.each((i, priceEl) => {
    if (i > 10) return; // just get a few

    // Go up the tree to find a container that has an image and a title.
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
        // Find title. Often an h2, h3 or strong tag within the same container.
        title = container.find('h1, h2, h3, h4, strong, .title, .name').first().text().trim();
        // Fallback: look for the longest text node
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
        
        sampleProducts.push({
            price: $(priceEl).text().trim(),
            title: title.replace(/\n/g, '').replace(/\s+/g, ' ').substring(0, 50),
            imgClass: img.attr('class'),
            imgSrc: img.attr('src') ? img.attr('src').substring(0, 50) + "..." : null,
            containerClass: container.attr('class')
        });
    }
});

console.log(JSON.stringify(sampleProducts, null, 2));

// Let's also check for categories. Look for links wrapping images or headers
const categories = [];
$('a').each((i, el) => {
    const text = $(el).text().trim();
    const img = $(el).find('img').attr('src');
    if (text && img && text.length < 30 && !text.includes('AED')) {
        categories.push({ name: text, img: img.substring(0, 50) + "..." });
    }
});

console.log("Categories sample:", categories.slice(0, 10));

