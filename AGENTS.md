# AGENTS.md - Block Editor Development Guide

## Project Overview

This is a block-based editor built with pure TypeScript and Vite. The architecture uses a modular block system with drag-and-drop reordering, rich text editing, and undo/redo functionality.

---

## Build, Lint, and Test Commands

### Development

```bash
npm run dev      # Start Vite dev server with hot reload
```

### Build

```bash
npm run build    # Run TypeScript type checking + Vite build
npm run preview  # Preview production build locally
```

### Formatting

```bash
npm run format   # Format all files with Prettier
```

### Type Checking

```bash
npx tsc --noEmit  # Run TypeScript compiler for type checking only
```

### Testing

This project uses Vitest for testing. Test files are located in `tests/`.

```bash
npm run test           # Run all tests in watch mode
npm run test:run       # Run all tests once
npm run test:run tests/blocks.test.ts  # Run single test file
```

---

## Code Style Guidelines

### General Principles

- **Module System**: ESNext modules with `import type` for type-only imports
- **Strict Mode**: TypeScript strict mode is enabled - all type annotations must be explicit
- **No Comments**: Avoid adding comments unless explaining complex business logic

### File Organization

```
src/
├── index.ts          # Main BlockEditor class
├── block.ts          # Base Block interface and abstract class
├── inline.ts         # Inline utilities (currently empty)
├── main.ts           # Entry point / demo
├── style.css         # Global styles
└── blocks/           # Block implementations
    ├── Text.ts
    ├── Row.ts
    └── Column.ts
```

### Naming Conventions

| Element            | Convention            | Example                            |
| ------------------ | --------------------- | ---------------------------------- |
| Files              | PascalCase            | `BlockEditor.ts`, `ColumnBlock.ts` |
| Classes            | PascalCase            | `class RowBlock`                   |
| Interfaces         | PascalCase            | `interface Block`                  |
| Methods/Properties | camelCase             | `addChild()`, `removeBlock()`      |
| Private members    | Prefix with `private` | `private blocks: Block[]`          |
| Constants          | PascalCase            | `const DefaultStyles`              |
| CSS Classes        | kebab-case            | `block-editor`, `.input`           |

### TypeScript Rules

1. **Always use explicit types** - Do not use `any`, prefer `unknown` when type is uncertain
2. **Use `type` for imports** when importing only types: `import type { Block } from "./block"`
3. **Use `readonly`** for immutable arrays: `readonly Block[]`
4. **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections
5. **Erasable Syntax Only**: Use TypeScript features that can be erased (no enum, no namespace)

### Import Order

1. External libraries (React, etc.)
2. Internal modules (`../block`, `./blocks/Text`)
3. Type imports (`import type`)
4. CSS imports (`import './style.css'`)

```typescript
// Correct order example
import React from 'react';
import { BaseBlock, type Block } from '../block';
import { TextBlock } from './blocks/Text';
import './style.css';
```

### Formatting (Prettier)

The project uses Prettier with these settings (from `.prettierrc.json`):

- Print width: 100 characters
- Tab width: 2 spaces
- Semicolons: always
- Single quotes: yes
- Trailing commas: all
- Arrow functions: always use parentheses

Run `npm run format` before committing.

### Error Handling

- Use explicit error messages: `throw new Error(\`Container element with id \${containerId} not found\`)`
- Validate inputs at constructor/entry points
- Use try-catch for async operations
- Return safe defaults when possible rather than throwing

### HTML/DOM Patterns

- Use `document.createElement()` for creating elements
- Use `dataset` for storing element type: `element.dataset.type = 'text'`
- Use `classList.add()` / `classList.remove()` for CSS classes
- Use `style.cssText` for bulk style assignments

### Block System Architecture

All blocks must implement the `Block` interface:

```typescript
export interface Block {
  id: string;
  type: string;
  render(): HTMLElement;
}
```

Extend `BaseBlock` for common functionality (id generation, content/style management, serialization).

### CSS Guidelines

- Use kebab-case class names: `.block-editor`, `.input-field`
- Use CSS custom properties for theming
- Keep styles in `style.css` or use inline styles via `style.cssText` for dynamic styles

---

## Project-Specific Notes

### Current Block Types

- **TextBlock**: Basic text content with inline styling
- **RowBlock**: Horizontal flex container with children
- **ColumnBlock**: Vertical flex container with children

### State Management

- Uses a simple array of `Block[]` for state
- No external state management library (consider signals if complexity grows)

### Future Considerations

When expanding the project:

- Add ESLint for additional linting rules
- Add Vitest for unit testing
- Consider adding VS Code extensions config in `.vscode/`
- Document block plugin system when implementing
