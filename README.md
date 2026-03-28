# Block Editor

A modern block-based editor built with TypeScript and Vite using pnpm workspace.

## Features

- 🧩 Modular block system
- ✨ Drag-and-drop reordering
- 💅 Customizable styling
- 📝 Rich text editing
- 🔄 Undo/Redo functionality
- 📋 Copy/Paste/Cut support
- 📤 JSON & Markdown export

## Block Types

- **Text**: Basic text content with inline styling
- **Image**: Image with src, alt, and caption
- **Video**: Video with controls
- **Code**: Code with language selector and copy button
- **Table**: Table with editable headers/rows
- **Row**: Horizontal flex container
- **Column**: Vertical flex container

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test:run
```

## Project Structure

```
packages/
├── block-core/     # Core editor library
└── block-demo/    # Demo application
```

## Usage

```typescript
import { BlockEditor, TextBlock, ImageBlock } from '@block-editor/core';

const editor = new BlockEditor('#app');

editor.addBlock(new TextBlock('Hello, World!'));
editor.addBlock(new ImageBlock({ src: 'image.jpg', alt: 'Demo' }));

editor.render();
```
