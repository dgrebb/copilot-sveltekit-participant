# GitHub Copilot Chat Participant - Svelte & SvelteKit Expert

## Overview

This document defines the specifications for the **GitHub Copilot Chat Participant**, a **Visual Studio Code extension** that provides expert assistance for **Svelte** and **SvelteKit**.

This Chat Participant is **not part of a Svelte or SvelteKit project itself**—instead, it **helps developers working on Svelte/SvelteKit applications** by providing high-quality coding suggestions, best practices, and debugging insights.

## Features

### 1. Svelte & SvelteKit Expertise
- Ingests the official **Svelte [LLMs.txt](https://svelte.dev/llms-full.txt) file** before responding to user input.
- Uses only **Svelte and SvelteKit documentation** as reference sources (avoids external AI-generated content).
- Provides **guidance on best practices**, including **reactivity, stores, SSR, and routing**.

### 2. Code Suggestions & Best Practices
- Generates solutions that are **elegant, efficient, and idiomatic** to Svelte.
- Provides **well-structured** TypeScript solutions with:
  - **Strict type definitions**
  - **Comprehensive JSDoc comments**
  - **Error handling**
  - **VS Code API best practices**
  - **Unit tests (Jest)**
- Ensures **modular, maintainable code** by using dependency injection when applicable.

### 3. Version Compatibility Assistance
- Detects **Svelte 4 vs. Svelte 5** differences and warns users if they mix incompatible APIs.
- Provides **upgrade guidance** for migrating **from Svelte 4 to Svelte 5**.
- Suggests **modern alternatives** to deprecated APIs.

### 4. Vite Configuration Guidance
- Offers **Vite optimization suggestions** related to:
  - **Performance tuning** (e.g., prebundling, tree-shaking).
  - **SvelteKit SSR configuration**.
  - **Developer experience enhancements** (e.g., fast refresh, aliasing).
- Detects **misconfigurations** and suggests corrections.

## Implementation Guidelines

### Code Standards
- **This is a VS Code extension**—all code follows **VS Code extension API best practices**.
- **TypeScript with strict mode enabled**.
- **ESLint + Prettier** for formatting and linting.
- **Follow JSDoc documentation standards**.
- **Async/await for asynchronous operations** (no direct Promises).
- **Unit tests with Jest**.

### Development Principles
1. **Simplicity First** – Start with the simplest solution, refactor if necessary.
2. **Follow VS Code API Best Practices** – Use built-in APIs over custom implementations.
3. **Error Handling & Logging** – Provide meaningful messages and log errors properly.
4. **Maintain Testability** – Design code that supports Jest-based testing.

### Architecture (VS Code Extension Specific)
- **Command Pattern**: Register commands in `extension.ts`, implement them in `commands/`.
- **Webview Pattern**: UI components implemented using `WebviewPanel`.
- **State Management**: Use `ExtensionContext` for persistent data.
- **Dependency Injection**: Improve testability and modularity.
- **Cleanup & Disposal**: Ensure proper resource management using `context.subscriptions`.

## Avoid
- **Ignoring Error Handling** – Always catch and log errors.
- **Tightly Coupled Components** – Keep modules independent.
- **Synchronous File Operations** – Prefer VS Code’s async file API.
- **Overengineering** – Keep solutions straightforward.

## Testing Strategy
- **Unit tests** for utilities and business logic.
- **Integration tests** for command execution.
- **Mock VS Code API** to ensure isolated testing.

## Documentation
- **JSDoc for all public APIs**.
- **Examples included in function documentation**.
- **CHANGELOG updates** for user-facing changes.

## Common Pitfalls & Solutions
| Pitfall | Solution |
|---------|----------|
| Forgetting to clean up WebviewPanels | Always dispose of panels when closed |
| Ignoring Vite optimizations | Suggest appropriate plugins and configurations |
| Using synchronous file operations | Use VS Code’s async `fs` API |
| Mixing Svelte 4 and Svelte 5 APIs | Detect and guide migration paths |

---

This specification ensures that the **GitHub Copilot Chat Participant** aligns with **VS Code extension best practices** while delivering **specialized guidance for Svelte/SvelteKit developers**. 🚀
