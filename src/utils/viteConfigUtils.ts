import * as vscode from 'vscode';

/**
 * Interface representing Vite configuration suggestions
 */
export interface ViteConfigSuggestions {
  /**
   * General suggestions for Vite configuration
   */
  general: string[];

  /**
   * SvelteKit-specific suggestions
   */
  svelteKit: string[];

  /**
   * Performance-related suggestions
   */
  performance: string[];

  /**
   * Development experience suggestions
   */
  devExperience: string[];
}

/**
 * Analyzes a Vite configuration file and provides suggestions
 *
 * @param content - The content of the Vite configuration file
 * @returns Configuration suggestions
 */
export function analyzeViteConfig(content: string): ViteConfigSuggestions {
  const suggestions: ViteConfigSuggestions = {
    general: [],
    svelteKit: [],
    performance: [],
    devExperience: [],
  };

  // Check for build optimizations
  if (!content.includes('build: {')) {
    suggestions.performance.push(
      'Consider configuring build options for better production performance.',
    );
  } else {
    if (!content.includes('rollupOptions')) {
      suggestions.performance.push(
        'Configure rollupOptions for more fine-grained control over the build.',
      );
    }
  }

  // Check for proper plugin configuration
  if (!content.includes('@sveltejs/kit/vite')) {
    suggestions.svelteKit.push(
      'Import SvelteKit\'s Vite plugin with `import { sveltekit } from "@sveltejs/kit/vite"`.',
    );
  }

  // Check for server configuration
  if (!content.includes('server: {')) {
    suggestions.devExperience.push(
      'Configure server options for a better development experience.',
    );
  }

  // Check for common optimizations
  if (!content.includes('optimizeDeps')) {
    suggestions.performance.push(
      'Use `optimizeDeps` to control which dependencies are pre-bundled.',
    );
  }

  // Check for SSR configuration
  if (!content.includes('ssr: {')) {
    suggestions.svelteKit.push(
      'Consider configuring SSR options for SvelteKit applications.',
    );
  }

  // Check for environment variables
  if (!content.includes('define: {') && !content.includes('envPrefix')) {
    suggestions.general.push(
      'Configure environment variables with `define` or `envPrefix`.',
    );
  }

  return suggestions;
}

/**
 * Analyzes the Vite configuration in the active project
 *
 * @returns Promise that resolves to configuration suggestions
 */
export async function analyzeProjectViteConfig(): Promise<ViteConfigSuggestions | null> {
  const viteConfigFiles = await vscode.workspace.findFiles(
    '{vite.config.js,vite.config.ts}',
    '**/node_modules/**',
  );

  if (viteConfigFiles.length === 0) {
    return null;
  }

  // Get the content of the first found Vite configuration file
  const document = await vscode.workspace.openTextDocument(viteConfigFiles[0]);
  const content = document.getText();

  return analyzeViteConfig(content);
}
