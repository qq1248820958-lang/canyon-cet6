import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(dir, '..', 'dist', 'index.html');

let html = readFileSync(htmlPath, 'utf-8');

// Remove type="module" and crossorigin
html = html.replace(/ type="module"/g, '');
html = html.replace(/ crossorigin/g, '');

// Move script to end of body with defer so #app exists when it executes
const scriptMatch = html.match(/<script src="(\.\/assets\/index-[^"]+\.js)"><\/script>/);
if (scriptMatch) {
  const scriptTag = scriptMatch[0];
  const scriptSrc = scriptMatch[1];
  // Remove from head
  html = html.replace(scriptTag, '');
  // Add to end of body with defer
  html = html.replace(
    '</body>',
    `  <script defer src="${scriptSrc}"></script>\n</body>`
  );
}

writeFileSync(htmlPath, html);
console.log('Fixed index.html: moved script to body with defer');
