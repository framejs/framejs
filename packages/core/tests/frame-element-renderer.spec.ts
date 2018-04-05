import { FrameElement } from '../src/frame-element.js';

let assert = chai.assert;

const withRenderer = (base: any) => {
    return class rendererElement extends base {
        renderer() {
            if ((<any>this).render()) {
                const root = this.shadowRoot ? this.shadowRoot : this;
                root.innerHTML = `RENDERED: ${(<any>this).render()}`;
            }
        }
    };
};

class MyElementRenderer extends withRenderer(FrameElement) {
    static is = 'my-element-renderer';

    static props = {
        message: 'Hello'
    };

    render() {
        return `${this.props.message} FrameJS!`;
    }
}

customElements.define(MyElementRenderer.is, MyElementRenderer);

describe('FrameElement Renderer', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-renderer');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        done();
    });

    it('Should use custom renderer from renderer mixin', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.shadowRoot.innerHTML, 'RENDERED: Hello FrameJS!');
            done();
        });
    });

    it('Should re-renderer on prop change using mixin renderer', done => {
        setTimeout(() => {
            myElementInstance.message = 'Thanks';
            setTimeout(() => {
                assert.equal(myElementInstance.shadowRoot.innerHTML, 'RENDERED: Thanks FrameJS!');
                done();
            });
        });
    });
});
