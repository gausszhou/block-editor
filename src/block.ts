export type BlockType = 'text' | 'image' | 'video' | 'code' | 'table' | 'row' | 'column';

export interface Block {
  id: string;
  type: BlockType;
  content: string | object;
  styles?: Record<string, string>;
  render(): HTMLElement;
  toJSON(): object;
}

export abstract class BaseBlock implements Block {
  type: BlockType = 'text';
  readonly id: string;
  content: string | object;
  styles: Record<string, string>;

  constructor(content: string | object = '', styles: Record<string, string> = {}) {
    this.id = this.generateId();
    this.content = content;
    this.styles = styles;
  }

  private generateId(): string {
    return 'block-' + Math.random().toString(36).substring(2, 9);
  }

  updateContent(newContent: string | object): void {
    this.content = newContent;
  }

  updateStyle(property: string, value: string): void {
    this.styles[property] = value;
  }

  getStyles(): Record<string, string> {
    return { ...this.styles };
  }

  abstract render(): HTMLElement;

  toJSON(): object {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      styles: this.styles,
    };
  }
}
