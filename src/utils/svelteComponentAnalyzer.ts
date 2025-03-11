import * as vscode from 'vscode';

export interface SvelteComponentAnalysis {
  svelteVersion: '4' | '5' | 'unknown';
  props: string[];
  imports: string[];
  exports: string[];
  scripts: string[];
  hasstyle: boolean;

  // These fields are used in analyzeSvelte.ts but were removed in our edits
  events: string[];
  stores: string[];
  notes: string[];
  suggestions: string[];
}

/**
 * Analyzes a Svelte component and extracts key information
 *
 * @param content - The content of the Svelte component file
 * @returns Analysis of the component
 */
export function analyzeSvelteComponent(
  content: string,
): SvelteComponentAnalysis {
  const analysis: SvelteComponentAnalysis = {
    svelteVersion: 'unknown',
    props: [],
    imports: [],
    exports: [],
    scripts: [],
    hasstyle: false,

    // Initialize the missing fields
    events: [],
    stores: [],
    notes: [],
    suggestions: [],
  };

  // Check for Svelte 5 features
  if (
    content.includes('$state') ||
    content.includes('$derived') ||
    content.includes('$effect')
  ) {
    analysis.svelteVersion = '5';
  } else {
    // Default to Svelte 4 if no specific Svelte 5 features are found
    analysis.svelteVersion = '4';
  }

  // Extract props (simplistic approach - in a real implementation, you'd want to use an AST parser)
  const propMatches =
    content.match(/export\s+let\s+(\w+)(\s*=\s*[^;]+)?;/g) || [];
  propMatches.forEach((match) => {
    const propName = match
      .replace(/export\s+let\s+/, '')
      .replace(/\s*=.*/, '')
      .trim();
    analysis.props.push(propName);
  });

  // Check for event dispatching
  if (content.includes('createEventDispatcher')) {
    analysis.notes.push('Component dispatches events.');

    // Try to extract dispatched events
    const dispatchRegex = /dispatch\s*\(\s*['"](\w+)['"]/g;
    let match;
    while ((match = dispatchRegex.exec(content)) !== null) {
      analysis.events.push(match[1]);
    }
  }

  // Check for store usage
  const storeRegex =
    /import\s+\{?\s*(\w+)\s*\}?\s+from\s+['"]svelte\/store['"]/g;
  let storeMatch;
  while ((storeMatch = storeRegex.exec(content)) !== null) {
    analysis.stores.push(storeMatch[1]);
  }

  // Check for style section
  analysis.hasstyle =
    content.includes('<style') && content.includes('</style>');

  // Extract imports
  const importMatches = content.match(/import\s+.+\s+from\s+['"].+['"]/g) || [];
  analysis.imports = importMatches.map((match) => match.trim());

  // Extract exports
  const exportMatches =
    content.match(/export\s+(const|let|function|class)\s+\w+/g) || [];
  analysis.exports = exportMatches.map((match) => match.trim());

  // Add some general suggestions
  if (content.includes('<script>') && !content.includes('<script lang="ts">')) {
    analysis.suggestions.push(
      'Consider using TypeScript for better type safety with <script lang="ts">.',
    );
  }

  if (content.includes('onMount') && content.includes('fetch(')) {
    analysis.suggestions.push(
      "Consider using SvelteKit's data loading pattern with load() functions instead of fetch() in onMount().",
    );
  }

  return analysis;
}

/**
 * Analyzes the Svelte component in the active editor
 *
 * @returns Analysis results or null if no valid Svelte component is open
 */
export async function analyzeActiveEditor(): Promise<SvelteComponentAnalysis | null> {
  const editor = vscode.window.activeTextEditor;

  if (!editor || !editor.document.fileName.endsWith('.svelte')) {
    return null;
  }

  const content = editor.document.getText();
  return analyzeSvelteComponent(content);
}
