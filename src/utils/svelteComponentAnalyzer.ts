import * as vscode from 'vscode';
import { detectSvelteVersion } from './svelteVersionUtils';

/**
 * Interface representing the analysis results of a Svelte component
 */
export interface SvelteComponentAnalysis {
  /**
   * The detected Svelte version (4, 5, mixed, or unknown)
   */
  svelteVersion: '4' | '5' | 'mixed' | 'unknown';

  /**
   * Notes about the component, including possible issues
   */
  notes: string[];

  /**
   * Suggestions for improvements
   */
  suggestions: string[];

  /**
   * Properties used in the component
   */
  props: string[];

  /**
   * Events dispatched by the component
   */
  events: string[];

  /**
   * Stores used by the component
   */
  stores: string[];
}

/**
 * Analyzes a Svelte component for potential issues and provides suggestions
 *
 * @param content - The Svelte component content to analyze
 * @returns Analysis results
 */
export function analyzeSvelteComponent(
  content: string,
): SvelteComponentAnalysis {
  // Initialize analysis result
  const analysis: SvelteComponentAnalysis = {
    svelteVersion: 'unknown',
    notes: [],
    suggestions: [],
    props: [],
    events: [],
    stores: [],
  };

  // Detect Svelte version
  const versionInfo = detectSvelteVersion(content);
  analysis.svelteVersion = versionInfo.version;
  analysis.notes = [...versionInfo.notes];

  // Analyze component structure
  if (content.includes('<script>') && !content.includes('<script lang="ts">')) {
    analysis.suggestions.push(
      'Consider using TypeScript for better type safety with <script lang="ts">.',
    );
  }

  // Check for proper prop definitions
  const propRegex = /export\s+let\s+(\w+)(?:\s*=\s*[^;]+)?/g;
  let match;
  while ((match = propRegex.exec(content)) !== null) {
    analysis.props.push(match[1]);
  }

  // Check for event dispatching
  if (content.includes('createEventDispatcher')) {
    analysis.notes.push('Component dispatches events.');

    // Try to extract dispatched events
    const dispatchRegex = /dispatch\s*\(\s*['"](\w+)['"]/g;
    while ((match = dispatchRegex.exec(content)) !== null) {
      analysis.events.push(match[1]);
    }
  }

  // Check for store usage
  const storeRegex =
    /import\s+\{?\s*(\w+)\s*\}?\s+from\s+['"]svelte\/store['"]/g;
  while ((match = storeRegex.exec(content)) !== null) {
    analysis.stores.push(match[1]);
  }

  // Check store usage for Svelte 5 compatibility
  if (analysis.stores.length > 0 && analysis.svelteVersion === '5') {
    analysis.suggestions.push(
      'Consider using $state and $derived instead of svelte/store in Svelte 5.',
    );
  }

  // Check for common issues
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
