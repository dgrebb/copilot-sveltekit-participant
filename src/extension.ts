import * as vscode from 'vscode'
import { openChat } from './commands/openChat'
import { ChatView } from './views/chatView'

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "copilot-chat-participant" is now active!',
  )

  let disposable = vscode.commands.registerCommand('extension.openChat', () => {
    openChat()
    const chatView = new ChatView()
    chatView.show()
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
