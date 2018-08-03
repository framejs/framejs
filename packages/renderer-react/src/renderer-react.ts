import * as reactDom from 'react-dom';

declare global {
    namespace JSX {
        interface Element {}
        export interface IntrinsicElements {
            // catch all
            [tagName: string]: any;
        }
    }
}

export const withReact = (Base = HTMLElement) =>
  class extends Base {
     renderer() {
            if ((this as any).render) {
                const root = this.shadowRoot ? this.shadowRoot : this;
                reactDom.render((this as any).render(), root);
            }
        }
    
    disconnectedCallback() {
      super['disconnectedCallback'] && super['disconnectedCallback']();
      reactDom.unmountComponentAtNode(this.shadowRoot ? this.shadowRoot : this);
    }
  };