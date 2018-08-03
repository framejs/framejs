import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElement extends FrameElement {
    static is = 'my-element';

    static props = {
        myProp: true,
        myOtherProp: undefined,
        libraryName: 'FrameJS',
        numberProp: 10
    };

    static propTypes = {
        myProp: Boolean,
        myOtherProp: String,
        libraryName: String,
        numberProp: Number
    };

    static reflectedProps = ['myProp', 'myOtherProp', 'numberProp'];

    render() {
        return `Hello ${this.props.libraryName}!`;
    }
}

customElements.define(MyElement.is, MyElement);

describe('FrameElement', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        myElementInstance = null;
        done();
    });

    it('should set properties from static props', done => {
        myElementInstance.elementDidMount = () => {
            assert.equal(myElementInstance.myProp, true);
            done();
        };
    });

    it('should set default props set by the user', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance.myProp, false);
            done();
        };
    });

    it('should invalidate of prop change', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance._needsRender, true);
            done();
        };
    });

    it('Should update internal prop when prop changes', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance.props.myProp, false);
            done();
        };
    });

    it('Should set a default my-prop attribute', done => {
        myElementInstance.elementDidMount = () => {
            setTimeout(() => {
                assert.equal(myElementInstance.hasAttribute('my-prop'), true);
                done();
            });
        };
    });

    it('should return prop of the right type from attribute', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.setAttribute('number-prop', '20');
            setTimeout(() => {
                assert.equal(typeof myElementInstance.numberProp, 'number');
                done();
            });
        };
    });

    it('Should get prop value updated from null later', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.myOtherProp = 'Hello FrameJS!';
            assert.equal(myElementInstance.myOtherProp, 'Hello FrameJS!');
            done();
        };
    });

    it('Should remove default my-prop attribute', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance.hasAttribute('my-prop'), false);
            done();
        };
    });

    it('Should set a string attribute as my-other-prop', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.myOtherProp = 'Hello FrameJS!';

            setTimeout(() => {
                assert.equal(myElementInstance.getAttribute('my-other-prop'), 'Hello FrameJS!');
                done();
            });
        };
    });

    it('Should render content from render function', done => {
        myElementInstance.elementDidMount = () => {
            assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello FrameJS!');
            done();
        };
    });

    it('Should map attribute value to prop', done => {
        myElementInstance.elementDidMount = () => {
            const msg = 'Hello, i come from attribute!';
            myElementInstance.setAttribute('my-other-prop', msg);

            setTimeout(() => {
                assert.equal(myElementInstance.myOtherProp, msg);
                done();
            });
        };
    });

    it('ElementDidMount run after initial render', done => {
        myElementInstance.elementDidMount = () => {
            assert.equal(true, true);
            done();
        };
    });

    it('ElementDidUnmount run after dom removal', done => {
        myElementInstance.elementDidUnmount = () => {
            assert.equal(true, true);
            done();
        };

        myElementInstance.remove();
    });

    it('Should not invalidate on prop changes', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance._invalidateOnPropChanges = false;
            myElementInstance.libraryName = 'Polymer';

            setTimeout(() => {
                assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello FrameJS!');
                done();
            });
        };
    });
});
