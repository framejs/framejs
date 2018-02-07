## @framejs/renderer-preact

FrameJS rendererer for [Preact](https://preactjs.com/).

## Install

```sh
$ npm install @framejs/core @framejs/renderer-preact preact
```

## Usage

```tsx
import { CustomElement } from '@framejs/core';
import { withPreact } from '@framejs/renderer-preact';
import { h } from 'preact';

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