## @framejs/renderer-preact

FrameJS rendererer for [Preact](https://preactjs.com/).

## Install

```sh
$ npm install @framejs/core @framejs/renderer-preact
```

## Usage

```tsx
import { CustomElement } from '@framejs/core';
import { withPreact, h } from '@framejs/renderer-preact';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends withPreact(HTMLElement) {
    @Attribute() checked = true;

    render() {
        return <div>Am i checked? {this.checked ? 'Yup' : 'Nope'}</div>
    }
}
```