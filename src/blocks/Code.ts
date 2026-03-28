import { BaseBlock, type BlockType } from '../block';

export interface CodeContent {
  code: string;
  language?: string;
}

export class CodeBlock extends BaseBlock {
  type: BlockType = 'code';

  constructor(
    content: CodeContent | string = { code: '', language: 'javascript' },
    styles: Record<string, string> = {},
  ) {
    super(content, styles);
  }

  render(): HTMLElement {
    const element = document.createElement('div');
    element.dataset.type = 'code';
    element.dataset.id = this.id;
    element.classList.add('block', 'block-code');

    const content = this.content as CodeContent;

    const header = document.createElement('div');
    header.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; background: #2d2d2d; padding: 8px 12px; border-radius: 4px 4px 0 0;';

    const langSelect = document.createElement('select');
    langSelect.style.cssText =
      'background: #444; color: #fff; border: none; padding: 4px 8px; border-radius: 3px;';
    const languages = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown'];
    languages.forEach((lang) => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang;
      if (lang === (content.language || 'javascript')) {
        option.selected = true;
      }
      langSelect.appendChild(option);
    });
    header.appendChild(langSelect);

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.cssText =
      'background: #444; color: #fff; border: none; padding: 4px 12px; border-radius: 3px; cursor: pointer;';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(content.code || '');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    };
    header.appendChild(copyBtn);

    element.appendChild(header);

    const pre = document.createElement('pre');
    pre.style.cssText =
      'margin: 0; padding: 12px; background: #1e1e1e; color: #d4d4d4; overflow-x: auto; border-radius: 0 0 4px 4px;';

    const code = document.createElement('code');
    code.contentEditable = 'true';
    code.style.cssText =
      'font-family: Consolas, Monaco, "Courier New", monospace; font-size: 14px;';
    code.textContent = content.code || '';
    pre.appendChild(code);

    element.appendChild(pre);
    element.style.cssText = this.formatStyles();
    return element;
  }

  private formatStyles(): string {
    return Object.entries(this.styles)
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  }
}
