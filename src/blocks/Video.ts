import { BaseBlock, type BlockType } from '../block';

export interface VideoContent {
  src: string;
  poster?: string;
  caption?: string;
}

export class VideoBlock extends BaseBlock {
  type: BlockType = 'video';

  constructor(content: VideoContent | string = { src: '' }, styles: Record<string, string> = {}) {
    super(content, styles);
  }

  render(): HTMLElement {
    const element = document.createElement('div');
    element.dataset.type = 'video';
    element.dataset.id = this.id;
    element.classList.add('block', 'block-video');

    const content = this.content as VideoContent;
    const video = document.createElement('video');
    video.src = content.src || '';
    video.poster = content.poster || '';
    video.controls = true;
    video.style.cssText = 'max-width: 100%; height: auto;';

    element.appendChild(video);

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
      placeholder.textContent = 'Click to add video URL';
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
