import * as vscode from 'vscode';
import { ChatView } from './views/chatView';
import { registerCommands } from './commands';

// Define a base prompt for the Svelte expert
const BASE_PROMPT = `
You are a Svelte and SvelteKit expert assistant. You provide accurate, helpful information about:
- Svelte components, reactivity, and lifecycle
- SvelteKit routing, SSR, and deployment
- SvelteKit project architecture and best practices
- Vite configuration for SvelteKit projects
- TypeScript integration in Svelte projects

Only answer questions related to Svelte, SvelteKit, and closely related topics like Vite when used with SvelteKit.
Provide code examples whenever possible to illustrate concepts.
`;

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

  // Define the handler separate from participant properties
  const chatHandler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    response: vscode.ChatResponseStream,
    token: vscode.CancellationToken,
  ): Promise<void> => {
    try {
      // Let the user know we're processing their request
      response.progress('Processing your Svelte/SvelteKit question...');

      // Initialize messages with our base prompt
      const messages = [vscode.LanguageModelChatMessage.User(BASE_PROMPT)];

      // If this is a command like /analyze or /help, adjust the prompt
      if (request.command === 'analyze') {
        messages.push(
          vscode.LanguageModelChatMessage.User(
            'Analyze the following Svelte/SvelteKit code or concept in detail: ' +
              request.prompt,
          ),
        );
      } else if (request.command === 'help') {
        messages.push(
          vscode.LanguageModelChatMessage.User(
            'Provide a detailed explanation and examples for this Svelte/SvelteKit concept: ' +
              request.prompt,
          ),
        );
      } else {
        // Add the user's message
        messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
      }

      // Get message history for context
      const previousMessages = context.history.filter(
        (h) => h instanceof vscode.ChatResponseTurn,
      );

      // Add previous messages to maintain conversation context
      previousMessages.forEach((m) => {
        let fullMessage = '';
        m.response.forEach((r) => {
          if (r instanceof vscode.ChatResponseMarkdownPart) {
            const mdPart = r as vscode.ChatResponseMarkdownPart;
            fullMessage += mdPart.value.value;
          }
        });
        messages.push(vscode.LanguageModelChatMessage.Assistant(fullMessage));
      });

      // Send the request to the language model
      const chatResponse = await request.model.sendRequest(messages, {}, token);

      // Stream the response to the user
      for await (const fragment of chatResponse.text) {
        response.markdown(fragment);
      }

      // Add helpful resources at the end
      response.markdown(
        '\n\n---\n\n**Resources:**\n- [Svelte Documentation](https://svelte.dev/docs)\n- [SvelteKit Documentation](https://kit.svelte.dev/docs)',
      );
    } catch (error) {
      console.error('Error handling chat request:', error);
      response.markdown(
        'Sorry, I encountered an error while processing your request. Please try again or check the logs for more details.',
      );
    }
  };

  // Create the participants with the IDs from package.json
  const svelteParticipant = vscode.chat.createChatParticipant(
    'copilot-sveltekit-participant.svelte-expert',
    chatHandler,
  );

  console.log('Svelte chat participant registered successfully!');

  // Register the participant to be disposed when the extension is deactivated
  context.subscriptions.push(svelteParticipant);
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
  console.log('Copilot SvelteKit Participant is now deactivated');
}
