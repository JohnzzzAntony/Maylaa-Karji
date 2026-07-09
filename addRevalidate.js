const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'src', 'app', 'api', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add import if not exists
  if (/(POST|PUT|DELETE)/.test(content) && !content.includes('revalidatePath')) {
    content = 'import { revalidatePath } from "next/cache";\n' + content;
    changed = true;
  }

  // Replace return NextResponse.json(...) if it DOES NOT contain error
  // e.g. return NextResponse.json({ product })
  // e.g. return NextResponse.json({ success: true })
  // Avoid replacing return NextResponse.json({ error: "id required" })
  
  // Regex looks for 'return NextResponse.json({ ... })' where the inside doesn't have 'error:'
  const regex = /return\s+NextResponse\.json\(\s*\{\s*(?!error\s*:)[^}]+\}\s*\)\s*;/g;

  let newContent = content.replace(regex, (match) => {
    return 'revalidatePath("/");\n  ' + match;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('route.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir(apiDir);
console.log('Done.');
