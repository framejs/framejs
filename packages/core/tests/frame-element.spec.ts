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

    public hasMounted = false;
    public hasUnmounted = false;

    componentDidMount() {
        this.hasMounted = true;
    }

    componentDidUnmount() {
        this.hasUnmounted = true;
    }

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
        done();
    });

    it('should set properties from static props', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.myProp, true);
            done();
        });
    });

    it('should set default props set by the user', done => {
        setTimeout(() => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance.myProp, false);
            done();
        });
    });

    it('should invalidate of prop change', done => {
        setTimeout(() => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance._needsRender, true);
            done();
        });
    });

    it('Should update internal prop when prop changes', done => {
        setTimeout(() => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance.props.myProp, false);
            done();
        });
    });

    it('Should set a default my-prop attribute', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.hasAttribute('my-prop'), true);
            done();
        });
    });

    it('should return prop of the right type from attribute', done => {
        setTimeout(() => {
            myElementInstance.setAttribute('number-prop', '20');
            setTimeout(() => {
                assert.equal(typeof myElementInstance.numberProp, 'number');
                done();
            });
        });
    });

    it('Should get prop value updated from null later', done => {
        setTimeout(() => {
            myElementInstance.myOtherProp = 'Hello FrameJS!';
            assert.equal(myElementInstance.myOtherProp, 'Hello FrameJS!');
            done();
        });
    });

    it('Should remove default my-prop attribute', done => {
        setTimeout(() => {
            myElementInstance.myProp = false;
            assert.equal(myElementInstance.hasAttribute('my-prop'), false);
            done();
        });
    });

    it('Should set a string attribute as my-other-prop', done => {
        setTimeout(() => {
            myElementInstance.myOtherProp = 'Hello FrameJS!';
            assert.equal(myElementInstance.getAttribute('my-other-prop'), 'Hello FrameJS!');
            done();
        });
    });

    it('Should render content from render function', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello FrameJS!');
            done();
        });
    });

    it('Should map attribute value to prop', done => {
        setTimeout(() => {
            const msg = 'Hello, i come from attribute!';
            myElementInstance.setAttribute('my-other-prop', msg);

            assert.equal(myElementInstance.myOtherProp, msg);
            done();
        });
    });

    it('ComponentDidMount run after initial render', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.hasMounted, true);
            done();
        });
    });

    it('ComponentDidUnmount run after dom removal', done => {
        setTimeout(() => {
            myElementInstance.remove();
            setTimeout(() => {
                assert.equal(myElementInstance.hasUnmounted, true);
                done();
            });
        });
    });

    it('Should not invalidate on prop changes', done => {
        setTimeout(() => {
            myElementInstance._invalidateOnPropChanges = false;
            myElementInstance.libraryName = 'Polymer';
            setTimeout(() => {
                assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello FrameJS!');
                done();
            });
        });
    });
});
