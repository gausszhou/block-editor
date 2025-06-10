import { BaseBlock, type Block } from '../block';

export class RowBlock extends BaseBlock {
    private children: Block[] = [];

    constructor(children: Block[] = []) {
        super();
        this.children = children;
        this.updateStyle('display', 'flex');
        this.updateStyle('flexDirection', 'row');
        this.updateStyle('gap', '10px');
        this.updateStyle('flex', '1');
    }

    addChild(block: Block): void {
        this.children.push(block);
    }

    removeChild(blockId: string): void {
        this.children = this.children.filter(child => child.id !== blockId);
    }

    render() {
        const childrenHTML = this.children
            .map(child => child.render().outerHTML)
            .join('') || document.createElement('input').outerHTML;

        const element = document.createElement('div');
        element.classList.add('block');
        if (childrenHTML) {
            element.innerHTML = childrenHTML;
        } else {
            element.innerHTML = `<input class="input"></input>`
        }
        element.dataset.type = 'row';
        element.style.cssText = this.formatStyles();
        return element;
    }

    private formatStyles(): string {
        return Object.entries(this.styles)
            .map(([key, value]) => `${key}:${value}`)
            .join(';');
    }
}