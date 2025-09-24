#!/usr/bin/env node
// Heuristic scanner for figure modules to find likely server-side import failures.
// It looks for common browser-only globals and prints file/line matches so you can
// inspect and guard them (e.g. `if (typeof window !== 'undefined')`).

import fs from 'fs/promises';
import path from 'path';

const ROOT = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const FIGURES_DIR = path.join(ROOT, 'src', 'content', 'figures');

const exts = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];

const patterns = [
	{name: 'window', re: /\bwindow\b/},
	{name: 'document', re: /\bdocument\b/},
	{name: 'matchMedia', re: /matchMedia\s*\(/},
	{name: 'katex.renderToString', re: /katex\.renderToString\s*\(/},
	{name: 'ResizeObserver', re: /\bResizeObserver\b/},
	{name: 'IntersectionObserver', re: /\bIntersectionObserver\b/},
];

async function walk(dir) {
	const res = [];
	try {
		for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				res.push(...await walk(full));
			} else if (entry.isFile()) {
				if (entry.name === 'index.js' || entry.name === 'index.jsx' || entry.name === 'index.ts' || entry.name === 'index.tsx' || entry.name === 'index.mjs') {
					res.push(full);
				}
			}
		}
	} catch (err) {
		// ignore
	}
	return res;
}

function safeLine(line) {
	// ignore obvious guards on the same line
	if (/typeof\s+window/.test(line)) return true;
	if (/typeof\s+document/.test(line)) return true;
	if (/if\s*\(.*typeof\s+window/.test(line)) return true;
	return false;
}

async function scan() {
	console.log('Scanning figure index files under:', FIGURES_DIR);
	const files = await walk(FIGURES_DIR);
	if (!files.length) {
		console.log('No figure index files found.');
		return;
	}

	let totalHits = 0;
	for (const f of files) {
		const txt = await fs.readFile(f, 'utf8');
		const lines = txt.split(/\r?\n/);
		const hits = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			for (const p of patterns) {
				if (p.re.test(line) && !safeLine(line)) {
					hits.push({line: i+1, token: p.name, snippet: line.trim()});
					break;
				}
			}
		}
		if (hits.length) {
			totalHits += hits.length;
			console.log('\n--', path.relative(ROOT, f));
			for (const h of hits) {
				console.log(`${h.line}: [${h.token}] ${h.snippet}`);
			}
		}
	}

	console.log('\nScan complete. Candidate hits:', totalHits);
	if (totalHits > 0) {
		console.log('For each hit, open the file and guard browser globals with `if (typeof window !== "undefined") { ... }`.');
	} else {
		console.log('No obvious browser-global hits found by heuristics.');
	}
}

scan().catch(err => {
	console.error('Error running scan:', err && err.stack || err);
	process.exitCode = 2;
});

