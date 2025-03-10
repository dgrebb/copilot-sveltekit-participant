import * as vscode from 'vscode'

/**
 * Manages the chat WebView panel for the Svelte/SvelteKit expert
 */
export class ChatView {
  private panel: vscode.WebviewPanel | undefined
  private context: vscode.ExtensionContext
  private messages: { sender: string; text: string }[] = []

  /**
   * Creates a new ChatView instance
   *
   * @param context - The extension context
   */
  constructor(context: vscode.ExtensionContext) {
    this.context = context

    // Load previous messages from storage if they exist
    const storedMessages =
      this.context.globalState.get<{ sender: string; text: string }[]>(
        'chatMessages',
      )
    if (storedMessages) {
      this.messages = storedMessages
    }
  }

  /**
   * Shows the chat panel, creating it if it doesn't exist
   */
  public show() {
    if (this.panel) {
      this.panel.reveal()
    } else {
      this.panel = vscode.window.createWebviewPanel(
        'svelteKitChat',
        'Svelte & SvelteKit Expert',
        vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(this.context.extensionUri, 'media'),
          ],
        },
      )

      // Handle panel disposal
      this.panel.onDidDispose(
        () => {
          this.panel = undefined
        },
        null,
        this.context.subscriptions,
      )

      // Handle messages from the webview
      this.panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case 'sendMessage':
              this.sendMessage(message.text)
              break
          }
        },
        undefined,
        this.context.subscriptions,
      )

      // Set initial HTML content
      this.updateWebviewContent()
    }
  }

  /**
   * Sends a message to the chat
   *
   * @param text - The message text to send
   */
  public async sendMessage(text: string): Promise<void> {
    // Add user message to history
    this.messages.push({ sender: 'user', text })

    // Update UI
    this.updateWebviewContent()

    // Save messages to storage
    this.context.globalState.update('chatMessages', this.messages)

    // In a real implementation, we would send this to the Copilot API
    // For now, we'll just simulate a response
    // Normally this would call the participant's handleChatRequest

    setTimeout(() => {
      // Simulate an expert response
      this.messages.push({
        sender: 'assistant',
        text: `I'm your Svelte/SvelteKit expert assistant. You asked: "${text}". In a real implementation, I would provide expert Svelte advice here.`,
      })

      // Update UI with response
      this.updateWebviewContent()

      // Save messages to storage
      this.context.globalState.update('chatMessages', this.messages)
    }, 1000)
  }

  /**
   * Updates the webview panel with the current messages
   */
  private updateWebviewContent() {
    if (!this.panel) {
      return
    }

    this.panel.webview.html = this.getHtmlForWebview()
  }

  /**
   * Generates the HTML content for the webview
   *
   * @returns HTML string for the webview
   */
  private getHtmlForWebview() {
    // Convert messages to HTML
    const messagesHtml = this.messages
      .map((message) => {
        const isUser = message.sender === 'user'
        const className = isUser ? 'user-message' : 'assistant-message'
        const senderLabel = isUser ? 'You' : 'SvelteKit Expert'

        return `
        <div class="message ${className}">
          <div class="message-header">${senderLabel}</div>
          <div class="message-content">${this.escapeHtml(message.text)}</div>
        </div>
      `
      })
      .join('')

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Svelte & SvelteKit Expert</title>
        <style>
          body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
          }

          .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }

          .message {
            margin-bottom: 16px;
            padding: 12px;
            border-radius: 6px;
          }

          .user-message {
            background-color: var(--vscode-inputValidation-infoBackground);
            align-self: flex-end;
          }

          .assistant-message {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
          }

          .message-header {
            font-weight: bold;
            margin-bottom: 8px;
          }

          .input-container {
            display: flex;
            padding: 16px;
            border-top: 1px solid var(--vscode-panel-border);
          }

          #message-input {
            flex: 1;
            padding: 8px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
          }

          #send-button {
            margin-left: 8px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          }

          #send-button:hover {
            background-color: var(--vscode-button-hoverBackground);
          }
        </style>
      </head>
      <body>
        <div class="chat-container" id="chat-container">
          ${messagesHtml}
        </div>
        <div class="input-container">
          <input type="text" id="message-input" placeholder="Ask about Svelte or SvelteKit...">
          <button id="send-button">Send</button>
        </div>
        <script>
          const vscode = acquireVsCodeApi();

          // Scroll to bottom of chat
          const chatContainer = document.getElementById('chat-container');
          chatContainer.scrollTop = chatContainer.scrollHeight;

          // Send message when button is clicked
          document.getElementById('send-button').addEventListener('click', () => {
            sendMessage();
          });

          // Send message when Enter key is pressed
          document.getElementById('message-input').addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
              sendMessage();
            }
          });

          function sendMessage() {
            const input = document.getElementById('message-input');
            const text = input.value.trim();

            if (text) {
              vscode.postMessage({
                command: 'sendMessage',
                text: text
              });

              // Clear input
              input.value = '';
            }
          }
        </script>
      </body>
      </html>
    `
  }

  /**
   * Escapes HTML special characters to prevent XSS
   *
   * @param text - The text to escape
   * @returns Escaped HTML string
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}
