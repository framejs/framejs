import { html, render } from 'lit-html/lib/lit-extended.js';
export { html } from 'lit-html/lit-html.js';

export class LitRenderer extends HTMLElement {
    public _renderOnPropertyChange = true;

    renderer(template) {
        render(template(), this.shadowRoot)
    }
}