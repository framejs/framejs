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
    shadow?: boolean;
    mode?: 'open' | 'closed';
}

export const CustomElement = (options: CustomElementOptionsType) => {
    return (target: any) => {
        const hostConstructor: any = class extends (target as { new (): any }) {
            // _root is either this instance or shadowRoot
            public _root: any;

            // __connected will be true when connectedCallback has fired.
            public __connected: boolean = false;

            // __superConnected will be true when super.connectedCallback has fired.
            public __superConnected: boolean = false;

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

                if (options.shadow === false) {
                    this._root = this;
                } else {
                    // Attach shadow if not set.
                    attachShadow(this, options.mode);
                }
            }

            connectedCallback() {
                // Let other decorators know that the component is instanciated.
                this.__connected = true;

                // props gets set by @Attribute and @Property decorators
                if (this.props) {
                    setDefaultValues(this, this.props)
                };
                
                if (target._observedAttributes) {
                    setDefaultAttributes(this, target._observedAttributes)
                };

                // Only invalidate if _renderOnPropertyChange
                if (this._renderOnPropertyChange) {
                    this._invalidate();
                } else {
                    this.renderer();
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
                if (super.renderer) {
                    // Call a custom renderer if defined
                    super.renderer(() => this.render(), this._root);
                } else {
                    // Update host template
                    this._root.innerHTML = this.render();
                }

                if (options.style && this._needsStyle && this.render) {
                    this._applyStyle();
                    this._needsStyle = false;   
                }
                
                if (!this._listernesBound && target._listeners) {
                    bindListeners(this, target, target._listeners);
                    this._listernesBound = true;
                }

                // delay super.connectedCallback until first render
                if (!this.__superConnected) {
                    super.connectedCallback && super.connectedCallback();
                    this.__superConnected = true;
                }
            }

            _applyStyle(): void {
                const styleTemplate = document.createElement("template");
                styleTemplate.innerHTML = `<style>${options.style}</style>`;

                // Append style template to shadowRoot
                this._root.appendChild(styleTemplate.content.cloneNode(true));

                if (this._needsShadyCSS && !document.head.querySelector(`[scope="${this.localName}"]`)) {
                    (<any>window).ShadyCSS.prepareTemplate(styleTemplate, this.localName);
                }
            }

            disconnectedCallback() {
                super.disconnectedCallback && super.disconnectedCallback();
                if (target._listeners) {
                    unbindListeners(this, target, target._listeners);
                }
            }
        };

        // Define element in customElements registry
        (<any>window).customElements.define(options.tag, hostConstructor);
        return hostConstructor;
    };
};
