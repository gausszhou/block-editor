import type { Block } from "./block";

export class BlockEditor {
  private container: HTMLElement;
  private root: HTMLElement;
  private blocks: Block[] = [];

  constructor(containerId: string) {
    this.container = document.querySelector(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with id ${containerId} not found`);
    }
    this.root = document.createElement('div'); // 创建一个根元素，用于包裹所有块
    this.root.className = 'block-editor'; // 添加一个类名，用于样式化
    this.container.appendChild(this.root); // 将根元素添加到容器中
    
  }

  // 添加新块
  addBlock(block: Block): void {
    this.blocks.push(block);
    this.render();
  }

  // 删除块
  removeBlock(blockId: string): void {
    this.blocks = this.blocks.filter(block => block.id !== blockId);
    this.render();
  }

  // 渲染所有块
  render(): void {
    this.root.innerHTML = '';
    this.root.style.width = '100%'; // 设置容器宽度为100%
    this.root.style.height = '100%'; // 设置容器高度为100%
    // 渲染每个块并添加到容器中，注意这里使用了 data-id 来标识每个块的唯一标识，便于后续操作和删除
    // 同时，为了方便编辑，我们使用 contentEditable 来使容器可编辑，便于添加新的块
    this.blocks.forEach(block => {
      const blockElement = block.render();
      this.root.appendChild(blockElement);
    });
  }

  // 获取当前所有块数据
  getState(): Block[] {
    return [...this.blocks];
  }
}

