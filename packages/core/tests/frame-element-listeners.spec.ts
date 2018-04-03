import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElement extends FrameElement {
    static is = 'my-element-listeners';
    public isClicked = false;
    public isSpanClicked = false;

    static eventListeners = {
        click: '_handleClick',
        'click:span': '_handleSpanClick'
    };

    _handleClick() {
        this.isClicked = true;
    }

    _handleSpanClick() {
        this.isSpanClicked = true;
    }

    render() {
        return `Hello <span>${this.props.libraryName}</span>!`;
    }
}

customElements.define(MyElement.is, MyElement);

describe('FrameElement Listeners', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-listeners');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        done();
    });

    it('Should run handle click on element click', done => {
        setTimeout(() => {
            myElementInstance.click();
            assert.equal(myElementInstance.isClicked, true);
            done();
        });
    });

    it('Should run handle click on shadowRoot child element click', done => {
        setTimeout(() => {
            const el = myElementInstance.shadowRoot.querySelector('span');
            el.click();

            assert.equal(myElementInstance.isSpanClicked, true);
            done();
        });
    });
});
