import { h, render } from 'preact';

export type CssClassMap = { [className: string]: boolean };

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {
      // catch all
      [tagName: string]: any;
    }
  }
}

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