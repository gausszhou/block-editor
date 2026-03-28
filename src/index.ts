import type { Block } from './block';
import { EventEmitter, type EditorEventType } from './events';
import { History } from './history';
import './index.css';

export interface BlockEditorConfig {
  maxHistorySize?: number;
}

export class BlockEditor extends EventEmitter {
  private container: HTMLElement;
  private root: HTMLElement;
  private blocks: Block[] = [];
  private selectedBlockId: string | null = null;
  private history: History;
  private clipboard: Block | null = null;
  private draggedElement: HTMLElement | null = null;

  constructor(containerId: string, config: BlockEditorConfig = {}) {
    super();
    this.container = document.querySelector(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with id ${containerId} not found`);
    }
    this.root = document.createElement('div');
    this.root.className = 'block-editor';
    this.container.appendChild(this.root);
    this.history = new History(config.maxHistorySize ?? 50);
    this.initState();
    this.setupEventListeners();
  }

  private initState(): void {
    this.history.push({ blocks: this.blocks });
  }

  private setupEventListeners(): void {
    this.root.addEventListener('click', this.handleClick.bind(this));
    this.root.addEventListener('keydown', this.handleKeydown.bind(this));
    this.root.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.root.addEventListener('dragover', this.handleDragOver.bind(this));
    this.root.addEventListener('drop', this.handleDrop.bind(this));
    this.root.addEventListener('dragend', this.handleDragEnd.bind(this));
  }

  private handleClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const blockElement = target.closest('[data-id]') as HTMLElement | null;
    if (blockElement && blockElement.dataset.id) {
      this.selectBlock(blockElement.dataset.id);
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      e.preventDefault();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      this.copySelectedBlock();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      this.pasteBlock();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
      this.cutSelectedBlock();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedBlockId && !(e.target as HTMLElement).isContentEditable) {
        this.removeBlock(this.selectedBlockId);
        e.preventDefault();
      }
    }
  }

  private handleDragStart(e: DragEvent): void {
    const target = e.target as HTMLElement;
    const blockElement = target.closest('[data-id]') as HTMLElement | null;
    if (blockElement) {
      this.draggedElement = blockElement;
      blockElement.classList.add('dragging');
      e.dataTransfer!.effectAllowed = 'move';
    }
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const blockElement = target.closest('[data-id]') as HTMLElement | null;
    if (blockElement && this.draggedElement && blockElement !== this.draggedElement) {
      blockElement.classList.add('drag-over');
    }
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const dropTarget = target.closest('[data-id]') as HTMLElement | null;
    if (dropTarget && this.draggedElement && dropTarget.dataset.id) {
      const draggedId = this.draggedElement.dataset.id;
      const dropId = dropTarget.dataset.id;
      if (draggedId && dropId) {
        this.moveBlock(draggedId, dropId);
      }
    }
  }

  private handleDragEnd(_e: DragEvent): void {
    if (this.draggedElement) {
      this.draggedElement.classList.remove('dragging');
      this.draggedElement = null;
    }
    this.root.querySelectorAll('.drag-over').forEach((el) => {
      el.classList.remove('drag-over');
    });
  }

  addBlock(block: Block): void {
    this.blocks.push(block);
    this.saveState();
    this.render();
    this.emit('block:add', block);
    this.emit('editor:change');
  }

  insertBlock(block: Block, afterBlockId: string): void {
    const index = this.blocks.findIndex((b) => b.id === afterBlockId);
    if (index !== -1) {
      this.blocks.splice(index + 1, 0, block);
    } else {
      this.blocks.push(block);
    }
    this.saveState();
    this.render();
    this.emit('block:add', block);
    this.emit('editor:change');
  }

  removeBlock(blockId: string): void {
    const block = this.blocks.find((b) => b.id === blockId);
    if (block) {
      this.blocks = this.blocks.filter((b) => b.id !== blockId);
      if (this.selectedBlockId === blockId) {
        this.selectedBlockId = null;
      }
      this.saveState();
      this.render();
      this.emit('block:remove', block);
      this.emit('editor:change');
    }
  }

  moveBlock(blockId: string, afterBlockId: string): void {
    const blockIndex = this.blocks.findIndex((b) => b.id === blockId);
    const targetIndex = this.blocks.findIndex((b) => b.id === afterBlockId);
    if (blockIndex !== -1 && targetIndex !== -1) {
      const [block] = this.blocks.splice(blockIndex, 1);
      this.blocks.splice(targetIndex, 0, block);
      this.saveState();
      this.render();
      this.emit('block:move', { blockId, afterBlockId });
      this.emit('editor:change');
    }
  }

  selectBlock(blockId: string): void {
    this.selectedBlockId = blockId;
    this.root.querySelectorAll('.selected').forEach((el) => {
      el.classList.remove('selected');
    });
    const blockElement = this.root.querySelector(`[data-id="${blockId}"]`) as HTMLElement | null;
    if (blockElement) {
      blockElement.classList.add('selected');
    }
    this.emit('block:select', blockId);
  }

  getSelectedBlock(): Block | null {
    if (!this.selectedBlockId) return null;
    return this.blocks.find((b) => b.id === this.selectedBlockId) || null;
  }

  copySelectedBlock(): void {
    const block = this.getSelectedBlock();
    if (block) {
      this.clipboard = block;
      this.emit('block:copy', block);
    }
  }

  cutSelectedBlock(): void {
    const block = this.getSelectedBlock();
    if (block) {
      this.clipboard = block;
      this.removeBlock(block.id);
      this.emit('block:copy', block);
    }
  }

  pasteBlock(): void {
    if (this.clipboard) {
      this.addBlock(this.clipboard);
      this.emit('block:paste', this.clipboard);
    }
  }

  undo(): void {
    const state = this.history.undo();
    if (state) {
      this.blocks = state.blocks;
      this.render();
      this.emit('history:undo');
      this.emit('editor:change');
    }
  }

  redo(): void {
    const state = this.history.redo();
    if (state) {
      this.blocks = state.blocks;
      this.render();
      this.emit('history:redo');
      this.emit('editor:change');
    }
  }

  canUndo(): boolean {
    return this.history.canUndo();
  }

  canRedo(): boolean {
    return this.history.canRedo();
  }

  private saveState(): void {
    this.history.push({ blocks: this.blocks });
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.style.cssText = 'width: 100%; min-height: 100%;';
    this.blocks.forEach((block) => {
      const blockElement = block.render();
      if (block.id === this.selectedBlockId) {
        blockElement.classList.add('selected');
      }
      blockElement.draggable = true;
      this.root.appendChild(blockElement);
    });
  }

  getState(): Block[] {
    return [...this.blocks];
  }

  exportJSON(): string {
    return JSON.stringify(
      {
        blocks: this.blocks.map((block) => block.toJSON()),
      },
      null,
      2,
    );
  }

  importJSON(json: string): void {
    try {
      const data = JSON.parse(json);
      if (data.blocks && Array.isArray(data.blocks)) {
        this.blocks = [];
        this.history.clear();
        data.blocks.forEach((blockData: unknown) => {
          console.log('Importing block:', blockData);
        });
        this.initState();
        this.render();
        this.emit('editor:change');
      }
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  }

  exportMarkdown(): string {
    return this.blocks.map((block) => this.blockToMarkdown(block)).join('\n\n');
  }

  private blockToMarkdown(block: Block): string {
    switch (block.type) {
      case 'text':
        return block.content as string;
      case 'image':
        const img = block.content as { src: string; alt?: string; caption?: string };
        return `![${img.alt || ''}](${img.src})`;
      case 'video':
        const vid = block.content as { src: string };
        return `[Video](${vid.src})`;
      case 'code':
        const code = block.content as { code: string; language?: string };
        return `\`\`\`${code.language || ''}\n${code.code}\n\`\`\``;
      case 'table':
        const table = block.content as { headers: string[]; rows: string[][] };
        const headerRow = '| ' + table.headers.join(' | ') + ' |';
        const separator = '| ' + table.headers.map(() => '---').join(' | ') + ' |';
        const dataRows = table.rows.map((row) => '| ' + row.join(' | ') + ' |').join('\n');
        return headerRow + '\n' + separator + '\n' + dataRows;
      default:
        return '';
    }
  }

  clear(): void {
    this.blocks = [];
    this.selectedBlockId = null;
    this.history.clear();
    this.initState();
    this.render();
    this.emit('editor:change');
  }
}

export { EventEmitter };
export type { EditorEventType };
