import { describe, it, expect, beforeEach } from 'vitest';
import {
  TextBlock,
  ImageBlock,
  VideoBlock,
  CodeBlock,
  TableBlock,
  RowBlock,
  ColumnBlock,
} from '../src/blocks';
import type { ImageContent, VideoContent, CodeContent, TableContent } from '../src/blocks';

describe('TextBlock', () => {
  let textBlock: TextBlock;

  beforeEach(() => {
    textBlock = new TextBlock('Hello World', { fontSize: '16px', color: '#333' });
  });

  it('should create text block with correct type', () => {
    expect(textBlock.type).toBe('text');
  });

  it('should have id generated', () => {
    expect(textBlock.id).toMatch(/^block-/);
  });

  it('should render as span with contentEditable', () => {
    const element = textBlock.render();
    expect(element.tagName).toBe('SPAN');
    expect(element.dataset.type).toBe('text');
    expect(element.contentEditable).toBe('true');
    expect(element.textContent).toBe('Hello World');
  });

  it('should apply styles correctly', () => {
    const element = textBlock.render();
    expect(element.style.cssText).toContain('fontSize: 16px');
    expect(element.style.cssText).toContain('color:');
  });

  it('should update content', () => {
    textBlock.updateContent('New Content');
    const element = textBlock.render();
    expect(element.textContent).toBe('New Content');
  });
});

describe('ImageBlock', () => {
  let imageBlock: ImageBlock;

  beforeEach(() => {
    const content: ImageContent = {
      src: 'https://example.com/image.jpg',
      alt: 'Test Image',
      caption: 'Test Caption',
    };
    imageBlock = new ImageBlock(content);
  });

  it('should create image block with correct type', () => {
    expect(imageBlock.type).toBe('image');
  });

  it('should render image with src and alt', () => {
    const element = imageBlock.render();
    const img = element.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.src).toBe('https://example.com/image.jpg');
    expect(img?.alt).toBe('Test Image');
  });

  it('should render caption when provided', () => {
    const element = imageBlock.render();
    const figcaption = element.querySelector('figcaption');
    expect(figcaption).not.toBeNull();
    expect(figcaption?.textContent).toBe('Test Caption');
  });

  it('should render placeholder when no src', () => {
    const emptyBlock = new ImageBlock({ src: '' });
    const element = emptyBlock.render();
    const placeholder = element.querySelector('div[style*="border"]');
    expect(placeholder).not.toBeNull();
    expect(placeholder?.textContent).toContain('Click to add image URL');
  });
});

describe('VideoBlock', () => {
  let videoBlock: VideoBlock;

  beforeEach(() => {
    const content: VideoContent = {
      src: 'https://example.com/video.mp4',
      poster: 'https://example.com/poster.jpg',
      caption: 'Test Video',
    };
    videoBlock = new VideoBlock(content);
  });

  it('should create video block with correct type', () => {
    expect(videoBlock.type).toBe('video');
  });

  it('should render video element with controls', () => {
    const element = videoBlock.render();
    const video = element.querySelector('video');
    expect(video).not.toBeNull();
    expect(video?.src).toBe('https://example.com/video.mp4');
    expect(video?.poster).toBe('https://example.com/poster.jpg');
    expect(video?.controls).toBe(true);
  });
});

describe('CodeBlock', () => {
  let codeBlock: CodeBlock;

  beforeEach(() => {
    const content: CodeContent = {
      code: 'console.log("test")',
      language: 'javascript',
    };
    codeBlock = new CodeBlock(content);
  });

  it('should create code block with correct type', () => {
    expect(codeBlock.type).toBe('code');
  });

  it('should render with language selector and copy button', () => {
    const element = codeBlock.render();
    const select = element.querySelector('select');
    const button = element.querySelector('button');
    expect(select).not.toBeNull();
    expect(button).not.toBeNull();
    expect(button?.textContent).toBe('Copy');
  });

  it('should render code content', () => {
    const element = codeBlock.render();
    const code = element.querySelector('code');
    expect(code?.textContent).toBe('console.log("test")');
  });
});

describe('TableBlock', () => {
  let tableBlock: TableBlock;

  beforeEach(() => {
    const content: TableContent = {
      headers: ['Name', 'Age'],
      rows: [
        ['John', '30'],
        ['Jane', '25'],
      ],
    };
    tableBlock = new TableBlock(content);
  });

  it('should create table block with correct type', () => {
    expect(tableBlock.type).toBe('table');
  });

  it('should render table with headers and rows', () => {
    const element = tableBlock.render();
    const headers = element.querySelectorAll('th');
    const cells = element.querySelectorAll('td');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toBe('Name');
    expect(headers[1].textContent).toBe('Age');
    expect(cells.length).toBe(4);
  });

  it('should have add row and column buttons', () => {
    const element = tableBlock.render();
    const buttons = element.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('+ Row');
    expect(buttons[1].textContent).toBe('+ Column');
  });
});

describe('RowBlock', () => {
  let rowBlock: RowBlock;

  beforeEach(() => {
    rowBlock = new RowBlock();
  });

  it('should create row block with correct type', () => {
    expect(rowBlock.type).toBe('row');
  });

  it('should add and remove children', () => {
    const textBlock = new TextBlock('Test');
    rowBlock.addChild(textBlock);
    expect(rowBlock.getChildren().length).toBe(1);

    rowBlock.removeChild(textBlock.id);
    expect(rowBlock.getChildren().length).toBe(0);
  });

  it('should render children', () => {
    const child1 = new TextBlock('Child 1');
    const child2 = new TextBlock('Child 2');
    rowBlock.addChild(child1);
    rowBlock.addChild(child2);

    const element = rowBlock.render();
    expect(element.children.length).toBe(2);
  });

  it('should render placeholder when empty', () => {
    const element = rowBlock.render();
    expect(element.textContent).toContain('Empty row');
  });
});

describe('ColumnBlock', () => {
  let columnBlock: ColumnBlock;

  beforeEach(() => {
    columnBlock = new ColumnBlock();
  });

  it('should create column block with correct type', () => {
    expect(columnBlock.type).toBe('column');
  });

  it('should add and remove children', () => {
    const textBlock = new TextBlock('Test');
    columnBlock.addChild(textBlock);
    expect(columnBlock.getChildren().length).toBe(1);

    columnBlock.removeChild(textBlock.id);
    expect(columnBlock.getChildren().length).toBe(0);
  });

  it('should render placeholder when empty', () => {
    const element = columnBlock.render();
    expect(element.textContent).toContain('Empty column');
  });
});
