import './style.css';
import { BlockEditor } from './index';
import { ColumnBlock } from './blocks/Column';
import { RowBlock } from './blocks/Row';
import { TextBlock } from './blocks/Text';

// 初始化编辑器
const editor = new BlockEditor('#app');

const columnBlock1 = new ColumnBlock();
const columnBlock2 = new ColumnBlock();
const columnBlock3 = new ColumnBlock();

const rowBlock1 = new RowBlock();
const rowBlock2 = new RowBlock();
const rowBlock3 = new RowBlock();

rowBlock1.addChild(new ColumnBlock());
rowBlock1.addChild(new ColumnBlock());
rowBlock1.addChild(new ColumnBlock());

columnBlock1.addChild(rowBlock1);
columnBlock1.addChild(rowBlock2);
columnBlock1.addChild(rowBlock3);

editor.addBlock(columnBlock1);
editor.addBlock(columnBlock2);
editor.addBlock(columnBlock3);

editor.render();