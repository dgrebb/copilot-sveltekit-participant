# Chat Participant Feature Implementation

## Context
The VS Code extension we're building will create a GitHub Copilot Chat Participant that specializes in Svelte and SvelteKit. These rules describe how to implement this specialized chat functionality within our extension.

## Rules for Implementing the Chat Participant

1. **Chat Interface Implementation**:
   - Create a clean, responsive chat interface using WebviewPanel
   - Support markdown rendering in chat messages
   - Implement proper message history storage
   - Provide configuration options for the chat experience

2. **Extension Integration**:
   - Register commands to open and interact with the chat
   - Integrate with VS Code's command palette
   - Handle extension activation/deactivation properly
   - Manage WebviewPanel lifecycle and state

3. **Message Handling**:
   - Implement message sending/receiving between extension and webview
   - Store chat history in ExtensionContext
   - Support code snippets with syntax highlighting
   - Handle error states gracefully
