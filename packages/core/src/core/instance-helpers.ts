import { camelCase } from "../utils/camel-case.js";
import { dashCase } from "../utils/dash-case.js";
import { reflectType } from './property-helpers';

export const attachShadow = (elem: any, shadowMode: string = 'open'): void => {
    if (!elem.shadowRoot) {
        elem._root = elem.attachShadow({ mode: shadowMode })
    };
};

export const setDefaultValues = (elem: any, values: any): void => {
    Object.keys(values).forEach(prop => {
        if (elem.hasOwnProperty(prop)) {
            const value = elem[prop];
            delete elem[prop];
            elem[prop] = value;
        }
    });
};

export const setDefaultAttributes = (elem: any, attributes: string[] = []): void => {
    attributes.forEach(attribute => {
        const prop = camelCase(attribute);
        elem[prop] = elem[prop];
    });
};

export const normaliseAttributeValue = (
    constructor: any,
    elem: any,
    name: string,
    newVal: string,
    oldVal: string
): boolean | string |  Number => {
    const type = constructor.propsOptions[name] ? constructor.propsOptions[name].type : null;
    
    if (type && type.name === 'Boolean') {
        return elem.hasAttribute(dashCase(name));
    }

    if (type && type.name === 'Number') {
        return Number(newVal);
    }

    return newVal;
};

export const registerListener = (elem: any, listener: string, name: string, target?: any) => {
    if (!elem.constructor._listeners) {
        elem.constructor._listeners = {
            [listener]: {
                name: name,
                target: target
            }
        };
    } else {
        elem.constructor._listeners[listener] = {
            name: name,
            target: target
        };
    }
};

const parseListener = (elem, event: string, target?: any) => {
    const obj = {
        event: event,
        target: null
    }

    if (target) {
        obj.target = target;
    } else if (typeof target === 'undefined') {
        obj.target = elem.shadowRoot;
    } else {
        return;
    }

    return obj;
}

export const unbindListeners = (elem: any, constructor: any, listeners: any): void => {
    Object.keys(listeners).forEach((listener: any) => {
        let parsedListener = parseListener(elem, listener, listeners[listener].target);

        parsedListener.target.removeEventListener(parsedListener.event, e => {
            elem[listeners[listener].name](e);
        })
    })
}

export const bindListeners = (elem: any, constructor: any, listeners: any): void => {
    Object.keys(listeners).forEach((listener: any) => {
        let parsedListener = parseListener(elem, listener, listeners[listener].target);
        if (!parsedListener.target) {
            return
        }

        parsedListener.target.addEventListener(parsedListener.event, e => {
            elem[listeners[listener].name](e);
        })
    })
}
