/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Speculation Rules (CSP-compliant)
 * ═══════════════════════════════════════════════════════════════════════════
 * Injects speculation rules dynamically to avoid inline script CSP violations.
 * Chrome 121+ supports prerender/prefetch via speculation rules API.
 *
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function injectSpeculationRules(): void {
  if (!HTMLScriptElement.supports?.('speculationrules')) return;

  try {
    const rules = {
      prerender: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }],
      prefetch: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }],
    };

    const script = document.createElement('script');
    script.type = 'speculationrules';
    script.textContent = JSON.stringify(rules);
    document.head.appendChild(script);
  } catch {
    // Silently ignore - speculation rules are a progressive enhancement
  }
}
