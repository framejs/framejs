import { attachProperty } from './frame-element.js';

export interface IPropOptions {
    type: Function;
}

export const reflectType = (prototype: any, propertyName: string): Function => {
    const { hasMetadata = () => false, getMetadata = () => null }: any = Reflect;
    if (hasMetadata('design:type', prototype, propertyName)) {
        return getMetadata('design:type', prototype, propertyName);
    }

    return null;
};

export interface CustomElementOptionsType {
    tag: string;
    style?: string;
    shadow?: boolean;
    mode?: 'open' | 'closed';
}

export const Define = (options: CustomElementOptionsType): any => {
    return (target: any) => {
        const Klass = class extends target {
            public _shadow = options.shadow ? options.shadow : true;
            public _shadowMode = options.mode ? options.mode : 'open';
            static style = options.style ? options.style : '';
        };
        customElements.define(options.tag, Klass);
    };
};

export const Property = (options?: IPropOptions): any => {
    return (target: any, propName: any) => {
        attachProperty(target, propName);
    };
};

export const Attribute = (options?: IPropOptions): any => {
    return (target: any, propName: any) => {
        if (!target.constructor.propTypes) {
            target.constructor.propTypes = {};
        }
        if (!target.constructor.reflectedProps) {
            target.constructor.reflectedProps = [];
        }
        target.constructor.reflectedProps = [...target.constructor.reflectedProps, propName];

        target.constructor.propTypes[propName] = options ? options.type : reflectType(target, propName);
        attachProperty(target, propName);
    };
};

export const Observe = (propName: string): any => {
    return (target, methodName) => {
        if (!target.constructor.propObservers) {
            target.constructor.propObservers = {};
        }
        target.constructor.propObservers[propName] = methodName;
    };
};

export const Listen = (eventString: string): any => {
    return (target, methodName) => {
        if (!target.constructor.eventListeners) {
            target.constructor.eventListeners = {};
        }

        target.constructor.eventListeners[eventString] = methodName;
    };
};

export interface EventEmitter {
    emit: any;
}

export const Event = (): any => {
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
