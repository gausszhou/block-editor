import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventEmitter } from '../src/events';

describe('EventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it('should register and emit events', () => {
    const callback = vi.fn();
    emitter.on('editor:change', callback);
    emitter.emit('editor:change');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass data to callback', () => {
    const callback = vi.fn();
    emitter.on('block:add', callback);
    emitter.emit('block:add', { id: 'test-123' });
    expect(callback).toHaveBeenCalledWith({ id: 'test-123' });
  });

  it('should support multiple listeners', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    emitter.on('editor:change', callback1);
    emitter.on('editor:change', callback2);
    emitter.emit('editor:change');
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should remove listener with off', () => {
    const callback = vi.fn();
    emitter.on('editor:change', callback);
    emitter.off('editor:change', callback);
    emitter.emit('editor:change');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should support once', () => {
    const callback = vi.fn();
    emitter.once('editor:change', callback);
    emitter.emit('editor:change');
    emitter.emit('editor:change');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear all events', () => {
    const callback = vi.fn();
    emitter.on('editor:change', callback);
    emitter.on('block:add', callback);
    emitter.clear();
    emitter.emit('editor:change');
    emitter.emit('block:add');
    expect(callback).not.toHaveBeenCalled();
  });
});
