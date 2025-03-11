import * as vscode from 'vscode';
import { ChatView } from './views/chatView';
import { registerCommands } from './commands';
import { analyzeSvelteComponent } from './utils/svelteComponentAnalyzer';

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

      // Get message history for context - both user and assistant messages
      const previousMessages = context.history;

      // Initialize messages with our base prompt
      const messages = [vscode.LanguageModelChatMessage.User(BASE_PROMPT)];

      // Add previous messages to maintain conversation context
      for (let i = 0; i < previousMessages.length; i++) {
        const turn = previousMessages[i];

        if (turn instanceof vscode.ChatRequestTurn) {
          // This is a user message
          messages.push(vscode.LanguageModelChatMessage.User(turn.prompt));
        } else if (turn instanceof vscode.ChatResponseTurn) {
          // This is an assistant response
          let fullMessage = '';
          turn.response.forEach((r) => {
            if (r instanceof vscode.ChatResponseMarkdownPart) {
              const mdPart = r as vscode.ChatResponseMarkdownPart;
              fullMessage += mdPart.value.value;
            }
          });
          messages.push(vscode.LanguageModelChatMessage.Assistant(fullMessage));
        }
      }

      // Just check for commands first, then our own reference extraction
      if (request.command === 'help') {
        messages.push(
          vscode.LanguageModelChatMessage.User(
            'Provide a detailed explanation and examples for this Svelte/SvelteKit concept: ' +
              request.prompt,
          ),
        );
      } else if (request.command === 'analyze') {
        // Existing analysis code...
      } else {
        // Regular chat mode - check for file or selection references in prompt
        const fileRefs = extractFileReferences(request.prompt);
        const hasSelectionRef = extractSelectionReferences(request.prompt);

        if (fileRefs.length > 0 || hasSelectionRef) {
          // Handling file and selection references
          let fileContent = '';
          let fileContext = '';

          // Handle file references
          if (fileRefs.length > 0) {
            // Try to get the content of each referenced file
            for (const fileName of fileRefs) {
              const fileData = await getFileContentByName(fileName);
              if (fileData) {
                const { content, uri } = fileData;
                const fileExtension = fileName.split('.').pop() || '';

                fileContent += `## File: ${fileName}\n\n`;
                fileContent +=
                  '```' + fileExtension + '\n' + content + '\n```\n\n';

                // If it's a Svelte file, provide additional analysis
                if (fileExtension === 'svelte') {
                  try {
                    const analysis = analyzeSvelteComponent(content);
                    // Analysis code...
                  } catch (error) {
                    fileContent += `Error analyzing component: ${error}\n\n`;
                  }
                }

                fileContext = fileContent;
              }
            }

            if (fileContext) {
              // Create a prompt that focuses on the specific file(s)
              const filePrompt =
                `I need you to analyze these specific file(s) that the user mentioned:\n\n` +
                fileContext +
                `\nThe user asked: "${request.prompt}"\n\n` +
                `Focus your response specifically on these file(s) and provide actionable feedback based on Svelte best practices.`;

              messages.push(vscode.LanguageModelChatMessage.User(filePrompt));
            } else {
              // We couldn't find the referenced files
              messages.push(
                vscode.LanguageModelChatMessage.User(
                  `The user mentioned some files (${fileRefs.join(
                    ', ',
                  )}) but I couldn't find them in the workspace. ` +
                    `Please apologize and ask for the correct file name.\n\n` +
                    `The user's original question was: ${request.prompt}`,
                ),
              );
            }
          } else if (hasSelectionRef) {
            // Fix for line 192:27 - Missing curly braces after if condition
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.selection && !editor.selection.isEmpty) {
              const document = editor.document;
              const selection = editor.selection;
              const selectedText = document.getText(selection);
              const fileName = document.fileName.split('/').pop() || '';
              const fileExtension = fileName.split('.').pop() || '';

              const selectionPrompt =
                `I need you to analyze this selected code from ${fileName}:\n\n` +
                '```' +
                fileExtension +
                '\n' +
                selectedText +
                '\n```\n\n' +
                `\nThe user asked: "${request.prompt}"\n\n` +
                `Focus your response on this selected code and provide actionable feedback based on Svelte best practices.`;

              messages.push(
                vscode.LanguageModelChatMessage.User(selectionPrompt),
              );
            } else {
              messages.push(
                vscode.LanguageModelChatMessage.User(
                  `The user referenced a selection (#selection:) but there is no active selection in the editor. ` +
                    `Please ask them to select some code first.\n\n` +
                    `The user's original question was: ${request.prompt}`,
                ),
              );
            }
          }
        } else {
          // Just use the standard prompt
          messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
        }
      }

      // Send the request to the language model
      const chatResponse = await request.model.sendRequest(messages, {}, token);

      // Collect the full response to check for documentation references
      let fullResponseText = '';

      // Stream the response to the user
      for await (const fragment of chatResponse.text) {
        fullResponseText += fragment;
        response.markdown(fragment);
      }

      // Only add resources in specific situations
      const shouldShowResources =
        // If this is the first message in the conversation
        previousMessages.length === 0 ||
        // Or if the user explicitly asked for resources/docs/documentation
        request.prompt.toLowerCase().includes('resource') ||
        request.prompt.toLowerCase().includes('documentation') ||
        request.prompt.toLowerCase().includes('docs') ||
        request.prompt.toLowerCase().includes('where can i find') ||
        // Or if the response indicates they might need more help
        fullResponseText.includes('refer to the documentation') ||
        fullResponseText.includes('you can learn more');

      if (shouldShowResources) {
        response.markdown(
          '\n\n---\n\n**Resources:**\n- [Svelte Documentation](https://svelte.dev/docs)\n- [SvelteKit Documentation](https://kit.svelte.dev/docs)',
        );
      }
    } catch (error) {
      console.error('Error handling chat request:', error);
      response.markdown(
        'Sorry, I encountered an error while processing your request. Please try again or check the logs for more details.',
      );
    }
  };

  // Create the participants with the IDs from package.json
  const svelteParticipant = vscode.chat.createChatParticipant(
    'copilot-participant.svelte.svelte',
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

// Helper function to extract file references
function extractFileReferences(prompt: string): string[] {
  const fileRegex = /#file:([^\s]+)/g;
  const matches = [...prompt.matchAll(fileRegex)];
  return matches.map((match) => match[1]);
}

// Add support for #selection: references
function extractSelectionReferences(prompt: string): boolean {
  return prompt.includes('#selection:');
}

// Add support for #line: references
function extractLineReferences(
  prompt: string,
): { file: string; line: number }[] {
  const lineRegex = /#line:(\d+)(?::(\d+))?\s+in\s+([^\s]+)/g;
  const matches = [...prompt.matchAll(lineRegex)];
  return matches.map((match) => ({
    line: parseInt(match[1]),
    column: match[2] ? parseInt(match[2]) : undefined,
    file: match[3],
  }));
}

// Helper function to get file content by name
async function getFileContentByName(
  fileName: string,
): Promise<{ content: string; uri: vscode.Uri } | null> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return null;

  // Try to find the file in the workspace
  const files = await vscode.workspace.findFiles(
    `**/${fileName}`,
    '**/node_modules/**',
  );
  if (files.length === 0) return null;

  // Read the content of the first matching file
  try {
    const content = await vscode.workspace.fs.readFile(files[0]);
    return {
      content: new TextDecoder().decode(content),
      uri: files[0],
    };
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    return null;
  }
}
