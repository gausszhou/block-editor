export type EventCallback = (data?: unknown) => void;

export type EditorEventType =
  | 'block:add'
  | 'block:remove'
  | 'block:update'
  | 'block:move'
  | 'block:select'
  | 'block:copy'
  | 'block:paste'
  | 'history:undo'
  | 'history:redo'
  | 'editor:change';

export class EventEmitter {
  private events: Map<EditorEventType, Set<EventCallback>> = new Map();

  on(event: EditorEventType, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: EditorEventType, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: EditorEventType, data?: unknown): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  once(event: EditorEventType, callback: EventCallback): void {
    const wrapper: EventCallback = (data) => {
      callback(data);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  clear(): void {
    this.events.clear();
  }
}
