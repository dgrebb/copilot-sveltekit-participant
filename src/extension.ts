import * as vscode from 'vscode';
import { ChatView } from './views/chatView';
import { registerCommands } from './commands';

/**
 * This method is called when the extension is activated.
 * It sets up the Svelte/SvelteKit chat participant functionality.
 *
 * @param context - The extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage(
    'SvelteKit Chat Participant is now active!',
  );
  console.log('Copilot SvelteKit Participant is now active');

  // Initialize the chat view
  const chatView = new ChatView(context);

  // Register all commands
  registerCommands(context, chatView);

  // Register the chat participant
  console.log('Attempting to register SvelteKit chat participant...');

  // Define the handler separate from participant properties
  const svelteHandler = {
    // Handle incoming chat requests - with proper type annotations
    async handleRequest(
      request: vscode.ChatRequest,
      context: vscode.ChatContext,
      response: vscode.ChatResponseStream,
      token: vscode.CancellationToken,
    ): Promise<void> {
      try {
        // Acknowledge the request started
        response.progress('Processing your Svelte/SvelteKit question...');

        // Here we would normally process the request with specialized Svelte knowledge
        // For now, we'll just respond with a generic message
        response.markdown(`**Svelte Expert**: ${request.prompt}`);
        // Include metadata about Svelte versions when appropriate
        response.markdown(
          '\n\n---\n\n**Resources:**\n- [Svelte Documentation](https://svelte.dev/docs)\n- [SvelteKit Documentation](https://kit.svelte.dev/docs)',
        );
      } catch (error) {
        console.error('Error handling chat request:', error);
        response.markdown(
          'Sorry, I encountered an error while processing your request.',
        );
      }
    },
  };

  // Create the participant with just the handler
  const svelteParticipant = vscode.chat.createChatParticipant(
    'SvelteKit',
    svelteHandler as unknown as vscode.ChatRequestHandler,
  );

  // Also register a 'svelte' participant with the same handler
  const svelteAlternateParticipant = vscode.chat.createChatParticipant(
    'svelte',
    svelteHandler as unknown as vscode.ChatRequestHandler,
  );

  // After creation, configure the display names
  vscode.commands.executeCommand(
    'setContext',
    'chat.participantDisplayName.SvelteKit',
    'Svelte & SvelteKit Expert',
  );

  vscode.commands.executeCommand(
    'setContext',
    'chat.participantDisplayName.svelte',
    'Svelte & SvelteKit Expert',
  );

  console.log('SvelteKit chat participants registered successfully!');

  // Register the participants to be disposed when the extension is deactivated
  context.subscriptions.push(svelteParticipant, svelteAlternateParticipant);
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
  console.log('Copilot SvelteKit Participant is now deactivated');
}
