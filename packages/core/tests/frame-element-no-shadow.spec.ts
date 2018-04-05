import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElement extends FrameElement {
    static is = 'my-element-no-shadow';
    public _shadow = false;

    render() {
        return `Hello FrameJS!`;
    }
}

customElements.define(MyElement.is, MyElement);

describe('FrameElement no shadow', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-no-shadow');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        done();
    });

    it('Should render without shadow', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.shadowRoot, undefined);
            done();
        });
    });

    it('Should render template without shadow', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.innerHTML, 'Hello FrameJS!');
            done();
        });
    });
});
