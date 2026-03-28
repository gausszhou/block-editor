import { BaseBlock, type BlockType } from '../block';

export interface TableContent {
  headers: string[];
  rows: string[][];
}

export class TableBlock extends BaseBlock {
  type: BlockType = 'table';

  constructor(
    content: TableContent | string = {
      headers: ['Header 1', 'Header 2'],
      rows: [['Cell 1', 'Cell 2']],
    },
    styles: Record<string, string> = {},
  ) {
    super(content, styles);
  }

  render(): HTMLElement {
    const element = document.createElement('div');
    element.dataset.type = 'table';
    element.dataset.id = this.id;
    element.classList.add('block', 'block-table');

    const content = this.content as TableContent;

    const table = document.createElement('table');
    table.style.cssText = 'width: 100%; border-collapse: collapse;';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    content.headers.forEach((headerText) => {
      const th = document.createElement('th');
      th.contentEditable = 'true';
      th.style.cssText =
        'border: 1px solid #ddd; padding: 8px; background: #f5f5f5; text-align: left;';
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    content.rows.forEach((row) => {
      const tr = document.createElement('tr');
      row.forEach((cellText) => {
        const td = document.createElement('td');
        td.contentEditable = 'true';
        td.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        td.textContent = cellText;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    element.appendChild(table);

    const controls = document.createElement('div');
    controls.style.cssText = 'display: flex; gap: 8px; margin-top: 8px;';

    const addRowBtn = document.createElement('button');
    addRowBtn.textContent = '+ Row';
    addRowBtn.style.cssText = 'padding: 4px 12px; cursor: pointer;';
    addRowBtn.onclick = () => {
      content.rows.push(new Array(content.headers.length).fill(''));
      this.updateContent(content);
    };
    controls.appendChild(addRowBtn);

    const addColBtn = document.createElement('button');
    addColBtn.textContent = '+ Column';
    addColBtn.style.cssText = 'padding: 4px 12px; cursor: pointer;';
    addColBtn.onclick = () => {
      content.headers.push(`Header ${content.headers.length + 1}`);
      content.rows.forEach((row) => row.push(''));
      this.updateContent(content);
    };
    controls.appendChild(addColBtn);

    element.appendChild(controls);
    element.style.cssText = this.formatStyles();
    return element;
  }

  private formatStyles(): string {
    return Object.entries(this.styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  }
}
