# Svelte & SvelteKit Expert for VS Code

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/dgrebb.copilot-participant-svelte)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/dgrebb.copilot-participant-svelte)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/dgrebb.copilot-participant-svelte)
![GitHub License](https://img.shields.io/github/license/dgrebb/copilot-participant-svelte)

> A specialized GitHub Copilot Chat participant that provides expert assistance for Svelte and SvelteKit development.

![Svelte Expert Demo](https://raw.githubusercontent.com/dgrebb/copilot-participant-svelte/main/src/resources/svelte-logo.png)

## Overview

Supercharge your Svelte and SvelteKit development experience with this specialized GitHub Copilot participant. Get intelligent, context-aware assistance tailored specifically to Svelte's unique approach to building user interfaces.

This extension adds a dedicated "Svelte & SvelteKit Expert" participant to your GitHub Copilot Chat, allowing you to get specialized help with:

- Svelte component architecture
- SvelteKit routing and server-side rendering
- Reactive declarations and stores
- Svelte 4 to Svelte 5 migration
- Performance optimization
- TypeScript integration
- And much more!

## Features

### 🧩 Svelte & SvelteKit Expertise

- **Deep Svelte Knowledge**: Powered by official Svelte documentation ([LLMs.txt](https://svelte.dev/llms-full.txt))
- **Best Practices**: Get guidance on reactivity, stores, SSR, routing, and more
- **Idiomatic Code**: Suggestions follow Svelte patterns and idioms
- **Project Analysis**: Analyze your current component or entire SvelteKit project

### 🔄 Version Compatibility

- **Version Awareness**: Identifies differences between Svelte 4 and Svelte 5 APIs
- **Migration Assistance**: Guidance for upgrading from Svelte 4 to Svelte 5
- **Modern Patterns**: Suggests alternatives to deprecated approaches

### ⚡ Vite Configuration Help

- **Performance Tuning**: Get recommendations for faster builds
- **SSR Configuration**: Optimize server-side rendering in SvelteKit
- **Dev Experience**: Improve your local development environment

### 🧪 Code Quality Enhancement

- **TypeScript Integration**: Best practices for type safety in Svelte
- **Error Handling**: Proper patterns for managing errors
- **Component Architecture**: Suggestions for maintainable component design

## Installation

1. Ensure you have [VS Code](https://code.visualstudio.com/) 1.98.0 or higher
2. Make sure you have an active [GitHub Copilot](https://github.com/features/copilot) subscription
3. Install this extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dgrebb.copilot-participant-svelte)
4. Open a Svelte or SvelteKit project
5. Access the participant through GitHub Copilot Chat

## Usage

1. Open GitHub Copilot Chat in VS Code (Ctrl+Shift+I or Cmd+Shift+I)
2. Type `@svelte` to activate this participant
3. Ask your Svelte or SvelteKit related questions

You can also use the following commands:

- `@svelte analyze` - Analyze the current Svelte component or project
- `@svelte help` - Get general help with Svelte concepts

### Context-Aware Assistance

The Svelte Expert understands VS Code's context features:

- **File references**: `#file:FileName.svelte` - Analyze a specific file
- **Selection references**: `#selection:` - Analyze selected code
- **Multiple references**: Ask about multiple files or selections in one prompt

### Example Queries

```
@svelte How do I implement a reactive store in Svelte?

@svelte What's the best approach for SSR data loading in SvelteKit?

@svelte Help me optimize my Vite configuration for SvelteKit

@svelte What are the key differences between Svelte 4 and 5?

@svelte analyze #file:MyComponent.svelte

@svelte Refactor this component to use Svelte 5 runes #selection:
```

## Extension Settings

This extension contributes the following settings:

* `copilotParticipantSvelte.enableDetailedExplanations`: Enable/disable detailed explanations in responses
* `copilotParticipantSvelte.preferredSvelteVersion`: Set your preferred Svelte version (4 or 5)

## Requirements

- VS Code 1.98.0 or higher
- GitHub Copilot subscription

## Known Issues

Please report any issues on the [GitHub repository](https://github.com/dgrebb/copilot-participant-svelte/issues).

## Release Notes

### 0.0.1

- Initial release
- Svelte & SvelteKit Expert chat participant
- Context-aware Svelte component analysis
- Version-specific guidance for Svelte 4 and 5

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request on our [GitHub repository](https://github.com/dgrebb/copilot-participant-svelte).

## License

This extension is licensed under the MIT License.
