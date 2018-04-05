# FrameJS

Welcome to FrameJS! This documentation is created to help answer any questions you may have about what FrameJS is, how to use it and what its APIs are.

### A web component library for building reusable elements
Build encapsulated elements that manages their own state, then reuse them in any web project to make complex UIs.
With it's small size (~1.5kb gzipped) it fits well for simple elements as well as for complex components.

### Why FrameJS?
FrameJS was created to solve design and UI implementations across multiple projects and frameworks, not only to share style, but to share the experience of well crafted UI.

An element created using FrameJS is just a regular web component, but with the magic of automatic updates on properties and attributes changes and helpful features to make the custom elements API an enjoyable experience to use.

## Try FrameJS

Try FrameJS online or set up your local development environment.

### Online
If you’re just interested in playing around with FrameJS, you can use an online code playground. Try a Hello World template on [Stackblitz](https://stackblitz.com/edit/framejs?file=index.js)

Other Hello World templates on stackblitz:
* [FrameJS + lit-html](https://stackblitz.com/edit/framejs-lit-html?file=index.js)
* [FrameJS + preact](https://stackblitz.com/edit/framejs-preact?file=index.js)
* [FrameJS + preact + typescript](https://stackblitz.com/edit/framejs-typescript-preact?file=index.tsx)

### Local development

#### Prequisitions

FrameJS requires a recent LTS version of NodeJS and npm. Make sure you've installed and/or updated Node before continuing.

While FrameJS is just Javascript (es6) it can be built without a build pipeline, but it's recommended to setting up tools to bundle and minify for production. A modern build pipeline typically consists of:

* A package manager, such as Yarn or npm. It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.

* A bundler, such as webpack or Browserify. It lets you write modular code and bundle it together into small packages to optimize load time.

> Web components only works in es6 natively, and es5 and es6 components cannot be mixed in the same runtime, so you should ship components as es6 modules, and let the consumer application compile to es5 if needed.

#### Usage

Install with npm

```sh
npm install @framejs/core
```

```javascript
// hello-world.js
import { FrameElement } from './node_modules/@framejs/core/dist/frame-element.js';

class HelloWorld extends FrameElement {
  render() {
    return `<h1>Hello World!</h1>`
  }
}

customElements.define('hello-world', HelloWorld);
```
```html
<!-- index.html -->
<hello-world></hello-world>
<script type="module" src="./hello-world.js">
```

> The default render function replaces innerHTML, and it's recommended to use an advanced renderer like the [lit-html renderer](https://github.com/framejs/framejs/tree/master/packages/renderer-lit-html) or [preact renderer](https://github.com/framejs/framejs/tree/master/packages/renderer-preact). See [examples on stackblitz](https://stackblitz.com/@emolr)

## Examples

These examples expects that you are using a module bundler of some kind.

### Using lit html renderer

```sh
npm install @framejs/renderer-lit-html
```
```javascript
import { FrameElement } from '@framejs/core';
import { withLitHtml, html } from '@framejs/renderer-lit-html';

class HelloWorld extends withLitHtml(FrameElement) {
    render() {
        return html`<h1>Hello World!</h1>`
    }
}

customElements.define('hello-world', HelloWorld);
```

### Using preact renderer
To be able to use JSX you need to either use babel (output to es6) or typescript. This examples are using typescript with `--jsx --jsxFactory h` .

```sh
npm install @framejs/renderer-preact
```
```tsx
import { FrameElement } from '@framejs/core';
import { withPreact, h } from '@framejs/renderer-preact';

class HelloWorld extends withPreact(FrameElement) {
    render() {
        return <h1>Hello World!</h1>
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Callback after first render and on destroy

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    elementDidMount() {
        console.log('Hello!');
    }

    elementDidUnmount() {
        console.log('Bye!')
    }

    render() {
        return `Hello World!`
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Using properties

Properties are available as `this.props[property]`, `this[property]` and [destructuring](user-content-access-element-properties-and-methods-from-destructuring)

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get props() {
        return {
            greeting: 'Hello World!'
        }
    }

    static get propTypes() {
        return {
            greeting: String
        }
    }

    render() {
        return `${this.props.greeting}`;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Using attribute reflections
This sets the attribute `greeting="Hello World!"` on the element. 
Changing the attribute on the element updates the `prop` and triggers are re-render.

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get props() {
        return {
            greeting: 'Hello World!'
        };
    }

    static get propTypes() {
        return {
            greeting: String
        };
    }

    static get reflectedProps() {
        return ['greeting'];
    }

    render() {
        return `${this.props.greeting}`;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Using Prop Observers
Prop observers are running every time a specified prop changes

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get props() {
        return {
            greeting: 'Hello World!'
        };
    }

    static get propTypes() {
        return {
            greeting: String
        };
    }

    static get propObservers() {
        return {
            greeting: '_greetingObserver'
        };
    }

    _greetingObserver(oldValue, newValue) {
        console.log(oldValue, newValue)
    }

    render() {
        return `${this.props.greeting}`;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Using event listeners
Event listeners get added on connectedCallback and removed on disconnectedCallback.

The syntax for a listener is:
* `'Event'` - event listener on element
* `'Event:#child` - event listener on child element. the string after `:` is used for selecting the element.

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get props() {
        return {
            greeting: 'Hello World!'
        };
    }

    static get propTypes() {
        return {
            greeting: String
        };
    }

    static get eventListeners() {
        return {
            'click': '_handleClick',
            'click:#myButton': '_handleButtonClick'
        };
    }

    _handleClick(event) {
        console.log(event, 'element clicked!')
    }

    _handleButtonClick(event) {
        console.log(event, 'button clicked!')
    }

    render() {
        return `${this.props.greeting} <button id="myButton">Click me!</button>`;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Setting style that supports ShadyCSS if polyfill is loaded and needed

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get style() {
        return `
            :host {
                color: dodgerBlue;
            }
        `;
    }

    render() {
        return `Hello World!`;
    }
}

customElements.define('hello-world', HelloWorld);
```

> If you aren't using [preact renderer](https://github.com/framejs/framejs/tree/master/packages/renderer-preact) you need to add style to the render function to ensure the style to be loaded correctly on every render cycle and initially available for ShadyCSS.

```js
import { FrameElement } from '@framejs/core';
import { withLitHtml, html } from '@framejs/renderer-lit';

class HelloWorld extends FrameElement {
    static get style() {
        return `
            :host {
                color: dodgerBlue;
            }
        `;
    }

    render() {
        return html`
            <style>${this.constructor.style}</style>
            Hello World!`;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Custom element without shadow dom
```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    _shadow = false;
}

customElements.define('hello-world', HelloWorld);
```

### Example: Prevent re-render on prop changes

Manually trigger re-render by using `this.invalidate();`

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    _invalidateOnPropChanges = false;
}

customElements.define('hello-world', HelloWorld);
```

### Access element properties and methods from Destructuring
`this` is passed to render(), but you can still reference them manually via `this`.

```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get props() {
        return {
            greeting: 'Hello'
        }
    }
    
    render({ greeting }) {
        return `${greeting} World!`
    }
}

customElements.define('hello-world', HelloWorld);
```


## Extentions for typescript
It's possible to use type reflection if loading the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata) polyfill, alternatively pass in type to `@Attribute({type: String})`;

`@Attribute()` automatically gets reflected as attributes and can be of type: `String` | `Boolean` | `Number`.

`@Attribute() myProp: String;` will be set as attribute `my-prop`;

```tsx
import { 
    Define, 
    FrameElement,
    Property,
    Attribute,
    Listen,
    Observe,
    Event,
    EventEmitter
} from '@framejs/core';

@Define({
    tag: 'hello-world',
    style: `:host { color: dodgerBlue; }`,  // optional
    shadow: true,                           // default true
    mode: 'open',                           // default 'open'
    invalidateOnPropChanges: true           // default true
})
class HelloWorld extends FrameElement {
    @Property() greeting: String = 'Hello';
    @Attribute() target: String = 'World'!
    @Event() targetChanged: EventEmitter;
    @Observe('target')
    _handleTargetChange(oldValue, newValue) {
        this.targetChanged.emit(newValue);
    }
    @Listen('click')
    _handleClick(event) {
        console.log('clicked!')
    }
}
```

> If you are unsure about the typescript configuration, take a look at the [tsconfig.json](https://github.com/framejs/framejs/blob/vanillajs/packages/core/tsconfig.json) used in FrameJS.

## Write a custom renderer
The built in renderer is very simple: it receives the returned value, and replaces innerHTML with the new template when updated.

See the code for [renderer-preact](https://github.com/framejs/framejs/blob/master/packages/renderer-preact/src/index.ts) for implementation details.

## Polyfills

For more information on the polyfills, see the [web components polyfill documentation](https://github.com/webcomponents/webcomponentsjs).