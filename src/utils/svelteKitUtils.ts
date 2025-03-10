import * as vscode from 'vscode'

/**
 * Interface representing SvelteKit route analysis
 */
export interface SvelteKitRouteAnalysis {
  /**
   * The detected routing type (pages, filesystem, parameterized)
   */
  routingType: 'pages' | 'filesystem' | 'parameterized' | 'unknown'

  /**
   * Notes about the route structure
   */
  notes: string[]

  /**
   * Suggestions for improvements
   */
  suggestions: string[]

  /**
   * Detected route parameters
   */
  parameters: string[]
}

/**
 * Analyzes a SvelteKit project's routing structure
 *
 * @returns Promise that resolves to route analysis
 */
export async function analyzeSvelteKitRoutes(): Promise<SvelteKitRouteAnalysis | null> {
  // Initialize analysis
  const analysis: SvelteKitRouteAnalysis = {
    routingType: 'unknown',
    notes: [],
    suggestions: [],
    parameters: [],
  }

  // Check for routes or pages directory
  const routesDir = await vscode.workspace.findFiles(
    'src/routes/**',
    '**/node_modules/**',
  )
  const pagesDir = await vscode.workspace.findFiles(
    'src/pages/**',
    '**/node_modules/**',
  )

  if (routesDir.length > 0) {
    analysis.routingType = 'filesystem'
    analysis.notes.push(
      'Project uses SvelteKit filesystem-based routing in src/routes.',
    )

    // Check for parameterized routes (files/directories with [param] syntax)
    const paramRoutes = routesDir.filter(
      (uri) => uri.path.includes('[') && uri.path.includes(']'),
    )
    if (paramRoutes.length > 0) {
      analysis.routingType = 'parameterized'
      analysis.notes.push('Project contains parameterized routes.')

      // Extract parameter names from route paths
      paramRoutes.forEach((uri) => {
        const params = uri.path.match(/\[([^\]]+)\]/g)
        if (params) {
          params.forEach((param) => {
            const paramName = param.replace('[', '').replace(']', '')
            if (!analysis.parameters.includes(paramName)) {
              analysis.parameters.push(paramName)
            }
          })
        }
      })
    }
  } else if (pagesDir.length > 0) {
    analysis.routingType = 'pages'
    analysis.notes.push('Project uses pages directory for routing.')
    analysis.suggestions.push(
      'SvelteKit has standardized on the routes directory. Consider migrating from pages to routes.',
    )
  } else {
    analysis.notes.push(
      'No route structure detected. Make sure your project follows SvelteKit conventions.',
    )
  }

  return analysis
}

/**
 * Generate SvelteKit route template for the given path
 *
 * @param routePath - The route path in SvelteKit format (e.g., /users/[id])
 * @returns Generated route template code
 */
export function generateSvelteKitRouteTemplate(routePath: string): string {
  // Extract parameters from the path
  const params = routePath.match(/\[([^\]]+)\]/g) || []
  const paramNames = params.map((p) => p.replace('[', '').replace(']', ''))

  // Generate the +page.svelte template
  const pageTemplate = `<script lang="ts">
  import { page } from '$app/stores';
  ${
    paramNames.length > 0
      ? `\n  // Access route parameters\n  $: ({ ${paramNames.join(
          ', ',
        )} } = $page.params);`
      : ''
  }
</script>

<svelte:head>
  <title>SvelteKit Route</title>
</svelte:head>

<div class="container">
  <h1>SvelteKit Route${routePath !== '/' ? `: ${routePath}` : ''}</h1>
  ${
    paramNames.length > 0
      ? `\n  <div class="params">
    <h2>Route Parameters:</h2>
    <ul>
      ${paramNames
        .map((param) => `<li><strong>${param}:</strong> {${param}}</li>`)
        .join('\n      ')}
    </ul>
  </div>`
      : ''
  }
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .params {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }
</style>`

  // Generate the +page.server.ts template for data loading
  const serverTemplate = `import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params${
    paramNames.length > 0 ? `, fetch` : ''
  } }) => {
  ${
    paramNames.length > 0
      ? `// Extract parameters\n  const { ${paramNames.join(
          ', ',
        )} } = params;\n\n  `
      : ''
  }return {
    title: 'SvelteKit Route${routePath !== '/' ? `: ${routePath}` : ''}',
    ${paramNames.length > 0 ? `params: { ${paramNames.join(', ')} },` : ''}
  };
};`

  return {
    '+page.svelte': pageTemplate,
    '+page.server.ts': serverTemplate,
  }
}
