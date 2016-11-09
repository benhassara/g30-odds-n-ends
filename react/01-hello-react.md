# First React App

Rather than getting heavy into configuration, we'll use the `create-react-app` tool from Facebook to get up and running with a boilerplate structure for a React SPA. Start by installing `create-react-app`:

```sh
npm i -g create-react-app
```

Then, move to a directory that you want to store your app in, and run `create-react-app`:


```sh
create-react-app hello-react
```

This will take a few minutes, but when it's done you should `cd` into the created "hello-react" directory, and then run `npm start`. A browser window should open up and show you something like this:

![react](../img/hello-react.png)


## Boilerplate

Before we start editing, let's look at what we have and talk about how React is doing its thing.

### `public/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

This file has the same role as `index.html` in an Angular 1 application. It declares the basic markup structure for the page, and we create a `div` that will be the mounting point for the React application. In Angular, we'd usually make this an `ng-view` or `ui-view`. With React, we give the element an `id` and use that to tell React where to mount our application.

### `src/index.js`

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

This file actually mounts the application to the `<div id="root"></div>` that is in `public/index.html`.

### `src/App.js`

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

This file defines the `App` component, and how it will render onto the page. This looks pretty weird. It's a JavaScript file with some stuff in it that looks like HTML. This syntax is called [JSX](https://facebook.github.io/react/docs/introducing-jsx.html), it compiles to regular JavaScript when we run it through [Babel](http://babeljs.io/), and essentially acts as syntactic sugar for the JavaScript Web API's that we use in the browser to create DOM elements.

For example, the first line of the `render` method here creates a div with JSX: `<div className="App">` will create the HTML element: `<div class="App">`. Notice that to set HTML class attributes, in JSX you use `className` rather than `class`. This avoids the conflict between the JavaScript `class` keyword and the DOM attribute. Most of the time, you can use the same attribute name in JSX that you would in HTML. However, there are some exceptions like `class`.


The rest of the files in the boilerplate are simply assets and styling.

## Exercise:

Let's add another element to the page with React.

1. Create a new file inside of `src` called `Name.jsx`.
1. Use the code inside of `App` as a guide, and create a new component that renders your name into a `div`.
1. Import `Name` into `App`, and add your `Name` component to the `render` method.
1. Reload the page, and if your name shows up, you've just made your first React component!

## Passing Data with Props

Now you've got a `Name` component rendering a name to the page, but what if we want the `Name` component to render any name that we pass to it? Right now, we don't have any way to do that, the name is hard-coded. Luckily, we've got [props](https://facebook.github.io/react/docs/components-and-props.html). We can use `props` to pass data from a parent component, down to a child component. Let's modify our `Name` component to render a string based on its props, rather than hard-coding a value.

#### `App.js`

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Name from './Name';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        // give Name a prop
        <Name name="Big Bird"/>
      </div>
    );
  }
}

export default App;
```

Notice the difference in how the `Name` component is used now. Rather than simply using `<Name />`, we assign it a prop of `name` by changing it to: `<Name name="Big Bird" />`. We need to make a few more changes in `Name.jsx` in order to make this functionality work.

#### `Name.jsx`

```jsx
import React, { Component } from 'react';

class Name extends Component {
  render() {
    // reference the name prop rather than display a hard-coded value
    return <div>{this.props.name}</div>;
  }
}

export default Name
```

Now when you reload the page, the string that you passed to the `Name` component should be rendered. You're working with props! One important thing to note about props is that they should always be treated as **read-only**. This is true across React. Never directly modify props!

## Interactivity with `state`

When we're using Angular 1, our `ng-models` use two-way data-binding to propagate model changes from our code to the view, and from the view back to the code. React breaks this, and uses one-way data-binding. This means that the view is entirely dependent on the model, and that only model updates will be propagated to the view. View updates are _not_ propogated back to the model. This means we need to tell React how aspects of our UI can interact with the app's state and change it. To do this, we use a components *state*.

How this works in practice:

1. A component is created with some initial state.
1. After a render, we can modify the component's internal state with `this.setState`.
1. A change to the component's state, tells React to refire `render`. This re-renders the component with the new `state` values.

With that information in mind, let's look at how we work with `state` to create an interactive component.

### `App.js`

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Name from './Name';

class App extends Component {
  // add the constructor
  // call Component's constructor with props first - you MUST do this
  // if your component has a constructor, it must call super(props), or this.props will be undefined
  // use it to set states initial value
  constructor(props) {
    super(props);
    this.state = {name: 'Big Bird'};
  }

  // simple event handler for the input's onchange event
  changeName(e) {
    this.setState({name: e.target.value});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {/* add the input */}
          {/* give it an onChange prop, that takes the event's handler function */}
          <input type="text" value={this.state.name} onChange={this.changeName.bind(this)}></input>
        </div>
        {/* pass the name value from the state to Name */}
        <Name name={this.state.name}/>
      </div>
    );
  }
}

export default App;
```

Breaking it down:

1. Create a constructor for the `App` component class. Use the constructor to set up the component's initial state. Remember to always call `super(props)` side of a class that extends `Component`. If you have a constructor and don't do this `this.props` will always be undefined.
1. Write an event handler function that we can attach to the input's `onChange` event. Rather than directly modifying `this.state` (which is a big no-no), we use `this.setState` to interact with the component's state.
1. Attach the handler function to the input by attaching it to the `onChange` prop.
1. Rather than passing a string to the `name` prop of the `Name` component, we give it a reference to `this.state.name`. Now whenever we call `this.setState` and change the name key the value passed to the `Name component changes, and the DOM rerenders.

Now when you type into the input box, you should see the text underneath it update as you type. Now you're working with state!

## Review Questions

1. How do Angular and React treat data-binding differently?
1. What are props? How do we use them?
1. What is state? How do we use it?
