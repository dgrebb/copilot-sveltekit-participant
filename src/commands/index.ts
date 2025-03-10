import * as vscode from 'vscode'
import { ChatView } from '../views/chatView'

/**
 * Registers all commands for the extension
 *
 * @param context - The extension context
 * @param chatView - The ChatView instance
 */
export function registerCommands(
  context: vscode.ExtensionContext,
  chatView: ChatView,
): void {
  // Register the openSvelteChat command
  const openChatCommand = vscode.commands.registerCommand(
    'copilot-sveltekit-participant.openSvelteChat',
    () => {
      chatView.show()
    },
  )

  // Register the askSvelteQuestion command
  const askQuestionCommand = vscode.commands.registerCommand(
    'copilot-sveltekit-participant.askSvelteQuestion',
    async () => {
      const question = await vscode.window.showInputBox({
        prompt: 'What would you like to know about Svelte or SvelteKit?',
        placeHolder: 'Enter your Svelte/SvelteKit question...',
      })

      if (question) {
        // Open the chat and automatically send the question
        chatView.show()
        chatView.sendMessage(question)
      }
    },
  )

  // Add commands to subscriptions for proper disposal
  context.subscriptions.push(openChatCommand, askQuestionCommand)
}
