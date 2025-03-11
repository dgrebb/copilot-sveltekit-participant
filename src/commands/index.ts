import * as vscode from 'vscode';
import { ChatView } from '../views/chatView';
import {
  analyzeSvelteComponent,
  analyzeSvelteKitProject,
} from './analyzeSvelte';

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
    'copilot-participant-svelte.openSvelteChat',
    () => {
      chatView.show();
    },
  );

  // Register the askSvelteQuestion command
  const askQuestionCommand = vscode.commands.registerCommand(
    'copilot-participant-svelte.askSvelteQuestion',
    async () => {
      const question = await vscode.window.showInputBox({
        prompt: 'What would you like to know about Svelte or SvelteKit?',
        placeHolder: 'Enter your Svelte/SvelteKit question...',
      });

      if (question) {
        // Open the chat and automatically send the question
        chatView.show();
        chatView.sendMessage(question);
      }
    },
  );

  // Register the analyze Svelte component command
  const analyzeComponentCommand = vscode.commands.registerCommand(
    'copilot-participant-svelte.analyzeSvelteComponent',
    analyzeSvelteComponent,
  );

  // Register the analyze SvelteKit project command
  const analyzeProjectCommand = vscode.commands.registerCommand(
    'copilot-participant-svelte.analyzeSvelteKitProject',
    analyzeSvelteKitProject,
  );

  // Add commands to subscriptions for proper disposal
  context.subscriptions.push(
    openChatCommand,
    askQuestionCommand,
    analyzeComponentCommand,
    analyzeProjectCommand,
  );
}
