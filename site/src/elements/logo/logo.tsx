import {Define, FrameElement} from '@framejs/core';

@Define({
    tag: 'frjs-logo',
    style: require('./logo.scss').toString()
})
class Logo extends FrameElement {
    render() {
        return `<slot></slot>`
    }
}