import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElement extends FrameElement {
    static is = 'my-element-style';

    static style = `:host { color: blue; }`;

    render() {
        return `Hello FrameJS!`;
    }
}

customElements.define(MyElement.is, MyElement);

describe('FrameElement style', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-style');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        myElementInstance = null;
        done();
    });

    it('should set style from static style', done => {
        myElementInstance.elementDidMount = () => {
            assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello FrameJS!<style>:host { color: blue; }</style>');
            done();
        };
    });
});
