import { h, render } from 'preact';

export const withPreact = (base: any) => class extends base {
    public _renderOnPropertyChange = true;

    renderer(template) {
        this._preactDom = render(
            template(),
            this.shadowRoot,
            this._preactDom
        );
    }
}