import { describe, it, expect, beforeEach } from 'vitest';
import { History, type EditorState } from '@/history';
import { TextBlock } from '@/blocks/Text';

describe('History', () => {
  let history: History;

  beforeEach(() => {
    history = new History(10);
  });

  const createState = (count: number): EditorState => ({
    blocks: Array.from({ length: count }, () => new TextBlock(`Block ${count}`)),
  });

  it('should push initial state', () => {
    history.push(createState(1));
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });

  it('should undo and redo', () => {
    history.push(createState(1));
    history.push(createState(2));
    history.push(createState(3));

    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);

    const state2 = history.undo();
    expect(state2?.blocks.length).toBe(2);
    expect(history.canRedo()).toBe(true);

    const state3 = history.redo();
    expect(state3?.blocks.length).toBe(3);
  });

  it('should clear redo stack when new state is pushed', () => {
    history.push(createState(1));
    history.push(createState(2));
    history.undo();
    expect(history.canRedo()).toBe(true);

    history.push(createState(3));
    expect(history.canRedo()).toBe(false);
  });

  it('should not undo beyond initial state', () => {
    history.push(createState(1));
    const result = history.undo();
    expect(result).toBeNull();
  });

  it('should not redo when redo stack is empty', () => {
    history.push(createState(1));
    const result = history.redo();
    expect(result).toBeNull();
  });

  it('should respect max size', () => {
    for (let i = 0; i < 15; i++) {
      history.push(createState(i));
    }
    const undoStack = history.getUndoStack();
    expect(undoStack.length).toBeLessThanOrEqual(10);
  });

  it('should clear all history', () => {
    history.push(createState(1));
    history.push(createState(2));
    history.clear();
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });
});
