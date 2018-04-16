import {Define, FrameElement} from '@framejs/core';
import {highlight, languages} from 'prismjs'

@Define({
    tag: 'frjs-typescript-example',
    style: require('./prism-theme.scss')
})
class TypescriptExample extends FrameElement {
    public code;
    constructor() {
        super();
        const code = `
// Typescript
import { FrameElement, Define, Attribute } from @framejs/core;




@Define({
    tag: 'planet-greeting'
})
export class MyElement extends FrameElement {
    @Attribute() planet;

    render() {
        return \`<h1>Hello \${this.planet}!</h1>\`;
    }
}




// HTML
<planet-greeting planet="earth"></planet-greeting>
        `;

        this.code = highlight(code, languages.javascript);
    }
    render() {
        return `<pre><code>${this.code}</code></pre>`
    }
}