export type EventType = "usage.update";

type Callback = () => void;

class EventEmitter {
  private static instance: EventEmitter;
  private events: { [eventName: string]: Callback[] } = {};

  private constructor() {}

  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  on(eventName: EventType, callback: Callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName: EventType) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }
}

const getEventEmitter = () => {
  return EventEmitter.getInstance();
};

export default getEventEmitter;
