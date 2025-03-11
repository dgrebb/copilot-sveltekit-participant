# Svelte & SvelteKit Expert for VS Code

A specialized GitHub Copilot Chat participant (dgrebb.copilot-participant-svelte) that provides expert assistance for Svelte and SvelteKit development.

## Features

- **Svelte & SvelteKit Expertise**
  - Powered by official Svelte documentation ([LLMs.txt](https://svelte.dev/llms-full.txt))
  - Guidance on Svelte best practices (reactivity, stores, SSR, routing)
  - Code suggestions that follow Svelte idioms and patterns

- **Version Compatibility**
  - Identifies differences between Svelte 4 and Svelte 5 APIs
  - Provides upgrade guidance for migrating from Svelte 4 to Svelte 5
  - Suggests modern alternatives to deprecated patterns

- **Vite Configuration Assistance**
  - Performance tuning recommendations
  - SvelteKit SSR configuration help
  - Development experience optimizations

- **Code Quality Recommendations**
  - TypeScript best practices
  - Proper error handling patterns
  - Component architecture suggestions

## Installation

1. Install the extension from the VS Code Marketplace
2. Open a Svelte or SvelteKit project
3. Access the participant through GitHub Copilot Chat

## Usage

1. Open GitHub Copilot Chat in VS Code
2. Type `@svelte` to activate this participant
3. Ask questions about Svelte/SvelteKit development

### Example Queries

- "How do I implement a reactive store in Svelte?"
- "What's the best approach for SSR data loading in SvelteKit?"
- "Help me optimize my Vite configuration for SvelteKit"
- "What are the key differences between Svelte 4 and 5?"

## Requirements

- VS Code 1.98.0 or higher
- GitHub Copilot subscription

## Extension Settings

This extension contributes the following settings:

* `copilotParticipantSvelte.enableDetailedExplanations`: Enable/disable detailed explanations in responses
* `copilotParticipantSvelte.preferredSvelteVersion`: Set your preferred Svelte version (4 or 5)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is licensed under the MIT License.

### Context and Reference Support

The Svelte Expert understands VS Code's context features:

- File references: `#file:FileName.svelte` - Analyze a specific file
- Selection references: `#selection:` - Analyze selected code
- Multiple references: Ask about multiple files or selections in one prompt

The extension provides Svelte-specific analysis of your code based on the context.
