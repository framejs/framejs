import { registerObserver } from '../core/property-helpers.js';

export const Observe = (property: string) => {
    return (target: any, name: string) => {
        registerObserver(target, property, name);
    }
}
