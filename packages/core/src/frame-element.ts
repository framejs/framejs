export const dashCase = (string: string): string => {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const camelCase = (string: string): string => {
    return string.toLowerCase().replace(/-(.)/g, (match, letter) => {
        return letter.toUpperCase();
    });
};

export const createProperty = (prototype: any, propName: string, value: any) => {
    if (prototype.hasOwnProperty(propName)) {
        const preValue = prototype[propName];
        delete prototype[propName];
        prototype[propName] = preValue;
        prototype.props[propName] = preValue;
    } else {
        prototype[propName] = value;
        prototype.props[propName] = value;
    }

    Promise.resolve().then(() => {
        attachProperty(prototype, propName);

        if (prototype.reflectedPropsMap[propName]) {
            prototype._setAttributeValue(prototype.reflectedPropsMap[propName], prototype[propName]);
        }
    });
};

export const attachProperty = (prototype: any, propName: string) => {
    function get() {
        if (!this.props) {
            this.props = {};
        }

        return this.props[propName];
    }
    function set(value: any) {
        const oldValue = this.props[propName];
        this.props[propName] = value;

        if (this.reflectedPropsMap[propName]) {
            if (!(this as any).isConnected) {
                Promise.resolve().then(() => this._setAttributeValue(this.reflectedPropsMap[propName], value));
            } else {
                this._setAttributeValue(this.reflectedPropsMap[propName], value);
            }
        }

        if (prototype.constructor.propObservers && prototype.constructor.propObservers[propName]) {
            this[prototype.constructor.propObservers[propName]](oldValue, value);
        }

        if (this._invalidateOnPropChanges) {
            this.invalidate();
        }
    }
    Object.defineProperty(prototype, propName, { get, set });
};

export interface IProps {
    [key: string]: any;
}

export interface IPropTypes {
    [key: string]: Function;
}

export interface IEventListeners {
    [key: string]: string;
}

export interface IPropObservers {
    [key: string]: any;
}

export interface IReflectedPropsMap {
    [key: string]: any;
}

export interface IAttributesPropsMap {
    [key: string]: any;
}

export class FrameElement extends HTMLElement {
    static props: IProps;
    static propTypes: IPropTypes;
    static reflectedProps: string[] = [];
    static eventListeners: IEventListeners = {};
    static propObservers: IPropObservers;
    public props: IProps = {};
    public reflectedPropsMap: IReflectedPropsMap;
    public attributesPropsMap: IAttributesPropsMap;
    public _shadow: boolean = true;
    public _shadowMode: 'open' | 'closed' = 'open';
    public _invalidateOnPropChanges: boolean = true;
    private _needsRender: boolean = false;
    private _hasValidated: boolean = false;

    static get observedAttributes(): string[] {
        return this.reflectedProps.map(propName => {
            return dashCase(propName);
        });
    }

    constructor() {
        super();

        this.reflectedPropsMap = (this.constructor as any).reflectedProps.reduce((result, prop) => {
            result[prop] = dashCase(prop);
            return result;
        }, {});

        this.attributesPropsMap = (this.constructor as any).reflectedProps.reduce((result, prop) => {
            result[dashCase(prop)] = prop;
            return result;
        }, {});

        for (let propName in (this.constructor as any).props) {
            const value = (this.constructor as any).props[propName];
            createProperty(this, propName, value);
        }

        this.invalidate();
    }

    public disconnectedCallback(): void {
        this._elementCallback('elementDidUnmount');
        this._configureListeners(false);
    }

    public attributeChangedCallback(attrName: string, _oldValue: string, newValue: string): void {
        this._setPropertyValueFromAttributeValue(attrName, newValue);
    }

    public _setAttributeValue(attrName: string, value: any): void {
        if (!attrName || typeof value === 'undefined') {
            return;
        }

        if (typeof value === 'boolean') {
            if (!value) {
                this.removeAttribute(attrName);
            } else {
                this.setAttribute(attrName, '');
            }
        }

        if (typeof value !== 'object' && typeof value !== 'boolean') {
            this.setAttribute(attrName, value);
        }
    }

    public _setPropertyValueFromAttributeValue(attrName: string, newValue: string): void {
        const propName = this.attributesPropsMap[attrName];
        const typeFn = (this.constructor as any).propTypes[propName];

        let value;

        if (typeFn.name === 'Boolean') {
            value = newValue === '';
        } else {
            value = newValue !== null ? typeFn(newValue) : undefined;
        }

        if (this[propName] !== value) {
            this[propName] = value;
        }
    }

    private _elementCallback(event: string): void {
        if (this[event]) {
            this[event]();
        }
    }

    private _configureListeners(add: boolean = true): void {
        const listeners = (this.constructor as any).eventListeners;
        Object.keys(listeners).forEach(key => {
            const eventArray = key.split(':');
            const root = this.shadowRoot ? this.shadowRoot : this;
            const target = eventArray[1] ? root.querySelector(eventArray[1]) : this;
            if (add) {
                target.addEventListener(eventArray[0], e => this[listeners[key]](e));
            } else {
                target.removeEventListener(eventArray[0], e => this[listeners[key]](e));
            }
        });
    }

    public async invalidate(): Promise<void> {
        if (!this._needsRender) {
            this._needsRender = true;
            this._needsRender = await false;

            if (!this._hasValidated && this._shadow) {
                this.attachShadow({ mode: this._shadowMode });
            }

            this.renderer();

            if (!this._hasValidated) {
                this._configureListeners();
                this._elementCallback('elementDidMount');
                this._applyStyle();
            }

            this._hasValidated = true;
        }
    }

    // Depricated
    public _invalidate(): void {
        console.warn('_invalidate() is depricated. Use invalidate() in the future.');
        this.invalidate();
    }

    private _applyStyle(): void {
        const style = (this.constructor as any).style;

        if (!style || !style.length) {
            return;
        }

        const styleTemplate = document.createElement('template');
        const root = this.shadowRoot ? this.shadowRoot : this;
        styleTemplate.innerHTML = `<style>${style}</style>`;

        // Append style template to shadowRoot
        root.appendChild(styleTemplate.content.cloneNode(true));

        if ((<any>window).ShadyCSS && !document.head.querySelector(`[scope="${this.localName}"]`)) {
            (<any>window).ShadyCSS.prepareTemplate(styleTemplate, this.localName);
        }
    }

    private renderer(): void {
        if ((<any>this).render) {
            const root = this.shadowRoot ? this.shadowRoot : this;
            root.innerHTML = (<any>this).render();
        }
    }
}
