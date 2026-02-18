/** ✨ built by nich */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const docsDir = join(__dirname, '..', 'docs');

describe('Hackathon Submission Documents', () => {
  // ---- Required files exist ----
  describe('Required files exist', () => {
    const requiredDocs = [
      'PROJECT.md',
      'TECHNICAL.md',
      'EXTRAS.md',
      'AI_BUILD_LOG.md',
    ];

    for (const doc of requiredDocs) {
      it(`docs/${doc} exists`, () => {
        expect(existsSync(join(docsDir, doc))).toBe(true);
      });
    }
  });

  // ---- PROJECT.md content ----
  describe('PROJECT.md has required sections', () => {
    const content = existsSync(join(docsDir, 'PROJECT.md'))
      ? readFileSync(join(docsDir, 'PROJECT.md'), 'utf-8')
      : '';

    it('has Problem section', () => {
      expect(content).toMatch(/##.*Problem/i);
    });

    it('has Solution section', () => {
      expect(content).toMatch(/##.*Solution/i);
    });

    it('has Impact or Differentiation section', () => {
      expect(content).toMatch(/##.*(Impact|Differentiat)/i);
    });

    it('has Roadmap section', () => {
      expect(content).toMatch(/##.*Roadmap/i);
    });

    it('mentions BNB Chain', () => {
      expect(content).toContain('BNB Chain');
    });
  });

  // ---- TECHNICAL.md content ----
  describe('TECHNICAL.md has required sections', () => {
    const content = existsSync(join(docsDir, 'TECHNICAL.md'))
      ? readFileSync(join(docsDir, 'TECHNICAL.md'), 'utf-8')
      : '';

    it('has Architecture section', () => {
      expect(content).toMatch(/##.*Architecture/i);
    });

    it('has Setup section', () => {
      expect(content).toMatch(/##.*Setup/i);
    });

    it('has Demo section', () => {
      expect(content).toMatch(/##.*Demo/i);
    });

    it('contains a mermaid diagram', () => {
      expect(content).toContain('```mermaid');
    });
  });

  // ---- EXTRAS.md content ----
  describe('EXTRAS.md has required content', () => {
    const content = existsSync(join(docsDir, 'EXTRAS.md'))
      ? readFileSync(join(docsDir, 'EXTRAS.md'), 'utf-8')
      : '';

    it('has Live Deployments table', () => {
      expect(content).toMatch(/live.*deploy/i);
    });

    it('has Onchain Proof table', () => {
      expect(content).toMatch(/onchain.*proof/i);
    });

    it('contains vercel.app link', () => {
      expect(content).toContain('bnb-chain-toolkit.vercel.app');
    });

    it('contains erc8004.agency link', () => {
      expect(content).toContain('erc8004.agency');
    });
  });

  // ---- AI_BUILD_LOG.md content ----
  describe('AI_BUILD_LOG.md has content', () => {
    const content = existsSync(join(docsDir, 'AI_BUILD_LOG.md'))
      ? readFileSync(join(docsDir, 'AI_BUILD_LOG.md'), 'utf-8')
      : '';

    it('is non-empty', () => {
      expect(content.length).toBeGreaterThan(100);
    });

    it('mentions AI tools used', () => {
      expect(content).toMatch(/claude|copilot|chatgpt|cursor|ai/i);
    });
  });

  // ---- README.md hackathon sections ----
  describe('README.md has hackathon sections', () => {
    const readmePath = join(__dirname, '..', 'README.md');
    const content = existsSync(readmePath)
      ? readFileSync(readmePath, 'utf-8')
      : '';

    it('has Onchain Proof section', () => {
      expect(content).toMatch(/##.*Onchain Proof/i);
    });

    it('has Hackathon section', () => {
      expect(content).toMatch(/##.*Hackathon/i);
    });

    it('links to bsc.address', () => {
      expect(content).toContain('bsc.address');
    });

    it('links to docs/PROJECT.md', () => {
      expect(content).toContain('docs/PROJECT.md');
    });

    it('links to docs/TECHNICAL.md', () => {
      expect(content).toContain('docs/TECHNICAL.md');
    });

    it('links to docs/EXTRAS.md', () => {
      expect(content).toContain('docs/EXTRAS.md');
    });
  });
});
