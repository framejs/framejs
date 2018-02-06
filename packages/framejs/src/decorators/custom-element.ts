import {
    attachShadow,
    setDefaultValues,
    normaliseAttributeValue,
    setDefaultAttributes,
    bindListeners,
    unbindListeners
} from "../core/instance-helpers.js";

import { camelCase } from "../utils/camel-case.js";

export interface CustomElementOptionsType {
    tag: string;
    style?: string;
}

export const CustomElement = (options: CustomElementOptionsType) => {
    return (target: any) => {
        const hostConstructor: any = class extends (target as { new (): any }) {
            // __connected will be true when connectedCallback has fired.
            public __connected: boolean = false;

            // _needsRender is used to schedule micro-task for rendering.
            public _needsRender: boolean = false;

            // _needsShadyCSS is checking if ShadyCSS is loaded and if it should shim the Element.
            public _needsShadyCSS: boolean = typeof (<any>window).ShadyCSS ===
                "object";
            
            // _needsStyle is used to tell if style has already been applied
            public _needsStyle: boolean = true;

            public _listernesBound: boolean = false;

            // Register native observedAttributes
            static get observedAttributes() {
                if (target._observedAttributes) {
                    return [...target._observedAttributes];
                } else {
                    return []
                }
            }

            constructor() {
                super();

                // Attach shadow if not set.
                attachShadow(this);
            }

            connectedCallback() {
                // Let other decorators know that the component is instanciated.
                this.__connected = true;

                // _values gets set by @Attribute and @Property decorators
                if (this._values) setDefaultValues(this, this._values);
                if (target._observedAttributes) setDefaultAttributes(this, target._observedAttributes);

                // Call any previously defined connectedCallback functions.
                super.connectedCallback && super.connectedCallback();

                // Only invalidate if _renderOnPropertyChange
                if (this._renderOnPropertyChange) {
                    this._invalidate();
                } else {
                    this.renderer();
                }
            }

            disconnectedCallback() {
                if (target._listeners) {
                    unbindListeners(this, target, target._listeners);
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                super.attributeChangedCallback &&
                super.attributeChangedCallback(name, oldValue, newValue);

                if (oldValue !== newValue) {
                    const property = camelCase(name);
                    this[property] = normaliseAttributeValue(
                        this,
                        name,
                        newValue,
                        oldValue
                    );
                }
            }

            async _invalidate() {
                // Shedule renderer as a micro-task
                // Credit to https://github.com/kenchris/lit-element
                if (!this._needsRender) {
                    this._needsRender = true;
                    this._needsRender = await false;

                    if (this._renderOnPropertyChange) {
                        this.renderer();
                    }
                }
            }

            renderer() {
                const styleTemplate = document.createElement("template");
                styleTemplate.innerHTML = `<style>${options.style}</style>`;

                if (this._needsShadyCSS && options.style && this.render) {
                    (<any>window).ShadyCSS.prepareTemplate(styleTemplate, this.localName);
                }

                if (super.renderer) {
                    // Call a custom renderer if defined
                    super.renderer(() => this.render());
                } else {
                    // Update host template
                    this.shadowRoot.innerHTML = this.render();
                }

                // Append style template to shadowRoot
                if (this._needsStyle) {
                    this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
                    this._needsStyle = false;
                }
                
                if (!this._listernesBound && target._listeners) {
                    bindListeners(this, target, target._listeners);
                    this._listernesBound = true;
                }
            }
        };

        // Define element in customElements registry
        (<any>window).customElements.define(options.tag, hostConstructor);
        return hostConstructor;
    };
};
