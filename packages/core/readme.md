# @framejs/Core

## Get started
Install from NPM:
```sh
npm install @framejs/core
```

## Decorators

### @CustomElement({tag: string, style?: string, shadow?: boolean = true, mode?: 'open' | 'closed'})
The main decorator that holds state provides a renderer (this is needed in order to use the rest of the decorators).

To manually run the renderer use: `this._invalidate();`

To auto-render on `@Attr` and `@Prop` changes set `this._renderOnPropertyChange = true`.
This should only be done with a smart renderer function. it's enabled by default when extending LitRenderer.

```ts
import { CustomElement } from '@framejs/core';

@CustomElement({
    tag: 'my-element',
    style: ':host { color: blue; }'
})
class MyElement extends HTMLElement {
    render() {
        return `Hello World!`;
    }
}
```

### @Attribute() [property]: string | boolean | number
Decorates the element with an attribute setter and getter and updates state/render on change. Updating the property from within the element or externally will update the attribute in the rendered HTML and the other way around.

Providing a default value will set the attribute when the element is ready. If the attribute is already set by the user, the default will be overwritten.

```ts
import { CustomElement, Attribute } from '@framejs/core';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Attribute() target: string = 'World!'

    render() {
        return `Hello ${this.target}`;
    }
}
```

### @Property() [property]: any
Decorates the element with a property setter and getter and updates state/render on change.
This value will not be reflected in the rendered HTML as an attribute.

```ts
import { CustomElement, Property } from '@framejs/core';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Property() data: string[] = ['Hello', 'world!'];

    render() {
        return `
            ${data.map(word => {
                return word;
            }).join(' ')}
        `;
    }
}
```

### @Observe(property: string) Function(oldValue: any, newValue: any)
The function provided will get triggered when the property changes with the old and new value.

```ts
import { CustomElement, Property, Observe } from '@framejs/core';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Property() data: string[] = ['Hello', 'world!'];

    @Observe('data')
    dataChangedHandler(oldValue, newValue) {
        // Do something with the new data entry
    }

    render() {
        return `
            ${data.map(word => {
                return word;
            }).join(' ')}
        `;
    }
}
```

### @Event() [property]: EventEmitter
Creates a simple event emitter.

```ts
import { CustomElement, Emit, EventEmitter } from '@framejs/core';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Emit() isReady: EventEmitter;

    connectedCallback() {
        this.isReady.emit('my-element is ready!')
    }
}
```

### @Listen(event: string, target?: window | document) Function
Listens for events and executes the nested logic.

```ts
import { CustomElement, Listen } from '@framejs/core';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Listen('click')
    clickedOnInstanceHandler(event) {
        console.log(event)
    }

    @Listen('resize', window)
    windowResizeHandler(event) {
        console.log(event)
    }
}
```

It's also possible to listen for events from child elements

```ts
import { CustomElement, Listen } from '@framejs/core';
import './my-other-element';

@CustomElement({
    tag: 'my-element'
})
class MyElement extends HTMLElement {
    @Listen('onOtherElementClicked')
    onOtherElementClickedHandler(event) {
        console.log(event)
    }

    render() {
        return `
            // my-other-element emits an customEvent called 'onOtherElementClicked'.
            <my-other-element></my-other-element>
        `;
    }
}
```

## Using @framejs/renderer-preact

FrameJS rendererer for [Preact](https://preactjs.com/).

### Install

```sh
$ npm install @framejs/core @framejs/renderer-preact preact
```

### Usage

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

## Using lit-html renderer

FrameJS rendererer for [lit-html](https://github.com/Polymer/lit-html).

`lit-html` is a great templating extension when working with complex elements.
Read more about [lit-html](https://github.com/Polymer/lit-html).

### Install

```sh
$ npm install @framejs/core @framejs/renderer-lit-html lit-html
```

### Usage

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

## Write a custom renderer
The built in renderer is very simple: it receives the returned value, and replaces innerHTML with the new template when updated.

This example shows how `LitRenderer` is written.

```ts
import { render } from 'lit-html/lib/lit-extended';

export class LitRenderer extends HTMLElement {
    // Set _renderOnPropertyChange if the renderer
    // should render on every @Property/@Attribute change.
    public _renderOnPropertyChange = true;

    renderer(template, _root) {
        render(template(), _root);
    }
}
```

## Polyfills

For more information on the polyfills, see the [web components polyfill documentation](https://github.com/webcomponents/webcomponentsjs).