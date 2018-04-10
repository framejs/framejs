import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElement extends FrameElement {
    static is = 'my-element-custom-shadow';
    static shadowMode = 'closed';

    render() {
        return `Hello FrameJS!`;
    }
}

customElements.define(MyElement.is, MyElement);

describe('FrameElement custom shadow', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-custom-shadow');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        done();
    });

    it('Should render with closed shadow mode', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.shadowRoot, undefined);
            done();
        });
    });
});
