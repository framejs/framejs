import { html, render } from 'lit-html/lib/lit-extended.js';
export { html } from 'lit-html/lit-html.js';

export const withLitHtml = (base: any) => class extends base {
    public _renderOnPropertyChange = true;

    renderer(template) {
        render(template(), this.shadowRoot)
    }
}