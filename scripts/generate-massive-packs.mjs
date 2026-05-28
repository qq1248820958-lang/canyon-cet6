// Generate massive remote question packs from CET6_edited.txt
// Reads the word list from D:\english-wordlists\CET6_edited.txt
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKS_DIR = join(__dirname, '..', 'question-packs');

// Source word list
const SOURCE_FILE = 'D:\\english-wordlists\\CET6_edited.txt';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseWordList(filePath) {
  const text = readFileSync(filePath, 'utf-8');
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const entries = [];

  for (const line of lines) {
    // Format: word [phonetic] part_of_speech. definition
    // Extract the word (first part before space or [)
    const wordMatch = line.match(/^([a-zA-Z-]+)/);
    if (!wordMatch) continue;

    const word = wordMatch[1].toLowerCase();

    // Extract Chinese definitions - remove word, phonetic, and English text
    // Keep Chinese characters and punctuation
    let defText = line
      .replace(/^[a-zA-Z-]+\s*/, '')          // remove word
      .replace(/\[[^\]]*\]\s*/, '')             // remove phonetic
      .replace(/\|\|.*$/, '')                   // remove example usage after ||
      .trim();

    // Extract Chinese definitions (keep text after the last English part)
    // Remove numbered definitions like "1. " "2. " and keep Chinese text
    const chineseParts = [];
    const defs = defText.split(/\d+\.\s*/).filter(Boolean);

    for (const d of defs) {
      // Remove part of speech markers
      let clean = d.replace(/^(v\.|n\.|adj\.|adv\.|prep\.|conj\.|pron\.|art\.|num\.|int\.|vi\.|vt\.|aux\.)\s*/i, '');
      // Remove any remaining English at the start
      clean = clean.replace(/^[a-zA-Z\s,;]+/, '').trim();
      // Keep only Chinese characters and common punctuation
      const chinese = clean.replace(/[^一-鿿，。、；：]/g, ' ').trim();
      if (chinese.length > 0) {
        chineseParts.push(chinese);
      }
    }

    if (chineseParts.length > 0) {
      // Join definitions and clean up
      let def = chineseParts.join('，');
      def = def.replace(/\s+/g, ' ').trim();
      // Limit definition length
      if (def.length > 0 && def.length < 60) {
        entries.push([word, def]);
      } else if (def.length > 0) {
        // Take first 50 chars if too long
        entries.push([word, def.substring(0, 50) + '…']);
      }
    }
  }

  return entries;
}

// Generate question packs
function generatePacks(entries, packSize = 500) {
  const shuffled = shuffle(entries);
  const packs = [];
  const totalWords = shuffled.length;

  for (let start = 0; start < totalWords; start += packSize) {
    const chunk = shuffled.slice(start, start + packSize);
    const packIndex = packs.length + 1;
    const questions = [];
    const sourceEvents = ['对线补兵', '敌方消耗', '1v1单杀'];

    for (let i = 0; i < chunk.length; i++) {
      const [word, def] = chunk[i];
      const others = entries.filter(w => w[0] !== word).map(w => w[0]);
      const wrongWords = shuffle(others).slice(0, 3);
      const allOptions = shuffle([word, ...wrongWords]);
      const correctIndex = allOptions.indexOf(word);

      questions.push({
        id: `remote_${String(packIndex).padStart(2, '0')}_${String(i + 1).padStart(4, '0')}`,
        type: 'vocabulary',
        prompt: `选择与「${def}」对应的英文单词：`,
        options: allOptions,
        answer: correctIndex,
        explanation: `${word} 意为「${def}」。`,
        sourceEvent: sourceEvents[i % 3],
        difficulty: i % 10 === 0 ? 3 : i % 5 === 0 ? 2 : 1,
      });
    }

    packs.push({
      packId: `vocab-${String(packIndex).padStart(3, '0')}`,
      version: 1,
      title: `六级词汇扩展包 #${packIndex}`,
      description: `${chunk.length} 道六级核心词汇题`,
      questions,
    });
  }

  return packs;
}

// Build manifest
function buildManifest(packs) {
  return {
    version: 1,
    packs: packs.map(p => ({
      id: p.packId,
      version: p.version,
      title: p.title,
      description: p.description,
      questionCount: p.questions.length,
    })),
  };
}

// Main
console.log('Parsing CET6 word list...');
const entries = parseWordList(SOURCE_FILE);
console.log(`Parsed ${entries.length} words with Chinese definitions`);

// Remove words that are too short (1-2 chars)
const filtered = entries.filter(([word]) => word.length >= 3);
console.log(`After filtering short words: ${filtered.length}`);

console.log('Generating question packs...');
const packs = generatePacks(filtered, 500);
console.log(`Generated ${packs.length} packs with ${packs.reduce((s, p) => s + p.questions.length, 0)} total questions`);

// Write packs
mkdirSync(PACKS_DIR, { recursive: true });
for (const pack of packs) {
  const filePath = join(PACKS_DIR, `${pack.packId}.json`);
  writeFileSync(filePath, JSON.stringify(pack, null, 2), 'utf-8');
  console.log(`  ${pack.packId}.json → ${pack.questions.length} questions`);
}

// Write manifest
const manifest = buildManifest(packs);
const manifestPath = join(PACKS_DIR, 'manifest.json');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`  manifest.json → ${manifest.packs.length} packs`);

// Remove old vocab-001.json if present
// (it will be replaced by vocab-001.json from the new set if applicable)
console.log('\nDone!');
