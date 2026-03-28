import { BaseBlock, type BlockType } from '../block';

export interface ImageContent {
  src: string;
  alt?: string;
  caption?: string;
}

export class ImageBlock extends BaseBlock {
  type: BlockType = 'image';

  constructor(
    content: ImageContent | string = { src: '', alt: '' },
    styles: Record<string, string> = {},
  ) {
    super(content, styles);
  }

  render(): HTMLElement {
    const element = document.createElement('div');
    element.dataset.type = 'image';
    element.dataset.id = this.id;
    element.classList.add('block', 'block-image');

    const content = this.content as ImageContent;
    const img = document.createElement('img');
    img.src = content.src || '';
    img.alt = content.alt || '';
    img.style.cssText = 'max-width: 100%; height: auto;';

    element.appendChild(img);

    if (content.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = content.caption;
      caption.contentEditable = 'true';
      caption.style.cssText = 'text-align: center; color: #666; margin-top: 8px;';
      element.appendChild(caption);
    }

    if (!content.src) {
      const placeholder = document.createElement('div');
      placeholder.style.cssText =
        'display: flex; align-items: center; justify-content: center; min-height: 200px; background: #f5f5f5; border: 2px dashed #ccc; cursor: pointer;';
      placeholder.textContent = 'Click to add image URL';
      placeholder.contentEditable = 'true';
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
}
