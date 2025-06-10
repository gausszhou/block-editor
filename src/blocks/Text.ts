import { BaseBlock } from "../block";

export class TextBlock extends BaseBlock {
    type: string = 'text';

    private formatStyles(): string {
        return Object.entries(this.styles)
            .map(([key, value]) => `${key}:${value}`)
            .join(';');
    }

    render(){
        const element = document.createElement('span');
        element.dataset.type = 'text';
        element.classList.add('block');
        element.style.cssText = this.formatStyles();
        element.innerHTML = this.content;
        return element
    }
}