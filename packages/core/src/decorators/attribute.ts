import { setPropValue, getPropValue, runObserver, setPropertyAsAttribute, registerAttribute, setPropOption, reflectType } from '../core/property-helpers.js';
import { dashCase } from '../utils/dash-case.js';

export interface AttributeOptions {
    type?: Function;
}

export const Attribute = (options?: AttributeOptions) => {
    return (target: any, name: string) => {
        // Using let as uglifying fails if const
        let attribute = dashCase(name);

        // Register attribute for re-applying attributes when connected
        registerAttribute(target, attribute);
        setPropOption(target, name, options);

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
                setPropertyAsAttribute(this, attribute, value)

                this._invalidate();
            },
            get: function() {
                return getPropValue(this, name);
            }
        };

        Object.defineProperty(target, name, propertyDefinition);
    }
}
