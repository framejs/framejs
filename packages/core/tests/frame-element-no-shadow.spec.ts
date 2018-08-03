import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElement extends FrameElement {
    static is = 'my-element-no-shadow';
    static shadow = false;

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
        myElementInstance = null;
        done();
    });

    it('Should render without shadow', done => {
        myElementInstance.elementDidMount = () => {
            assert.equal(myElementInstance.shadowRoot, undefined);
            done();
        };
    });

    it('Should render template without shadow', done => {
        myElementInstance.elementDidMount = () => {
            assert.equal(myElementInstance.innerHTML, 'Hello FrameJS!');
            done();
        };
    });
});
