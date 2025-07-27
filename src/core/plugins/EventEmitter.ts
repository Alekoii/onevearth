export class EventEmitter {
    private events: Map<string, Function[]> = new Map();

    on(event: string, listener: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(listener);
    }

    off(event: string, listener: Function) {
        const listeners = this.events.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event: string, data?: any) {
        const listeners = this.events.get(event);
        if (listeners) {
            listeners.forEach((listener) => listener(data));
        }
    }
}
