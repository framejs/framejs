import { render, html } from 'lit-html/lib/lit-extended.js';
export { html } from 'lit-html/lib/lit-extended.js';

export const withLitHtml = (base: any) =>
    class extends base {
        renderer() {
            if ((<any>this).render) {
                const root = this.shadowRoot ? this.shadowRoot : this;

                render((<any>this).render(), root);
            }
        }
    };
