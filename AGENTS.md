# AGENTS.md - Block Editor Development Guide

## Project Overview

This is a block-based editor built with pure TypeScript and Vite using pnpm workspace. The architecture uses a modular block system with drag-and-drop reordering, rich text editing, and undo/redo functionality.

## Project Structure

```
block-editor/               # Root workspace
├── packages/
│   ├── block-core/        # Core editor logic and blocks
│   │   ├── src/
│   │   │   ├── block.ts        # Base Block interface
│   │   │   ├── events.ts       # EventEmitter for pub/sub
│   │   │   ├── history.ts      # Undo/redo history
│   │   │   ├── index.ts        # BlockEditor class
│   │   │   └── blocks/         # Block implementations
│   │   │       ├── Text.ts
│   │   │       ├── Image.ts
│   │   │       ├── Video.ts
│   │   │       ├── Code.ts
│   │   │       ├── Table.ts
│   │   │       ├── Row.ts
│   │   │       └── Column.ts
│   │   └── __tests__/    # Unit tests
│   └── block-demo/       # Demo application
│       └── src/
├── pnpm-workspace.yaml
├── vitest.config.ts
└── tsconfig.json
```

---

## Build, Lint, and Test Commands

### Development

```bash
pnpm dev      # Start Vite dev server
```

### Build

```bash
pnpm build    # Build all packages
```

### Formatting

```bash
pnpm format   # Format all files with Prettier
```

### Testing

This project uses Vitest for testing. Test files are located in `packages/block-core/__tests__/`.

```bash
pnpm test           # Run all tests in watch mode
pnpm test:run       # Run all tests once
```

---

## Code Style Guidelines

### General Principles

- **Module System**: ESNext modules with `import type` for type-only imports
- **Strict Mode**: TypeScript strict mode is enabled - all type annotations must be explicit
- **No Comments**: Avoid adding comments unless explaining complex business logic

### File Organization (block-core)

```
packages/block-core/src/
├── index.ts          # Main BlockEditor class
├── block.ts          # Base Block interface and abstract class
├── events.ts         # EventEmitter for pub/sub
├── history.ts        # Undo/redo history manager
└── blocks/           # Block implementations
    ├── Text.ts
    ├── Image.ts
    ├── Video.ts
    ├── Code.ts
    ├── Table.ts
    ├── Row.ts
    ├── Column.ts
    └── index.ts
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
| CSS Classes        | kebab-case            | `.block-editor`, `.input`          |

### TypeScript Rules

1. **Always use explicit types** - Do not use `any`, prefer `unknown` when type is uncertain
2. **Use `type` for imports** when importing only types: `import type { Block } from "./block"`
3. **Use `readonly`** for immutable arrays: `readonly Block[]`
4. **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections
5. **Erasable Syntax Only**: Use TypeScript features that can be erased (no enum, no namespace)

### Import Order

1. External libraries
2. Internal modules (`@block-editor/core`)
3. Type imports (`import type`)

```typescript
// Correct order example
import { BlockEditor } from '@block-editor/core';
import type { Block } from '@block-editor/core';
```

### Formatting (Prettier)

The project uses Prettier with these settings (from `.prettierrc.json`):

- Print width: 100 characters
- Tab width: 2 spaces
- Semicolons: always
- Single quotes: yes
- Trailing commas: all
- Arrow functions: always use parentheses

Run `pnpm format` before committing.

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
export type BlockType = 'text' | 'image' | 'video' | 'code' | 'table' | 'row' | 'column';

export interface Block {
  id: string;
  type: BlockType;
  content: string | object;
  styles?: Record<string, string>;
  render(): HTMLElement;
  toJSON(): object;
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
- **ImageBlock**: Image with src, alt, and caption
- **VideoBlock**: Video with controls
- **CodeBlock**: Code with language selector and copy button
- **TableBlock**: Table with editable headers/rows
- **RowBlock**: Horizontal flex container with children
- **ColumnBlock**: Vertical flex container with children

### State Management

- Uses a simple array of `Block[]` for state
- EventEmitter for pub/sub pattern
- History manager for undo/redo

### Features

- Drag-and-drop reordering
- Copy/paste/cut blocks (Ctrl+C/X/V)
- Undo/redo (Ctrl+Z/Shift+Z)
- JSON and Markdown export
- Block selection with visual feedback
