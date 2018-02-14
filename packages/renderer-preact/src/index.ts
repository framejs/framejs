import { h, render } from 'preact';
export { h } from 'preact';

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

    renderer(template, _root) {
        this._preactDom = render(
            template(),
            _root,
            this._preactDom || _root.childNodes[0]
        );
    }
}