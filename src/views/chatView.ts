import * as vscode from 'vscode'

export class ChatView {
  private panel: vscode.WebviewPanel | undefined

  public show() {
    if (this.panel) {
      this.panel.reveal()
    } else {
      this.panel = vscode.window.createWebviewPanel(
        'copilotChat',
        'SvelteChat',
        vscode.ViewColumn.One,
        {},
      )

      this.panel.webview.html = this.getHtmlForWebview()
    }
  }

  private getHtmlForWebview() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Copilot Chat</title>
    </head>
    <body>
      <h1>Welcome to Copilot Chat!</h1>
    </body>
    </html>`
  }
}
