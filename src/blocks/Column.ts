import { type Block, type BlockType, BaseBlock } from '../block';

export class ColumnBlock extends BaseBlock {
  type: BlockType = 'column';
  private children: Block[] = [];

  constructor(children: Block[] = [], styles: Record<string, string> = {}) {
    super('', {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      flex: '1',
      ...styles,
    });
    this.children = children;
  }

  addChild(block: Block): void {
    this.children.push(block);
  }

  removeChild(blockId: string): void {
    this.children = this.children.filter((child) => child.id !== blockId);
  }

  getChildren(): readonly Block[] {
    return [...this.children];
  }

  render(): HTMLElement {
    const element = document.createElement('div');
    element.dataset.type = 'column';
    element.dataset.id = this.id;
    element.classList.add('block', 'block-column');

    if (this.children.length > 0) {
      this.children.forEach((child) => {
        element.appendChild(child.render());
      });
    } else {
      const placeholder = document.createElement('div');
      placeholder.style.cssText =
        'min-height: 50px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center;';
      placeholder.textContent = 'Empty column';
      element.appendChild(placeholder);
    }

    element.style.cssText = this.formatStyles();
    return element;
  }

  private formatStyles(): string {
    return Object.entries(this.styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      children: this.children.map((child) => child.toJSON()),
    };
  }
}
