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
    public _renderOnPropertyChange = true;

    renderer(template, _root) {
        this._preactDom = render(
            template(),
            _root,
            this._preactDom || _root.childNodes[0]
        );
    }
}