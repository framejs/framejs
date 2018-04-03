import { h, render } from '../node_modules/preact/dist/preact.esm.js';
export { h } from '../node_modules/preact/dist/preact.esm.js';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {
      // catch all
      [tagName: string]: any;
    }
  }
}

export const toVdom = (element: any, nodeName?: string) => {
	if (element.nodeType === 3) return element.nodeValue;
  if (element.nodeType !== 1) return null;
  
  let children=[], 
      props={}, 
      i=0, 
      a=element.attributes, 
      cn=element.childNodes;

	for (i=a.length; i--; ) props[a[i].name] = a[i].value;
	for (i=cn.length; i--; ) children[i] = toVdom(cn[i]);
	return h(nodeName || element.nodeName.toLowerCase(), props, children);
}

export const withPreact = (base: any) => class extends base {
    renderer() {
      if ((<any>this).render()) {
          const root = this.shadowRoot ? this.shadowRoot : this;
          root.innerHTML = `RENDERED: ${(<any>this).render()}`;
          this._preactDom = render(
            (<any>this).render(),
            root,
            this._preactDom || root.childNodes[0]
        );
      }
  }
}