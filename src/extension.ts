import * as vscode from 'vscode'
import { ChatView } from './views/chatView'
import { registerCommands } from './commands'

/**
 * This method is called when the extension is activated.
 * It sets up the Svelte/SvelteKit chat participant functionality.
 *
 * @param context - The extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Copilot SvelteKit Participant is now active')

  // Initialize the chat view
  const chatView = new ChatView(context)

  // Register all commands
  registerCommands(context, chatView)

  // Register the chat participant
  const svelteParticipant = vscode.chat.createChatParticipant('svelte-expert', {
    name: 'SvelteKit',
    fullName: 'Svelte & SvelteKit Expert',
    description:
      'Provides expert assistance for Svelte and SvelteKit development',
    isDefault: false,
    supportIssueReporting: true,
    iconPath: vscode.Uri.joinPath(
      context.extensionUri,
      'resources',
      'svelte-logo.png',
    ),

    // Handle incoming chat requests
    async handleChatRequest(request, context, response, token) {
      try {
        // Acknowledge the request started
        await response.progress([
          'Processing your Svelte/SvelteKit question...',
        ])

        // Here we would normally process the request with specialized Svelte knowledge
        // For now, we'll just respond with a generic message
        await response.markdown(`**Svelte Expert**: ${request.prompt}`)

        // Include metadata about Svelte versions when appropriate
        await response.metadata({
          svelteVersion: 'Svelte 5',
          requestType: 'generic',
          referenceLinks: [
            { url: 'https://svelte.dev/docs', title: 'Svelte Documentation' },
            {
              url: 'https://kit.svelte.dev/docs',
              title: 'SvelteKit Documentation',
            },
          ],
        })
      } catch (error) {
        console.error('Error handling chat request:', error)
        await response.markdown(
          'Sorry, I encountered an error while processing your request.',
        )
      }
    },
  })

  // Register the participant to be disposed when the extension is deactivated
  context.subscriptions.push(svelteParticipant)
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
  console.log('Copilot SvelteKit Participant is now deactivated')
}
