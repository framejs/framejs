import {Define, FrameElement} from '@framejs/core';

@Define({
    tag: 'frjs-label',
    style: require('./label.scss').toString()
})
class Label extends FrameElement {
    render() {
        return `<slot></slot>`
    }
}