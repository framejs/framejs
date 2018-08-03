import { FrameElement } from '../src/frame-element.js';
let assert = chai.assert;

class MyElementObservers extends FrameElement {
    static is = 'my-element-observers';
    public observedPropNewVal: boolean = false;

    static props = {
        observedProp: false
    };

    static propTypes = {
        observedProp: Boolean
    };

    static propObservers = {
        observedProp: '_observedPropObserver'
    };

    static reflectedProps = ['observedProp'];

    _observedPropObserver(oldVal, newVal) {
        this.observedPropNewVal = newVal;
    }
}

customElements.define(MyElementObservers.is, MyElementObservers);

describe('FrameElement Observed Props', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-observers');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        myElementInstance = null;
        done();
    });

    it('Should update property from observer function', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.observedProp = true;

            setTimeout(() => {
                assert.equal(myElementInstance.observedPropNewVal, true);
                done();
            });
        };
    });

    it('Should update property from observer function via attribute set by user', done => {
        myElementInstance.elementDidMount = () => {
            myElementInstance.setAttribute('observed-prop', '');

            setTimeout(() => {
                assert.equal(myElementInstance.observedPropNewVal, true);
                done();
            });
        };
    });
});
