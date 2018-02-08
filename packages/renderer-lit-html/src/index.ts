import { render, html } from '../node_modules/lit-html/lib/lit-extended.js';
export { html } from '../node_modules/lit-html/lib/lit-extended.js';

export const withLitHtml = (base: any) => class extends base {
    public _renderOnPropertyChange = true;

    renderer(template) {
        render(template(), this.shadowRoot)
    }
}