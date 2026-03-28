import { BaseBlock, type BlockType } from '../block';

export class TextBlock extends BaseBlock {
  type: BlockType = 'text';

  constructor(content: string = '', styles: Record<string, string> = {}) {
    super(content, styles);
  }

  render(): HTMLElement {
    const element = document.createElement('span');
    element.dataset.type = 'text';
    element.dataset.id = this.id;
    element.classList.add('block', 'block-text');
    element.contentEditable = 'true';
    element.draggable = true;
    element.style.cssText = this.formatStyles();
    element.textContent = this.content as string;
    return element;
  }

  private formatStyles(): string {
    return Object.entries(this.styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  }
}
