export class EventEmitter {
    constructor() {
        this._events = {};
    }

    /**
     * @param {string} eventName
     * @param {function} fn
     */
    subscribe(eventName, fn) {
        if( !this._events[eventName] ) {
            this._events[eventName] = [];
        }

        this._events[eventName].push(fn);
    }

    /**
     * @param {string} eventName
     * @param {*} data
     */
    emit(eventName, data = null) {
        const event = this._events[eventName];
        if(event) {
            event.forEach(fn => {
                fn.call(null, data);
            });
        }
    }
}
