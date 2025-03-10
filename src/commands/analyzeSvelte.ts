import * as vscode from 'vscode'
import { analyzeActiveEditor } from '../utils/svelteComponentAnalyzer'
import { analyzeProjectViteConfig } from '../utils/viteConfigUtils'
import { analyzeSvelteKitRoutes } from '../utils/svelteKitUtils'

/**
 * Analyzes the current Svelte component and provides feedback
 */
export async function analyzeSvelteComponent(): Promise<void> {
  try {
    // Analyze the active editor if it contains a Svelte component
    const componentAnalysis = await analyzeActiveEditor()

    if (!componentAnalysis) {
      vscode.window.showInformationMessage(
        'Please open a Svelte (.svelte) file to analyze.',
      )
      return
    }

    // Create markdown output for the analysis
    let output = '# Svelte Component Analysis\n\n'

    // Add version info
    output += `## Svelte Version\n\n`
    output += `Detected version: **${componentAnalysis.svelteVersion}**\n\n`

    // Add props
    if (componentAnalysis.props.length > 0) {
      output += `## Props\n\n`
      componentAnalysis.props.forEach((prop) => {
        output += `- \`${prop}\`\n`
      })
      output += '\n'
    }

    // Add events
    if (componentAnalysis.events.length > 0) {
      output += `## Events\n\n`
      componentAnalysis.events.forEach((event) => {
        output += `- \`${event}\`\n`
      })
      output += '\n'
    }

    // Add stores
    if (componentAnalysis.stores.length > 0) {
      output += `## Stores\n\n`
      componentAnalysis.stores.forEach((store) => {
        output += `- \`${store}\`\n`
      })
      output += '\n'
    }

    // Add notes
    if (componentAnalysis.notes.length > 0) {
      output += `## Notes\n\n`
      componentAnalysis.notes.forEach((note) => {
        output += `- ${note}\n`
      })
      output += '\n'
    }

    // Add suggestions
    if (componentAnalysis.suggestions.length > 0) {
      output += `## Suggestions\n\n`
      componentAnalysis.suggestions.forEach((suggestion) => {
        output += `- ${suggestion}\n`
      })
      output += '\n'
    }

    // Show the analysis in a new editor
    const doc = await vscode.workspace.openTextDocument({
      content: output,
      language: 'markdown',
    })
    await vscode.window.showTextDocument(doc, { preview: false })
  } catch (error) {
    vscode.window.showErrorMessage(`Error analyzing Svelte component: ${error}`)
  }
}

/**
 * Analyzes the current SvelteKit project and provides feedback
 */
export async function analyzeSvelteKitProject(): Promise<void> {
  try {
    // Analyze Vite configuration
    const viteConfig = await analyzeProjectViteConfig()

    // Analyze SvelteKit routes
    const routesAnalysis = await analyzeSvelteKitRoutes()

    if (!viteConfig && !routesAnalysis) {
      vscode.window.showInformationMessage(
        'No SvelteKit project detected in the current workspace.',
      )
      return
    }

    // Create markdown output for the analysis
    let output = '# SvelteKit Project Analysis\n\n'

    // Add routes analysis
    if (routesAnalysis) {
      output += `## Routing\n\n`
      output += `Routing type: **${routesAnalysis.routingType}**\n\n`

      if (routesAnalysis.parameters.length > 0) {
        output += `### Route Parameters\n\n`
        routesAnalysis.parameters.forEach((param) => {
          output += `- \`${param}\`\n`
        })
        output += '\n'
      }

      if (routesAnalysis.notes.length > 0) {
        output += `### Routing Notes\n\n`
        routesAnalysis.notes.forEach((note) => {
          output += `- ${note}\n`
        })
        output += '\n'
      }

      if (routesAnalysis.suggestions.length > 0) {
        output += `### Routing Suggestions\n\n`
        routesAnalysis.suggestions.forEach((suggestion) => {
          output += `- ${suggestion}\n`
        })
        output += '\n'
      }
    }

    // Add Vite configuration analysis
    if (viteConfig) {
      output += `## Vite Configuration\n\n`

      if (viteConfig.svelteKit.length > 0) {
        output += `### SvelteKit Configuration\n\n`
        viteConfig.svelteKit.forEach((suggestion) => {
          output += `- ${suggestion}\n`
        })
        output += '\n'
      }

      if (viteConfig.performance.length > 0) {
        output += `### Performance Optimization\n\n`
        viteConfig.performance.forEach((suggestion) => {
          output += `- ${suggestion}\n`
        })
        output += '\n'
      }

      if (viteConfig.devExperience.length > 0) {
        output += `### Development Experience\n\n`
        viteConfig.devExperience.forEach((suggestion) => {
          output += `- ${suggestion}\n`
        })
        output += '\n'
      }

      if (viteConfig.general.length > 0) {
        output += `### General Suggestions\n\n`
        viteConfig.general.forEach((suggestion) => {
          output += `- ${suggestion}\n`
        })
        output += '\n'
      }
    }

    // Show the analysis in a new editor
    const doc = await vscode.workspace.openTextDocument({
      content: output,
      language: 'markdown',
    })
    await vscode.window.showTextDocument(doc, { preview: false })
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error analyzing SvelteKit project: ${error}`,
    )
  }
}
