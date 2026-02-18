/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BNB CHAIN AI TOOLKIT - Monaco Editor Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 * Configures Monaco Editor to use locally bundled assets instead of CDN,
 * eliminating CSP violations from loading external scripts.
 *
 * ✨ Author: nich | 🐦 x.com/nichxbt | 🐙 github.com/nirholas
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Configure Monaco web workers for local execution (no CDN required)
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') return new jsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker();
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  },
};

// Tell @monaco-editor/react to use the bundled Monaco instead of CDN
loader.config({ monaco });

export { monaco };
