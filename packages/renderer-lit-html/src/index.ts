import { render, html } from 'lit-html/lib/lit-extended.js';
export { html } from 'lit-html/lib/lit-extended.js';

export const withLitHtml = (base: any) => class extends base {
    public _renderOnPropertyChange = true;

    renderer(template, _root) {
        render(template(), _root)
    }
}