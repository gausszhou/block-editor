import type { Block } from './block';

export interface EditorState {
  blocks: Block[];
}

export interface HistoryManager {
  undo(): EditorState | null;
  redo(): EditorState | null;
  push(state: EditorState): void;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
}

export class History implements HistoryManager {
  private undoStack: EditorState[] = [];
  private redoStack: EditorState[] = [];
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  push(state: EditorState): void {
    this.undoStack.push(this.serializeState(state));
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo(): EditorState | null {
    if (this.undoStack.length <= 1) {
      return null;
    }
    const currentState = this.undoStack.pop()!;
    this.redoStack.push(currentState);
    return this.undoStack[this.undoStack.length - 1];
  }

  redo(): EditorState | null {
    if (this.redoStack.length === 0) {
      return null;
    }
    const nextState = this.redoStack.pop()!;
    this.undoStack.push(nextState);
    return nextState;
  }

  canUndo(): boolean {
    return this.undoStack.length > 1;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  private serializeState(state: EditorState): EditorState {
    return {
      blocks: state.blocks.map((block) => ({ ...block.toJSON() })) as Block[],
    };
  }

  getUndoStack(): readonly EditorState[] {
    return [...this.undoStack];
  }

  getRedoStack(): readonly EditorState[] {
    return [...this.redoStack];
  }
}
