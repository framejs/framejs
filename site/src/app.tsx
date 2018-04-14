import {Define, FrameElement} from '@framejs/core';
import './code-examples/typescript-example';
import './elements/label/label';
import './elements/button/button';
import './elements/logo/logo';

@Define({
    tag: 'frjs-app',
    style: require('./app.scss').toString()
})
class App extends FrameElement {
    render() {
        return `
            <div class="main">
                <frjs-logo>framejs</frjs-logo>
                <h1>Focus on writing slick web components instead of dealing with a low-level API</h1>
                <frjs-button href="https://github.com/framejs/framejs" icon="github"> Github</frjs-button>
                <frjs-button href="https://stackblitz.com/edit/framejs-typescript-preact?file=index.tsx" icon="stackblitz"> Stackblitz</frjs-button>
            </div>
            <div class="frame">
                <frjs-typescript-example class="frame__example"></frjs-typescript-example>
                <div class="frame__labels">
                    <frjs-label style="color: #fff; background: var(--primary-color)">~1.5 kb (gzipped)</frjs-label>
                    <frjs-label style="color: #fff; background: #50E3C2;">JSX / Lit-html</frjs-label>
                    <frjs-label style="color: #fff; background: #68C7F1;">Typescript</frjs-label>
                    <frjs-label>VanillaJS</frjs-label>
                </div>
            </div>
        `
    }
}