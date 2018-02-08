## @framejs/renderer-lit-html

FrameJS rendererer for [lit-html](https://github.com/Polymer/lit-html).

`lit-html` is a great templating extension when working with complex elements.
Read more about [lit-html](https://github.com/Polymer/lit-html).

## Install

```sh
$ npm install @framejs/core @framejs/renderer-lit-html
```

## Usage

```ts
import { CustomElement } from '@framejs/core';
import { withLitHtml, html } from '@framejs/renderer-lit-html';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends withLitHtml(HTMLElement) {
    render() {
        return html`I\m so lit!`;
    }
}
```