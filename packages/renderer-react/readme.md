## @framejs/renderer-react

FrameJS rendererer for [React](https://reactjs.org/).

## Install

```sh
$ npm install @framejs/core @framejs/renderer-react react
```

## Usage

```tsx
import { CustomElement } from '@framejs/core';
import { withReact } from '@framejs/renderer-preact';
import React from 'react';

class ReactHello extends React.Component {
  render() {
    const { children, yell } = this.props;
    return <div>Hello, {yell ? <strong>{children}</strong> : children}!</div>;
  }
}

@CustomElement({
    tag: 'my-element'
})
class MyElement extends withReact(HTMLElement) {
    @Attribute() checked = true;

    render() {
        return <ReactHello yell={true}>ReactJS</ReactHello>
    }
}
```