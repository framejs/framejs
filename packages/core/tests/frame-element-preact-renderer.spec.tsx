// import { FrameElement } from '../src/frame-element.js';
// import { withPreact, h } from '../../renderer-preact/dist/index.js';

// let assert = chai.assert;

// class MyElementPreactRenderer extends withPreact(FrameElement) {
//     static is = 'my-element-preact-renderer';

//     static props = {
//         message: 'Hello'
//     };

//     render() {
//         return (
//             <h1>{this.props.message} FrameJS!</h1>
//         );
//     }
// }

// customElements.define(MyElementPreactRenderer.is, MyElementPreactRenderer);

// describe('FrameElement Preact renderer', () => {
//     let myElementInstance;

//     beforeEach(done => {
//         const myElement = document.createElement('my-element-preact-renderer');
//         myElementInstance = document.body.appendChild(myElement);
//         done();
//     });

//     afterEach(done => {
//         done();
//     });

//     it('Should render template using preact', done => {
//         setTimeout(() => {
//             assert.equal(myElementInstance.shadowRoot.innerHTML, '<h1>Hello FrameJS!</h1>');
//             done();
//         });
//     });
// });
