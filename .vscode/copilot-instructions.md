## VS Code Extension Specification: Copilot Chat Participant

### Project Overview
This project aims to create a VS Code extension that integrates a Copilot Chat Participant. The extension will be developed using TypeScript and will include robust linting, formatting, and build/watch commands to ensure code quality and ease of development.

### Features
1. **Chat Interface**: A user-friendly chat interface within VS Code for interacting with the Copilot Chat Participant.
2. **Command Palette Integration**: Commands to open the chat interface and interact with the Copilot from the VS Code command palette.
3. **Message History**: Persistent storage of chat history within the workspace.
4. **Configuration Options**: User-configurable settings for customizing the chat experience.

### Technical Requirements
- **Language**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **Build Tool**: Webpack
- **Testing**: Jest

### Project Structure
```
copilot-chat-participant/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── src/
│   ├── commands/
│   │   └── openChat.ts
│   ├── views/
│   │   └── chatView.ts
│   ├── extension.ts
│   └── types/
│       └── index.d.ts
├── test/
│   ├── commands/
│   │   └── openChat.test.ts
│   ├── views/
│   │   └── chatView.test.ts
│   └── extension.test.ts
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
└── webpack.config.js
```

### Setup Instructions

1. **Initialize the Project**
   ```bash
   mkdir copilot-chat-participant
   cd copilot-chat-participant
   npm init -y
   ```

2. **Install Dependencies**
   ```bash
   npm install --save-dev typescript eslint prettier jest webpack webpack-cli ts-loader
   npm install vscode
   ```

3. **Configure TypeScript**
   Create a `tsconfig.json` file:
   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "lib": ["ES6"],
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true
     },
     "include": ["src"],
     "exclude": ["node_modules", "dist"]
   }
   ```

4. **Configure ESLint**
   Create a `.eslintrc.js` file:
   ```javascript
   module.exports = {
     parser: '@typescript-eslint/parser',
     extends: [
       'eslint:recommended',
       'plugin:@typescript-eslint/recommended',
       'prettier'
     ],
     parserOptions: {
       ecmaVersion: 2020,
       sourceType: 'module'
     },
     rules: {
       // Custom rules
     }
   };
   ```

5. **Configure Prettier**
   Create a `.prettierrc` file:
   ```json
   {
     "singleQuote": true,
     "semi": false,
     "trailingComma": "all"
   }
   ```

6. **Configure Webpack**
   Create a `webpack.config.js` file:
   ```javascript
   const path = require('path');

   module.exports = {
     mode: 'development',
     target: 'node',
     entry: './src/extension.ts',
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'extension.js',
       libraryTarget: 'commonjs2'
     },
     resolve: {
       extensions: ['.ts', '.js']
     },
     module: {
       rules: [
         {
           test: /\.ts$/,
           use: 'ts-loader',
           exclude: /node_modules/
         }
       ]
     },
     externals: {
       vscode: 'commonjs vscode'
     }
   };
   ```

7. **Add Scripts to `package.json`**
   ```json
   "scripts": {
     "build": "webpack",
     "watch": "webpack --watch",
     "lint": "eslint 'src/**/*.ts'",
     "format": "prettier --write 'src/**/*.ts'",
     "test": "jest"
   }
   ```

8. **Create Extension Entry Point**
   Create a `src/extension.ts` file:
   ```typescript
   import * as vscode from 'vscode';

   export function activate(context: vscode.ExtensionContext) {
     console.log('Congratulations, your extension "copilot-chat-participant" is now active!');

     let disposable = vscode.commands.registerCommand('extension.openChat', () => {
       vscode.window.showInformationMessage('Hello from Copilot Chat Participant!');
     });

     context.subscriptions.push(disposable);
   }

   export function deactivate() {}
   ```

9. **Create Command Implementation**
   Create a `src/commands/openChat.ts` file:
   ```typescript
   import * as vscode from 'vscode';

   export function openChat() {
     vscode.window.showInformationMessage('Opening Copilot Chat...');
   }
   ```

10. **Create Chat View**
    Create a `src/views/chatView.ts` file:
    ```typescript
    import * as vscode from 'vscode';

    export class ChatView {
      private panel: vscode.WebviewPanel | undefined;

      public show() {
        if (this.panel) {
          this.panel.reveal();
        } else {
          this.panel = vscode.window.createWebviewPanel(
            'copilotChat',
            'Copilot Chat',
            vscode.ViewColumn.One,
            {}
          );

          this.panel.webview.html = this.getHtmlForWebview();
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
        }
    }
    ```

### Conclusion
This specification outlines the structure and setup for a VS Code extension using TypeScript, with linting, formatting, and build/watch commands. Follow the steps to create a robust development environment and implement the core features of the Copilot Chat Participant extension.
