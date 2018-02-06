export interface EventEmitter {
    emit: any;
}

export const Event = () => {
    return (target: any, name: string) => {
        delete target[name];

        Object.defineProperty(target, name, {
            get: function() {
                const host = this;
                const emit = function(value) {
                    const event = new CustomEvent(name, {
                        detail: value,
                        bubbles: true
                    });

                    host.dispatchEvent(event);
                };
                return {
                    emit: emit
                };
            }
        });
    };
};
