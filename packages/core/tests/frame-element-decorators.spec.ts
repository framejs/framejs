import { FrameElement } from '../src/frame-element.js';
import { Property, Attribute, Observe, Listen, Event, EventEmitter } from '../src/frame-decorators.js';

class MyElementDecorators extends FrameElement {
    static is = 'my-element-decorators';
    public newHappyValue;
    public spanClicked: boolean = false;
    public elementClicked: boolean = false;

    @Property() message: any = 'FrameJS';
    @Attribute() happy: boolean = true;
    @Event() myEvent: any;

    @Observe('happy')
    handleHappyChange(oldValue, newValue) {
        this.newHappyValue = newValue;
    }

    @Listen('click')
    handleElementClick(e) {
        this.elementClicked = true;
        this.myEvent.emit('FrameJS');
    }

    @Listen('click:span')
    handleSpanClick(e) {
        this.spanClicked = true;
    }

    render() {
        return `Hello <span>${this.message}</span>!`;
    }
}

customElements.define(MyElementDecorators.is, MyElementDecorators);

let assert = chai.assert;

describe('FrameElement decorators', () => {
    let myElementInstance;

    beforeEach(done => {
        const myElement = document.createElement('my-element-decorators');
        myElementInstance = document.body.appendChild(myElement);
        done();
    });

    afterEach(done => {
        done();
    });

    it('Should set prop from Property decorator', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello <span>FrameJS</span>!');
            done();
        });
    });

    it('Should re-render from Property decorator prop', done => {
        setTimeout(() => {
            myElementInstance.message = 'world';

            setTimeout(() => {
                assert.equal(myElementInstance.shadowRoot.innerHTML, 'Hello <span>world</span>!');
                done();
            });
        });
    });

    it('Should set property type from Reflect meta', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.constructor.propTypes.happy, Boolean);
            done();
        });
    });

    it('Should reflect as dom attribute if set with @Attribute', done => {
        setTimeout(() => {
            assert.equal(myElementInstance.hasAttribute('happy'), true);
            done();
        });
    });

    it('Should should run @Observe method on property change', done => {
        setTimeout(() => {
            myElementInstance.happy = false;

            setTimeout(() => {
                assert.equal(myElementInstance.newHappyValue, false);
                done();
            });
        });
    });

    it('Should run event listener on element click', done => {
        setTimeout(() => {
            myElementInstance.click();

            setTimeout(() => {
                assert.equal(myElementInstance.elementClicked, true);
                done();
            });
        });
    });

    it('Should run event listener on span in shadowRoot click', done => {
        setTimeout(() => {
            const el = myElementInstance.shadowRoot.querySelector('span');
            el.click();

            setTimeout(() => {
                assert.equal(myElementInstance.spanClicked, true);
                done();
            });
        });
    });

    it('Should emit event from @Event', done => {
        setTimeout(() => {
            myElementInstance.addEventListener('myEvent', e => {
                assert.equal(e.detail, 'FrameJS');
                done();
            });
            myElementInstance.click();
        });
    });
});
