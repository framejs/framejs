[![Build Status](https://dev.azure.com/emilrmoeller/framejs/_apis/build/status/framejs.framejs)](https://dev.azure.com/emilrmoeller/framejs/_build/latest?definitionId=1)

# FrameJS

Welcome to FrameJS! This documentation tries to help answer any questions you may have about what FrameJS is, how to use it and what its APIs are.

### A web component library for building reusable elements
Build encapsulated elements that manage their own state, then reuse them in any web project to make complex UIs.
With its small size (~1.5kb gzipped) it fits well for simple elements as well as for complex components.

### Why FrameJS?
FrameJS tries to make it easy and safe to build UI elements you can use across projects and frameworks.

It doesn't rely on specific build pipelines or compilers, so it fits right into existing projects. It supports and provides decorators for Typescript, using JSX and other templating languages. And you can choose to use features like shadow dom and rendering per element as fits.

It won't stop you from using any existing techniques for custom elements. Its purpose is to aid you as a developer by providing tested functionality and speed up your work.

## Try FrameJS

Try FrameJS online or set up your local development environment.

### Online
If you’re interested in playing around with FrameJS, you can use an online code playground. Try a Hello World template on [Stackblitz](https://stackblitz.com/edit/framejs?file=index.js)

Other Hello World templates on stackblitz:
* [FrameJS + lit-html](https://stackblitz.com/edit/framejs-lit-html?file=index.js)
* [FrameJS + preact](https://stackblitz.com/edit/framejs-preact?file=index.js)
* [FrameJS + preact + typescript](https://stackblitz.com/edit/framejs-typescript-preact?file=index.tsx)

Demos on stackblitz:
* [todo-app (FrameJS + typescript + Preact)](https://stackblitz.com/edit/framejs-typescript-preact-todo-example?file=framejs-todo.tsx)

### Local development

#### Prequisitions

Make sure you've installed and/or updated Node before continuing.

It's recommended for setting up tools to bundle and minify for production. A modern build pipeline typically consists of:

* A package manager, such as Yarn or NPM. It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.

* A bundler, such as Webpack or Browserify. It lets you write modular code and bundle it together into small packages to optimize load time.

> The custom elements API dictates elements to we written as es6 classes. A good practice is to let a consumer application transform the code to es5, or compile to both. The browser runtime cannot mix es5 and es6 custom elements.

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

#### Polyfills

For more information on the polyfills, see the [web components polyfill documentation](https://github.com/webcomponents/webcomponentsjs).

## Examples

These examples expect that you are using a module bundler of some kind.

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

Properties are available as `this.props[property]`, `this[property]` and [destructuring](#user-content-access-element-properties-and-methods-from-destructuring)

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
Event listeners are added on connectedCallback and removed on disconnectedCallback.

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
        return html`
            <style>${this.constructor.style}</style>
            Hello World!`;
    }
}

customElements.define('hello-world', HelloWorld);
```

> You should not set `<style>` in the template if you are using VDOM like [renderer-preact](https://github.com/framejs/framejs/blob/master/packages/renderer-preact/src/index.ts)

### Example: Custom element without shadow dom
```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get shadow() {
        return false;
    }
}

customElements.define('hello-world', HelloWorld);
```

### Example: Custom element with custom shadow mode
```js
import { FrameElement } from '@framejs/core';

class HelloWorld extends FrameElement {
    static get shadowMode() {
        return 'closed';
    }
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

> If you are unsure about the typescript configuration, take a look at the [tsconfig.json](https://github.com/framejs/framejs/blob/master/packages/core/tsconfig.json) used in FrameJS.

## Using a renderer
### Using lit html renderer

[lit-html example on Stackblitz](https://stackblitz.com/edit/framejs-lit-html?file=index.js)


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
To be able to use JSX you need to either use babel (output to es6) or typescript. This example is using typescript with `--jsx --jsxFactory h`.

[Preact example on Stackblitz](https://stackblitz.com/edit/framejs-preact?file=index.js)

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

## Write a custom renderer
The built-in renderer is very simple: it receives the returned value and replaces innerHTML with the new template when updated.

See the code for [renderer-preact](https://github.com/framejs/framejs/blob/master/packages/renderer-preact/src/index.ts) for implementation details.
