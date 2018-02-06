import { setPropValue, getPropValue, runObserver } from '../core/property-helpers.js';

export const Property = () => {
    return (target: any, name: string) => {
        const propertyDefinition = {
            set: function(value) {
                // Get the value before it gets updated with new value
                const oldValue = getPropValue(this, name);
                // Update _value with new value
                setPropValue(this, name, value);

                // Prevent triggering change events or rerendering
                // until the first iteration has finished.
                if (!this.__connected) {
                    return;
                }

                // Run any function registered for this property using @Watch(name: string)
                runObserver(this, name, oldValue, value);

                this._invalidate();
            },
            get: function() {
                return getPropValue(this, name);
            }
        };

        Object.defineProperty(target, name, propertyDefinition);
    }
}
