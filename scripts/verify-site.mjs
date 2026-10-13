// Source checks for the Goal 1 site update. Usage: node scripts/verify-site.mjs <check>
// Checks: banned, offer, brand, dashes, tokens, facts. Each prints "<check> check passed" on success
// and exits 1 with the offending lines otherwise. Pure Node, so it runs the same on Windows.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SOURCE_DIRS = ['app', 'components', 'lib'];
const SOURCE_EXT = /\.(ts|tsx)$/;
const EXEMPT = new Set(['app/globals.css', 'lib/tokens.ts']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const posix = (p) => relative(ROOT, p).split(sep).join('/');
const sourceFiles = SOURCE_DIRS.flatMap((d) => walk(join(ROOT, d))).filter((f) => SOURCE_EXT.test(f));

function scan(files, patterns) {
  const hits = [];
  for (const file of files) {
    const rel = posix(file);
    if (EXEMPT.has(rel)) continue;
    readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
      for (const { re, why } of patterns) if (re.test(line)) hits.push(`${rel}:${i + 1} [${why}] ${line.trim().slice(0, 140)}`);
    });
  }
  return hits;
}

const CHECKS = {
  // Words the site rules forbid, plus the contradictions this update removes.
  banned: () =>
    scan(sourceFiles, [
      { re: /revolutioni[sz]e|unlock|supercharge|seamless|cutting-edge|next-generation|game-changing|leverage|synergy|empower|transform your business/i, why: 'banned word' },
      { re: /get started|learn more/i, why: 'banned label' },
      { re: /autonomous|next hire|bigger payroll|AI-powered/i, why: 'contradiction or badge' },
    ]),
  // The free audit and the established-company buyer are gone.
  offer: () =>
    scan(sourceFiles, [
      { re: /free audit|operations audit|the audit\b|audit is free|two weeks|executive sponsor|established compan/i, why: 'old offer' },
      { re: /\bCFO\b|\bCOO\b|\bCEO\b/, why: 'old buyer' },
    ]),
  // One brand only, and no product-fork name left over.
  brand: () => {
    const extra = ['package.json', 'PRODUCT.md', 'deploy/deploy.sh', 'deploy/Dockerfile', 'deploy/README.md', 'deploy/saydeed/docker-compose.yml'].map((f) => join(ROOT, f));
    return scan([...sourceFiles, ...extra], [{ re: /devista|paperclip/i, why: 'old brand' }]);
  },
  // No em or en dashes in site copy.
  dashes: () => scan(sourceFiles, [{ re: /[—–]/, why: 'dash' }]),
  // No hex, rgb() or arbitrary pixel values outside the token files.
  tokens: () =>
    scan(
      sourceFiles.filter((f) => !/og\.tsx$|opengraph-image\.tsx$|icon\.tsx$/.test(f)),
      [
        { re: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])|rgba?\(/, why: 'raw colour' },
        { re: /\[\d+(\.\d+)?(px|rem)\]/, why: 'arbitrary value' },
      ],
    ),
  // The confirmed facts appear, and invented ones do not.
  facts: () => {
    const all = sourceFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
    const hits = [];
    for (const must of ['US$1,500', 'US$3,000', 'US$5,000', 'US$1,000', '7 days']) if (!all.includes(must)) hits.push(`missing fact: ${must}`);
    for (const bad of [/testimonial/i, /\b\d+% (faster|cheaper|more)/i, /trusted by/i, /case stud/i, /LLC/]) {
      const m = all.match(bad);
      if (m) hits.push(`invented proof or entity: ${m[0]}`);
    }
    return hits;
  },
};

const name = process.argv[2];
if (!CHECKS[name]) {
  console.error(`Unknown check "${name}". Use one of: ${Object.keys(CHECKS).join(', ')}`);
  process.exit(2);
}
const hits = CHECKS[name]();
if (hits.length) {
  console.error(`${name} check FAILED with ${hits.length} hit(s):\n${hits.join('\n')}`);
  process.exit(1);
}
console.log(`${name} check passed`);
