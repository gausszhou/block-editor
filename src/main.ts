import './style.css';
import { BlockEditor } from './index';
import { ColumnBlock, RowBlock } from './blocks';
import { TextBlock, ImageBlock, VideoBlock, CodeBlock, TableBlock } from './blocks';

const editor = new BlockEditor('#app');

const textBlock = new TextBlock('Hello, World!', { fontSize: '18px', color: '#333' });
const imageBlock = new ImageBlock({
  src: 'https://via.placeholder.com/400x200',
  alt: 'Placeholder',
  caption: 'Sample image',
});
const videoBlock = new VideoBlock({ src: '', caption: 'Sample video' });
const codeBlock = new CodeBlock({ code: 'console.log("Hello, World!");', language: 'javascript' });
const tableBlock = new TableBlock({
  headers: ['Name', 'Age', 'City'],
  rows: [
    ['John', '30', 'NYC'],
    ['Jane', '25', 'LA'],
  ],
});

const rowBlock = new RowBlock([], { background: '#f9f9f9', padding: '10px' });
rowBlock.addChild(new TextBlock('Left', { flex: '1' }));
rowBlock.addChild(new TextBlock('Right', { flex: '1' }));

const columnBlock = new ColumnBlock();
columnBlock.addChild(rowBlock);
columnBlock.addChild(new TextBlock('Below the row'));

editor.addBlock(textBlock);
editor.addBlock(imageBlock);
editor.addBlock(videoBlock);
editor.addBlock(codeBlock);
editor.addBlock(tableBlock);
editor.addBlock(columnBlock);

editor.on('editor:change', () => {
  console.log('Editor changed');
});

editor.on('block:select', (blockId) => {
  console.log('Block selected:', blockId);
});

editor.render();

(window as unknown as { editor: BlockEditor }).editor = editor;
