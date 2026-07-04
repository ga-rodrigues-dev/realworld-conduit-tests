#!/usr/bin/env node
/**
 * Extract Playwright codegen snippets from MCP save-session session.md files.
 * Reads outputDir from .cursor/mcp.config.json.
 * Usage: node scripts/session-md-to-spec.mjs [session.md]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const mcpConfigPath = path.join(repoRoot, '.cursor', 'mcp.config.json');

function getOutputDir() {
  if (!fs.existsSync(mcpConfigPath)) {
    console.error(`Missing ${mcpConfigPath}`);
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  if (!cfg.outputDir) {
    console.error('outputDir not set in .cursor/mcp.config.json');
    process.exit(1);
  }
  return path.join(repoRoot, cfg.outputDir);
}

const defaultArtifacts = getOutputDir();

const sessionPath =
  process.argv[2] ||
  (() => {
    if (!fs.existsSync(defaultArtifacts)) {
      console.error(`No outputDir at ${defaultArtifacts}. Pass path to session.md`);
      process.exit(1);
    }
    const dirs = fs
      .readdirSync(defaultArtifacts)
      .filter((n) => n.startsWith('session-'))
      .map((n) => ({ n, t: fs.statSync(path.join(defaultArtifacts, n)).mtimeMs }))
      .sort((a, b) => b.t - a.t);
    if (!dirs.length) {
      console.error(`No session-* folders in ${defaultArtifacts}`);
      process.exit(1);
    }
    return path.join(defaultArtifacts, dirs[0].n, 'session.md');
  })();

const md = fs.readFileSync(sessionPath, 'utf8');
const blocks = [...md.matchAll(/"code":\s*"((?:\\.|[^"\\])*)"/g)];

console.log(`# Snippets from ${sessionPath}\n`);
for (const [, raw] of blocks) {
  const code = JSON.parse(`"${raw}"`);
  if (code && !code.startsWith('await new Promise')) {
    console.log(code);
    console.log('');
  }
}

console.log(
  '# Note: wire login via tests/helpers/login.js; replace process.env fills; use page.once("dialog") for alerts.\n'
);
