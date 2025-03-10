# VS Code Extension for Copilot Chat - Svelte/SvelteKit Participant

## Context
This repository contains a VS Code extension that creates a specialized GitHub Copilot Chat Participant. The extension itself is built with TypeScript and VS Code APIs. The resulting Chat Participant will provide expert assistance for Svelte and SvelteKit development.

## Rules for Building the Extension

1. **VS Code Extension Development**:
   - Use TypeScript with strict typing for the extension code
   - Follow VS Code extension API best practices
   - Ensure proper extension lifecycle management
   - Use WebviewPanel for UI components

2. **Code Quality Requirements**:
   - Include comprehensive JSDoc comments in the extension code
   - Implement proper error handling throughout the extension
   - Write modular, maintainable extension code
   - Design for testability with Jest

3. **VS Code Extension Patterns**:
   - Use the Command Pattern for registering and implementing commands
   - Implement UI with WebviewPanel for the chat interface
   - Use ExtensionContext for state management
   - Register all disposables with context.subscriptions
   - Use dependency injection for testability

4. **Avoid in Extension Code**:
   - Synchronous file operations (use VS Code's async fs API)
   - Tightly coupled components
   - Missing error handling
   - Overengineered solutions

5. **Extension Architecture**:
   - Commands in `commands/` directory
   - UI components in `views/` directory
   - Utility functions in `utils/` directory
   - Use async/await for asynchronous operations
