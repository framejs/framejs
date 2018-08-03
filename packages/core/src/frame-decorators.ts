import { attachProperty, createProperty } from './frame-element.js';

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
    invalidateOnPropChanges?: boolean;
}

export const Define = (options: CustomElementOptionsType): any => {
    return (target: any) => {
        const Klass = class extends target {
            static shadow = options.shadow !== undefined ? options.shadow : true;
            static shadowMode = options.mode ? options.mode : 'open';
            public _invalidateOnPropChanges = options.invalidateOnPropChanges
                ? options.invalidateOnPropChanges
                : 'true';
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

        target.constructor.reflectedProps.push(propName);
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
                    const eventOptions: any = {
                        detail: value,
                        bubbles: true,
                        composed: true
                    };

                    const event: any = new CustomEvent(name, eventOptions);

                    host.dispatchEvent(event);
                };
                return {
                    emit: emit
                };
            }
        });
    };
};
