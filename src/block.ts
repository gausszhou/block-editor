export interface Block {
    id: string;
    type: string;
    render(): HTMLElement;
}

export abstract class BaseBlock implements Block {
    type: string = 'base';
    readonly id: string;
    protected content: string;
    protected styles: Record<string, string>;

    constructor(content: string = '', styles: Record<string, string> = {}) {
        this.id = this.generateId();
        this.content = content;
        this.styles = styles;
    }

    // 生成唯一ID
    private generateId(): string {
        return 'block-' + Math.random().toString(36).substring(2, 9);
    }

    // 更新内容
    updateContent(newContent: string): void {
        this.content = newContent;
    }

    // 更新样式
    updateStyle(property: string, value: string): void {
        this.styles[property] = value;
    }

    // 渲染HTML
    abstract render(): HTMLElement;

    // 序列化为JSON
    toJSON(): object {
        return {
            id: this.id,
            content: this.content,
            styles: this.styles
        };
    }
}