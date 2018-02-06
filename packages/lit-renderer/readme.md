## @framejs/lit-renderer

FrameJS rendererer for [lit-html](https://github.com/Polymer/lit-html).

`lit-html` is a great templating extension when working with complex elements.
Read more about [lit-html](https://github.com/Polymer/lit-html).

## Install

```sh
$ npm install @framejs/core @framejs/lit-renderer
```

## Usage

Extend `LitRenderer` instead of `HTMLElement` to get all it offers.

> It's important to use `html` string literal function as it converts the literal to lit-html.

```ts
import { CustomElement } from '@framejs/core';
import { LitRenderer, html } from '@framejs/lit-renderer';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends LitRenderer {
    render() {
        return html`I\m so lit!`;
    }
}
```