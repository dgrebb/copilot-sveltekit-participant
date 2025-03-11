# Svelte & SvelteKit Expert - AI Assistant Specification

## Current Implementation

### Core Functionality
- ✅ Base prompt engineering for accurate Svelte/SvelteKit expertise
- ✅ Conversation context preservation
- ✅ Conditional resources display
- ✅ File analysis with #file: references
- ✅ Selection analysis with #selection: references
- ✅ Svelte component analysis (props, events, stores, imports, exports)
- ✅ SvelteKit project structure analysis

### VS Code Integration
- ✅ Chat participant registration with proper naming conventions
- ✅ Custom commands (/analyze, /help)
- ✅ Basic file system access for workspace analysis
- ✅ Ability to open and analyze specific files

## Next Steps

### Improve Copilot Command Integration
- [ ] Add support for #codebase command to analyze project structure
- [ ] Implement @Folders syntax for targeted directory exploration
- [ ] Support #symbol: references to analyze specific symbols or functions
- [ ] Handle #position: references for cursor-based analysis

### Enhance Analysis Capabilities
- [ ] SvelteKit route analysis to understand app structure
- [ ] Vite configuration analysis for build optimization
- [ ] Component dependency graph for refactoring guidance
- [ ] Performance recommendations based on component structure

### Testing & Quality Assurance
- [ ] Create test fixtures with sample Svelte components
- [ ] Add automated tests for filesystem integration
- [ ] Test with both Svelte 4 and Svelte 5 projects
- [ ] Measure response quality with different prompt formulations

### Documentation & User Experience
- [ ] More detailed examples in README.md
- [ ] Tutorial walkthrough of key features
- [ ] Screenshots/GIFs of the extension in action
- [ ] Publishing checklist for VS Code Marketplace

## Implementation Notes

### File System Integration
Use VS Code's API to better handle file references:
- For workspace scanning: `vscode.workspace.findFiles()`
- For reading files: `vscode.workspace.fs.readFile()`
- For handling references: Implement handlers for #file:, #selection:, etc.

### Copilot Command Research
Research VS Code Copilot's native handlers for commands like:
- #codebase - May have built-in functionality in newer VS Code versions
- @Folders - Might be handled at the Copilot Chat level before reaching our extension

Investigate the `ChatRequestContext` interface in the VS Code API to see if there's a standardized way to access these contexts when they're provided by Copilot.

### Analysis Improvements
Enhance component analysis to:
- Detect reactive statements ($: syntax)
- Identify accessibility issues
- Suggest optimizations for reactivity
- Detect common anti-patterns

## Technical Design

The extension follows a modular architecture:
- **extension.ts**: Main entry point, chat participant registration
- **utils/svelteComponentAnalyzer.ts**: Component parsing and analysis
- **commands/**: Implementation of slash commands
- **views/**: UI-related code for displaying information

When enhancing file system integration, maintain this separation to keep the codebase maintainable.

## Project Overview
This VS Code extension creates a specialized GitHub Copilot Chat Participant that provides expert assistance for Svelte and SvelteKit development. The extension itself is built with TypeScript and VS Code's extension API.

## Project Specifications:
- TypeScript-based VS Code extension with strict typing
- Chat interface using VS Code's WebviewPanel API
- Command palette integration to open the chat
- Message history persistence using ExtensionContext
- SvelteKit context-awareness for improved assistance

## Development Requirements:
1. Use TypeScript with comprehensive JSDoc comments
2. Follow a modular architecture (commands/, views/, utils/)
3. Implement proper error handling and testing
4. Maintain clear separation of concerns
5. Use async/await for asynchronous operations
6. Ensure all disposables are properly managed

## Current State:
- Project structure and configuration files are set up
- AI/LLM instruction files are in place (.vscode/ and .cursor/rules/)
- Basic scaffolding for the extension is implemented
- Build configuration is ready (but needs standardization)
- GitHub Copilot and Cursor AI custom instruction rules are defined

## Immediate Tasks:
1. Implement the core ChatParticipant class that integrates with GitHub Copilot
2. Create a UI for the chat interface using WebviewPanel
3. Implement message history storage and retrieval with ExtensionContext
4. Build a command registration system following the Command Pattern
5. Implement proper error handling and logging throughout
6. Ensure the participant can access standard Copilot context commands
7. Create configuration options for the chat experience
8. Standardize on either webpack or esbuild (not both)
9. Add unit tests for core functionality
10. Document the extension with JSDoc comments

## Features to Implement

### 1. Svelte & SvelteKit Expertise
- Ingest the official Svelte [LLMs.txt](https://svelte.dev/llms-full.txt) file before responding to user input
- Reference only official Svelte and SvelteKit documentation
- Provide guidance on best practices for reactivity, stores, SSR, and routing

### 2. Code Suggestions & Best Practices
- Generate solutions that are elegant, efficient, and idiomatic to Svelte
- Provide well-structured TypeScript solutions with strict type definitions
- Include comprehensive JSDoc comments in generated code
- Implement proper error handling in examples

### 3. Version Compatibility Assistance
- Detect Svelte 4 vs. Svelte 5 differences
- Warn when mixing incompatible APIs
- Provide upgrade guidance for migrating from Svelte 4 to Svelte 5
- Suggest modern alternatives to deprecated APIs

### 4. Vite Configuration Guidance
- Offer Vite optimization suggestions for Svelte/SvelteKit projects
- Provide SvelteKit SSR configuration guidance
- Suggest developer experience enhancements
- Detect misconfigurations and suggest corrections

## Implementation Guidelines

### Code Standards
- Use TypeScript with strict mode enabled
- Follow VS Code extension API best practices
- Use ESLint + Prettier for formatting and linting
- Document with JSDoc standards
- Use async/await for asynchronous operations
- Write unit tests with Jest

### Development Principles
1. **Simplicity First** – Start with the simplest solution, refactor if necessary
2. **Follow VS Code API Best Practices** – Use built-in APIs over custom implementations
3. **Error Handling & Logging** – Provide meaningful messages and log errors properly
4. **Maintain Testability** – Design code that supports Jest-based testing

### Architecture (VS Code Extension Specific)
- **Command Pattern**: Register commands in `extension.ts`, implement them in `commands/`
- **Webview Pattern**: UI components implemented using `WebviewPanel`
- **State Management**: Use `ExtensionContext` for persistent data
- **Dependency Injection**: Improve testability and modularity
- **Cleanup & Disposal**: Ensure proper resource management using `context.subscriptions`

## Patterns to use:
- Command registration pattern using vscode.commands.registerCommand
- Webview panels for UI components
- Context for state management
- Disposables for cleanup

## Avoid:
- Any code that doesn't handle errors
- Synchronous file operations
- Tight coupling between components
- Overengineering simple solutions

## Testing Strategy
- **Unit tests** for utilities and business logic
- **Integration tests** for command execution
- **Mock VS Code API** to ensure isolated testing

## Documentation
- **JSDoc for all public APIs**
- **Examples included in function documentation**
- **CHANGELOG updates** for user-facing changes

## Common Pitfalls & Solutions
| Pitfall | Solution |
|---------|----------|
| Forgetting to clean up WebviewPanels | Always dispose of panels when closed |
| Ignoring Vite optimizations | Suggest appropriate plugins and configurations |
| Using synchronous file operations | Use VS Code's async `fs` API |
| Mixing Svelte 4 and Svelte 5 APIs | Detect and guide migration paths |
