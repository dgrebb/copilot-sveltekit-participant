Sure! Here are the `code-style.md` and `copilot-instructions.md` files, along with the `.vscode` directory configuration.

### `code-style.md`

# Code Style Guide

This guide outlines the coding standards and best practices for the Copilot Chat Participant VS Code extension project.

## General Guidelines

- **Use TypeScript** for all development.
- **Follow ESLint rules** to maintain code quality.
- **Use Prettier** for consistent code formatting.
- **Write unit tests** using Jest.

## Naming Conventions

- **Files and Directories**: Use kebab-case (e.g., `open-chat.ts`).
- **Classes**: Use PascalCase (e.g., `ChatView`).
- **Variables and Functions**: Use camelCase (e.g., `openChat`).

## Code Structure

- **Keep functions small** and focused on a single task.
- **Use descriptive names** for variables and functions.
- **Avoid magic numbers**; use constants instead.
- **Comment your code** where necessary, especially for complex logic.

## TypeScript Specifics

- **Enable strict mode** in TypeScript.
- **Use interfaces** for type definitions.
- **Prefer `const`** over `let` for variables that don't change.
- **Use `async/await`** for asynchronous code.

## ESLint Configuration

- **Use `@typescript-eslint/parser`** as the parser.
- **Extend recommended rules** from ESLint and TypeScript.
- **Integrate Prettier** with ESLint.

## Prettier Configuration

- **Single quotes** for strings.
- **No semicolons**.
- **Trailing commas** where valid in ES5 (objects, arrays, etc.).

## Testing

- **Write tests** for all functions and classes.
- **Use Jest** as the testing framework.
- **Organize tests** in a `test` directory mirroring the `src` structure.
