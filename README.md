[![pipeline status](https://gitlab.com/stefcameron/rtvjs/badges/master/pipeline.svg)](https://gitlab.com/stefcameron/rtvjs/commits/master) [![codecov](https://codecov.io/gl/stefcameron/rtvjs/branch/master/graph/badge.svg)](https://codecov.io/gl/stefcameron/rtvjs)

# RTV.js

Runtime Verification Library for browsers and Node.js.

This library is isomorphic: It runs equally well in modern browsers and on the server with Node.js.

The latest versions of major browsers, and maintained Node.js releases, are supported.

[Give it a test drive with RunKit!](https://npm.runkit.com/rtvjs)

# Installation

```bash
npm install rtvjs
```

The package's `./dist` directory contains 3 types of builds:

*   `rtv.js`: CJS (for use by bundlers)
*   `rtv.esm.js`: ESM (for use by bundlers)
*   `rtv.umd[.dev].js`: UMD (for use in browsers, self-contained)

> Both the CJS and ESM builds depend on [@babel/runtime](https://babeljs.io/docs/en/babel-runtime) and [lodash](https://lodash.com/), and require defining the `process.env.NODE_ENV` to either `"development"` or `"production"`. Both builds rely on the consumer's bundler to do the final bundling and tree shaking.
>
> The UMD 'dev' build is the equivalent of defining `process.env.NODE_ENV = "development"`.

## CJS

The CJS build can be used like this, typically in Node.js, or with a bundler like Webpack or Rollup:

```javascript
const rtv = require('rtvjs');
```

Make sure you have also installed the following (peer) dependencies:

-   [@babel/runtime](https://babeljs.io/docs/en/babel-runtime)
-   [lodash](https://lodash.com/)

Also make sure you set `process.env.NODE_ENV = "development"` if you want to enable the dev code it contains (e.g. deprecation warnings). To exclude the dev code, set `process.env.NODE_ENV = "production"` (or any value other than `"development"`).

Use the [Webpack Define Plugin](https://webpack.js.org/plugins/define-plugin/) or the [Rollup Replace Plugin](https://www.npmjs.com/package/@rollup/plugin-replace), for example, to configure this in your build.

## ESM

The ESM build can be used like this (note a default export is not provided):

```javascript
import * as rtv from 'rtvjs'; // import all into an `rtv` namespace
import { verify, STRING, ... } from 'rtvjs'; // selective imports only
```

> The CJS considerations above also apply to this build (externals and environment).

## UMD

The UMD build comes in two files:

-   `./dist/rtv.umd.dev.js`: For development. Non-minified, and includes dev code such as deprecation warnings (if any).
-   `./dist/rtv.umd.js`: For production. Minified, and excludes any dev code.

Use it like this:

```javascript
// as a CommonJS module (e.g. Node.js)
const rtv = require('./dist/rtv.umd.js'); // OR: `./dist/rtv.umd.dev.js`

// as an AMD module (e.g. RequireJS)
define(['rtvjs'], function(rtv) {
});

// as a global, when loaded via a <script> tag in HTML
window.rtvjs;
```

This is a self-contained build optimized for browsers.

# Documentation

This `README`, as well as the [API](API.md), are hosted at [rtvjs.stefcameron.com](https://rtvjs.stefcameron.com/api).

# Changes

[Changelog](CHANGELOG.md)

# Purpose

To provide an easy, intuitive way to perform validations at __runtime__ on values whenever they cross the boundaries of an API or a function call.

Tools like [TypeScript](http://www.typescriptlang.org/) and [Flow](https://flow.org/) are useful for static analysis (i.e. as code is being written and then transpiled to regular JavaScript), but [they come at a price](https://medium.com/javascript-scene/the-typescript-tax-132ff4cb175b) and they don't work at __runtime__.

For example, they can't signal when there are integration issues between frontend and backend systems that are being co-developed. In one conversation, an API may be designed to return an object with certain properties. Later on, an on-the-fly decision to alter the implementation (yes, it happens in spite of the best intentions and processes), or simply a bug in the implementation, may result in an object that is missing an expected property, or has a property with an unexpected value.

Let's consider a case where a "state" property, which is really an enumeration of string values, ends-up set to an unexpected state. What should a client do with an unexpected state when there's no implementation to back it up? Ignoring it could be an option, but perhaps not the best course of action. Even worse, the unexpected state _somehow_ could trickle deep down into code before it finally causes an exception, making it really difficult to find the true source of the problem.

RTV.js can help signal the unexpected state by failing early, right at the API boundary:

```javascript
async function getTodoList() {
  const response = await fetch('/api/todos');
  const json = await response.json();

  // verify (require) that the response be a list of TODO items: this function
  //  will throw if `json` doesn't meet the specified typeset (requirement)
  rtv.verify(json, [[{ // list of objects (could be empty)
    // non-empty string
    title: rtv.STRING,
    // 'YYYY-MM-DD', or null
    due: [rtv.EXPECTED, rtv.STRING, {exp: '\\d{4}-\\d{2}-\\d{2}'}],
    // string (could be empty), null, or not even defined
    note: [rtv.OPTIONAL, rtv.STRING]
  }]]);

  return json;
}
```

There may also be a need to ensure that a critical function call is being given the parameters it expects. Rather than write a series of `if (!state) { throw new Error('state is required'); }` (which don't tell us much about what "state" is expected to be, other than it's _required_), it would be more helpful to have an easy way to express that "state" should be a non-empty string with a value in a given list (i.e. a value found in an enumeration).

RTV.js can help signal the unexpected state immediately when execution enters the function:

```javascript
function applyState(state) {
  rtv.verify(state, [rtv.STRING, {oneOf: ['on', 'off']}]);

  if (state === 'on') {
    // turn the lights on
  } else {
    // turn the lights off
  }
}

applyState('on'); // ok
applyState('dimmed'); // ERROR
```

While tools like TypeScript and Flow have their merits, [they come at a price](https://medium.com/javascript-scene/the-typescript-tax-132ff4cb175b). Typings or not, integration issues __will__ remain. RTV.js allows you to check for types __at runtime__, when it _really_ matters, and has a simple API so it's easy to learn.

# Goals

The following statement verifies that the variable "state" is a non-empty string whose value is found in a list of permitted values:

```javascript
rtv.verify(state, [rtv.STRING, {oneOf: ['on', 'off']}]);
```

The `[rtv.STRING, {oneOf: ['on', 'off']}]` portion of the example above is called a _typeset_. It expresses the expectation for the value of the "state" variable.

[Typesets](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.typeset) must be:

*   Easy to express, using rich [types](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvreftypes-object) and [qualifiers](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvrefqualifiers-object).
*   Composable, whereby complex typesets can be built by combining multiple typesets into larger ones.
*   Easy to customize, using [custom validators](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#typescustom_validator-function) when the existing types and arguments don't provide the exact verification needed on a value.
*   Intuitive, using simple native JavaScript language constructs like strings (for types), inline Arrays `[]` for lists and complex typesets, and inline objects `{}` for [shapes](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.shape_descriptor) (i.e. _interfaces_).
*   [Serializable](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#json-serialization) to JSON via `JSON.stringify()` so they can be easily transferred between systems.
    *   Backend and frontend systems in JavaScript stacks could dynamically inform one another of expectations by sharing typesets.
    *   Similar to the `@context` property of a JavaScript Object for [JSON-LD](https://json-ld.org/), an object's expected [shape](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.shape_descriptor) could be transferred along with the object itself.
    *   With the exceptions of [custom validator](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#typescustom_validator-function) functions and the `ctor` property of [shape object arguments](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.shape_object_args).

# Tutorials

Tutorials and example uses of the RTV.js library.

## Getting Started

To make it clear, in this tutorial, which properties and functions from RTV.js, we'll start by importing everything into an `rtv` object:

```javascript
import * as rtv from 'rtvjs';
```

You could also drop the object and import individual names, such as:

```javascript
import { check, verify, STRING, ... } from 'rtvjs';
```

### Checks and Verifications

RTV.js provides two functions for verifying values against [typesets](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.typeset). A _typeset_ is simply a set of one or more types that form an expectation about the value:

```javascript
rtv.verify(value, typeset); // will throw an error if verification fails
rtv.check(value, typeset); // returns the error instead of throwing it
```

### Simple Types

Typesets can be strings, objects (shapes), functions (custom validators), or Arrays (multiple possibilities).

At their simplest, typesets are strings that represent type names like `STRING`, `INT`, `DATE`, etc. See the full list of types [here](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.types).

```javascript
rtv.verify('Hello world!', rtv.STRING); // ok
rtv.verify('', rtv.STRING); // ERROR: a required string cannot be empty
```

### Qualifiers

The first verification succeeds because the value is a non-empty string. The second one fails because the typeset uses the default [qualifier](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.qualifiers.qualifiers), which is `REQUIRED`. A _required_ string cannot be empty (nor can it be `null` or `undefined`).

In some implementations, an empty string is considered a bad value because it's a _falsy_ value in JavaScript, just like `null`, `undefined`, `false`, `0`, and `NaN`.

There are 3 other qualifiers, `EXPECTED`, `OPTIONAL`, and `TRUTHY`. A typeset may only have one qualifier, and it must be specified before any types.

The only way to specify an alternate qualifier is to use an Array to describe the typeset: `[<qualifier>, types...]`

If we wanted to accept an empty string (or `null`) as the value, we could use the `EXPECTED` qualifier:

```javascript
rtv.verify('Hello world!', [rtv.EXPECTED, rtv.STRING]); // ok
rtv.verify('', [rtv.EXPECTED, rtv.STRING]); // ok
rtv.verify(null, [rtv.EXPECTED, rtv.STRING]); // ok
```

If we had a variable which we expect to be an object whenever it's value is _truthy_, we could use the `TRUTHY` qualifier, which would permit any _falsy_ value, but require the value to be of a specified type otherwise:

```javascript
let objectOrFalsy = false;
rtv.verify(objectOrFalsy, [rtv.TRUTHY, rtv.PLAIN_OBJECT]); // ok

objectOrFalsy = {hello: 'world!'};
rtv.verify(objectOrFalsy, [rtv.TRUTHY, rtv.PLAIN_OBJECT]); // ok
rtv.verify(objectOrFalsy, [rtv.TRUTHY, rtv.ARRAY]); // ERROR: value is not an array

// similar to how the following code would either print "world!" or not get executed
//  depending on the truthiness of `objectOrFalsy`
if (objectOrFalsy) {
  console.log(objectOrFalsy.hello);
}
```

### Type Arguments

Some types accept arguments. Arguments are simple objects that map argument names to values, and immediately follow a type in a typeset. Once again, an Array must be used to describe the typeset. Type arguments are optional, unless otherwise stated; some types don't accept arguments.

The `STRING` type accepts [arguments](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.STRING_args), one of which is `min`. It lets us specify the minimum length of the string. By default, when the qualifier is `REQUIRED`, `min` defaults to 1, but we can override that:

```javascript
rtv.verify('Hello world!', [rtv.STRING, {min: 0}]); // ok
rtv.verify('', [rtv.STRING, {min: 0}]); // ok
rtv.verify(null, [rtv.STRING, {min: 0}]); // ERROR
```

This verifies the value cannot be `null` or `undefined` because of the (implied) `REQUIRED` qualifier. However, it could be empty because the `min` argument allows a zero-length string as the value.

### Multiple Types

So far, we've seen simple typesets: Either just a string as the type name, or the type name and some arguments, and an optional qualifier that precedes it. There may be cases where a value could be one of multiple types. To verify against additional types, an Array is used to state all the possibilities: `[<qualifier>, <type1>, <type1-args>, <type2>, <type2-args>, ...]`. This is called an "Array typeset", which we've already seen in the two previous sections.

Since a value can only be of a single type at any given time, Array typesets are evaluated using a __short-circuit OR conjunction__, which means the verification will pass as long as at least one type verifies the value (and verification will stop evaluating any other types against the value once a match is made).

For example, we could verify that a value is either a boolean, or a string that looks like a boolean:

```javascript
const typeset = [rtv.BOOLEAN, rtv.STRING, {
  exp: '^(?:true|false)$',
  expFlags: 'i'
}];
rtv.verify(true, typeset); // ok
rtv.verify('true', typeset); // ok
rtv.verify('True', typeset); // ok
rtv.verify('TRUE', typeset); // ok
rtv.verify(false, typeset); // ok
rtv.verify('false', typeset); // ok
```

> Since the check for the `BOOLEAN` type is faster than evaluating a regular expression against a string, we list the `BOOLEAN` type first in the typeset.

It's worth pointing out here that:

> The same type can appear __multiple times__ in the same typeset.

This is very useful when a value could be of one or another set of values.

For example, we could verify that a value is a finite number in two different ranges:

```javascript
const typeset = [
  rtv.FINITE, {min: 0, max: 9},
  rtv.FINITE, {min: 100, max: 199}
];
rtv.verify(1, typeset); // ok
rtv.verify(50, typeset); // ERROR
rtv.verify(150, typeset); // ok
rtv.verify(-1, typeset); // ERROR
rtv.verify(200, typeset); // ERROR
```

This is also useful for _composition_ where you need to combine multiple smaller typesets into a larger one:

```javascript
const lowerRangeTs = [rtv.FINITE, {min: 0, max: 9}];
const upperRangeTs = [rtv.FINITE, {min: 100, max: 199}];
const typeset = [...lowerRangeTs, ...upperRangeTs];
rtv.verify(1, typeset); // ok
rtv.verify(50, typeset); // ERROR
```

`typeset` here will yield the same results as in the previous example.

### Shapes

Most of the time, especially when integrating with an API, you'll want to verify what you receive against an expected [shape](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.shape_descriptor). A _shape_ describes the __interface__ an __object__ is expected to have. As the term implies, an interface describes the properties, and types thereof, expected on an object while ignoring any other properties that the object may have (since the code using this object shouldn't care about them anyway).

Plain JavaScript objects are used to describe shapes, where expected property names are own-enumerable properties mapped to typesets. For example, we could describe a simple TODO item like this:

```javascript
{
  title: rtv.STRING, // non-empty string
  created: rtv.DATE, // Date instance
  priority: rtv.INT // some whole number
}
```

Since typesets are fully nestable/composable, we can get a bit more sophisticated by using Array typesets so we can provide arguments and different qualifiers:

```javascript
{
  title: rtv.STRING, // required (non-empty) title
  created: [rtv.OPTIONAL, rtv.DATE], // either a TODO or just a note
  priority: [rtv.INT, {oneOf: [0, 1, 2]}] // 0=none, 1=low, 2=high
}
```

Since shapes also represent objects, they have an _implied_ (default) type of [OBJECT](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.OBJECT). When [fully-qualified](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.fully_qualified_typeset) (which means not using any implied typeset elements like the qualifier and type), the shape would __move into the special `$` argument__ of the `OBJECT` type:

```javascript
[rtv.REQUIRED, rtv.OBJECT, {$: {
    title: rtv.STRING,
    created: [rtv.OPTIONAL, rtv.DATE],
    priority: [rtv.INT, {oneOf: [0, 1, 2]}]
  }
}]
```

When the default object type is sufficient, it's really easy to nest shapes. Let's say our TODO item also had a note, which is an object with "text" and "updated" properties:

```javascript
const {STRING, DATE, INT} = rtv;
const {EXPECTED, OPTIONAL} = rtv;

const item = {
  title: 'Make Christmas Oatmeal',
  due: new Date('12/25/2018'),
  priority: 1,
  note: {
    text: 'Make 4 cups to have enough to share!',
    updated: new Date('09/21/2018')
  }
};

rtv.verify(item, {
  title: STRING,
  created: [OPTIONAL, DATE],
  priority: [INT, {oneOf: [0, 1, 2]}],
  note: {         // <- nested shape
    text: STRING, // <- required contents
    updated: DATE // <- required Date
  }
}); // ok
```

The typeset above would require a TODO item to have a "note" with a non-empty string value for "text", and a `Date` instance for "updated". We could make the entire note optional, however, by _expecting_ it to be either `null` if a note wasn't provided, or the shape if one was:

```javascript
const {STRING, DATE, INT} = rtv;
const {EXPECTED, OPTIONAL} = rtv;

const item = {
  title: 'Make Christmas Oatmeal',
  due: new Date('12/25/2018'),
  priority: 1,
  note: null
};

rtv.verify(item, {
  title: STRING,
  created: [OPTIONAL, DATE],
  priority: [INT, {oneOf: [0, 1, 2]}],
  note: [EXPECTED, { // <- null, or note object
    text: STRING,
    updated: DATE
  }]
}); // ok
```

> When the default object type is implied, this is called the _shorthand syntax_. For shapes, it may be used when the typeset is the shape itself, or in an Array typeset that is _not_ [fully-qualified](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.fully_qualified_typeset), when a qualifier immediately precedes the shape (as we've done above for the "note" property).

### Lists

Many times, an API response or a function's arguments will contain a list of values or objects. At their most basic, lists are simple JavaScript Arrays that contain values of some type. The simplest way to verify a list is homogenous is to use the _shorthand_ syntax for the [ARRAY](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.ARRAY) type:

```javascript
[[rtv.STRING]]
```

This would verify that an Array contains non-empty string values, but the Array could be __empty__, given the default [arguments](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.ARRAY_args).

> __Note the nested Array.__

What the example above defines is an Array typeset that has a single _implied_ `ARRAY` type with an element typeset of `STRING` that will be applied to all elements found in the Array.

When the __full notation__ is used, the element typeset __moves into the `$` argument__:

```javascript
[rtv.ARRAY, {$: [rtv.STRING]}] // same as before, but in full notation
```

Either form is acceptable, and either form can show-up anywhere in a typeset. Therefore, we could verify a value is either a boolean, an Array of non-empty strings, or an Array of integers like this:

```javascript
[rtv.BOOLEAN, [rtv.STRING], [rtv.INT]]
```

A more practical example could be requiring a TODO item to have a non-empty list of notes associated with it, if "notes" isn't `null`, meaning there are no notes (i.e. either "notes" is `null` because there are no notes, or "notes" is an Array of note objects containing at least one note):

```javascript
const {STRING, DATE, INT} = rtv;
const {EXPECTED, OPTIONAL} = rtv;

const item = {
  title: 'Make Christmas Oatmeal',
  due: new Date('12/25/2018'),
  priority: 1,
  note: null
};

const shape = {
  title: STRING,
  created: [OPTIONAL, DATE],
  priority: [INT, {oneOf: [0, 1, 2]}],
  note: [EXPECTED, ARRAY, { // <- null, or non-empty Array of notes
    $: {
      text: STRING,
      updated: DATE
    },
    min: 1 // <- require a non-empty Array when not null
  }]
};

rtv.verify(item, shape); // ok

item.notes = [];

rtv.verify(item, shape); // ERROR: `notes` cannot be empty

item.notes.push({
  text: 'Make 4 cups to have enough to share!',
  updated: new Date('09/21/2018')
});

rtv.verify(item, shape); // ok
```

### Custom Validations

Finally, there may be occasions where a type, or even its arguments, aren't sufficient to verify the value. In that case, the typeset can be customized with a [custom validator](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.custom_validator) function.

> The function on its own is considered a valid typeset, and gets an _implied_ type of [ANY](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.ANY), which validates _anything_, even `undefined` and `null`, regardless of the qualifier.

Let's say we wanted to verify that a value is a multiple of two. None of the [numeric type arguments](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.numeric_args) will verify that on their own, so we would need a custom validator:

```javascript
function validator(value) {
  const n = parseInt(value);
  return (!IsNaN(n) && n % 2 === 0);
}

rtv.verify(2, validator); // ok
rtv.verify(3, validator); // ERROR
```

A custom validator can fail the verification either by returning a _falsy_ value (other than `undefined`), or throwing an `Error`. When a _falsy_ value is returned, a default `Error` will be generated. Throwing an error with a helpful message is the recommended way to fail verification because of a custom validator:

```javascript
function(value) {
  const n = parseInt(value);
  if (IsNaN(n) || n % 2 != 0) {
    throw new Error('Not a number, or not a multiple of two.');
  }
}

rtv.verify(2, validator); // ok
rtv.verify(3, validator); // ERROR (rootCause: 'Not a number...')
```

> The error thrown by the custom validator (or the one generated by the library) will be included in the [rootCause](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.RtvError+rootCause) property of the failed verification results.

Custom validators are intended to be used as _compliments_ to existing types rather than complete replacements. For example, rather than worry about parsing the value as an integer and checking to see if it's not a number, we could let RTV.js first verify the value is an [integer](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.INT) by using an Array typeset:

```javascript
const typeset = [rtv.INT, (v) => v % 2 === 0];

rtv.verify(2, typeset); // ok
rtv.verify(3, typeset); // ERROR (rootCause: 'Verification failed...')
```

An Array typeset may have at most __one__ custom validator, and it must be the __last__ element. Each sub-typeset may have its own validator. When one or more types are in the typeset, the validator is immediately invoked if one of the types matches (i.e. verifies) the value (any remaining types are ignored):

```javascript
const typeset = [rtv.INT, rtv.STRING, (v) => v % 2 === 0];

// in both cases, STRING verification is skipped because INT matches first
rtv.verify(2, typeset); // ok
rtv.verify(3, typeset); // ERROR (rootCause: 'Verification failed...')
```

Finally, we could enhance our TODO item verification with a custom validator that verifies the `created` Date is not in the past:

```javascript
const {STRING, DATE, INT} = rtv;
const {EXPECTED, OPTIONAL} = rtv;

const item = {
  title: 'Make Christmas Oatmeal',
  due: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
  priority: 1,
  note: null
};

const shape = {
  title: STRING,
  created: [
    OPTIONAL,
    DATE,
    (v) => !v || v.getTime() >= Date.now()) // <- validator
  ],
  priority: [INT, {oneOf: [0, 1, 2]}],
  note: [EXPECTED, ARRAY, {
    $: {
      text: STRING,
      updated: DATE
    },
    min: 1
  }]
};

rtv.verify(item, shape); // ok

item.due = new Date(Date.now() - 12 * 60 * 1000); // 12 hours ago

rtv.verify(item, shape); // ok
```

> Notice how the validator must handle `null` and `undefined` values because of the [OPTIONAL](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.qualifiers.OPTIONAL) qualifier, and is careful to return a _truthy_ result so that the property remains _optional_.

## Configuration

RTV.js provides a [configuration](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtv.config) interface which allows [checks](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtv.check) (`rtv.check(value, typeset)`) and [verifications](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtv.verify) (`rtv.verify(value, typeset)`) to be globally enabled or disabled:

```javascript
rtv.config.enabled = false; // default: true

rtv.verify('foo', rtv.INT); // no-op, always returns RtvSuccess
rtv.check('foo', rtv.INT); // no-op, always returns RtvSuccess
```

But why even make the call at all?

```javascript
if (rtv.config.enabled) {
  rtv.verify('foo', rtv.INT);
}

// OR more terse:

rtv.config.enabled && rtv.verify('foo', rtv.INT);

// OR with your own global:

DO_TYPE_CHECKS && rtv.verify('foo', rtv.INT);
```

Now, a JavaScript bundler that supports _tree shaking_ (e.g. Webpack or Rollup) can be configured to completely _exclude_ the entire code for a build. This could be handy if you're concerned about script download size over runtime checks, say, in a production build. See the [Rollup example](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#enabled-example-rollup) for more information.

## Verifications

Let's say we're building a simple TODO app. We might use the following object as representative of a "todo" item in a list:

```javascript
const item = {
  title: 'Make Christmas Oatmeal',
  due: new Date('12/25/2018'),
  priority: 1,
  notes: [
    {
      text: 'Ingredien$: Cranberries, apples, cinnamon, walnuts, raisins, maple syrup.',
      updated: new Date('09/20/2018')
    },
    {
      text: 'Make 4 cups to have enough to share!',
      updated: new Date('09/21/2018')
    }
  ]
};
```

We can describe this object using two [shapes](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.shape_descriptor):

```javascript
const {STRING, DATE, INT} = rtv;
const priorities = [1, 2, 3, 4]; // simple enumeration of priority levels

const shapes = {
  get todo() { // 'todo' shape
    return {
      title: STRING,
      due: DATE,
      priority: [INT, {oneOf: priorities}], // use 'priorities' enum
      notes: [[this.note]] // compose 'note' shape into this 'todo' shape
    };
  },
  get note() { // 'note' shape
    return {
      text: STRING,
      updated: DATE
    };
  }
};
```

Now we can verify that "todo" is a valid TODO item:

```javascript
rtv.verify(item, shapes.todo);
```

The above verification will pass because "todo" meets the requirements of the shape.

Now let's change the second note in "todo" such that its "updated" property is a boolean, `true` (a simple indication that the note was changed _at some point_ -- a change that seems to make sense, but would break code that expects a `Date` object to use for formatting in the UI, for example):

```javascript
todo.notes[1].updated = true;
```

Lexically, there's no reason for this assignment to fail, but the boolean value violates what is stated in the spec for a TODO item.

If we were to run the same verification again, __an exception would be thrown__. The exception would be an [RtvError](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.RtvError) with the following properties:

```javascript
rtv.verify(item, shapes.todo);

// RtvError exception thrown from the above statement:
{
  message: 'Verification failed: path="/notes/1/updated", mismatch=["!","DATE"], typeset={"title":"STRING","due":"DATE","priority":["INT",{"oneOf":[1,2,3,4]}],"notes":[[{"text":"STRING","updated":"DATE"}]]}',
  path: ['notes', '1', 'updated'], // path to the property that failed verification
  mismatch: ['!', 'DATE'], // fully-qualified typeset that caused the failure
  typeset: {...}, // reference to "shapes.todo"
  value: {...}, // reference to "todo"
  ...
}
```

The `cause` property is providing us with the [fully-qualified](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.fully_qualified_typeset) version of the nested typeset that caused the failure. The original typeset simply specified `DATE` as the nested typeset for the `note.updated` property.

In reality, all typesets have a [qualifier](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.qualifiers), and the default qualifier is `'!'` which means the value is _required_. Required values can neither be `undefined` nor `null`. Depending on the type, other restrictions may be imposed, such as the [STRING](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.STRING) type, which must also not be empty (by default).

For brevity, typesets don't always have to be fully-qualified since the default qualifier is implied when not specified. Note that a typeset must have exactly __one__ qualifier, implied or not, but each nested typeset may have its own qualifier.

For example, some TODO items may not have due dates. However, our shape currently requires them. To handle this requirement, we could alter the nested typeset of the `todo.due` property to be `['*', DATE]` This would state that the `due` property is _expected_ rather than _required_, which means its value could be `null` (but still not `undefined`). There is a third qualifier, `'?'`, which would indicate the value is _optional_, in which case it could also be `undefined` (which, in JavaScript terms, means the property could also not even exist anywhere up the prototype chain of the `todo` object).

The `RtvError` object can also be obtained without catching an exception thrown by using the `rtv.check()` method:

```javascript
rtv.check(item, shapes.todo); // returns the RtvError object
```

If the check was successful, an [RtvSuccess](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvrefrtvsuccess) would be returned instead. Since both `RtvError` and `RtvSuccess` objects have a common `valid: boolean` property, it's easy to check for success and failure:

```javascript
if (rtv.check(item, shapes.todo).valid) {
  // check passed, "todo" is valid!
} else {
  // check failed, ignore the item
}
```

Finally, we can check simple values too:

```javascript
rtv.verify('1', rtv.INT); // ERROR: not an integer number
rtv.verify('', [rtv.EXPECTED, rtv.STRING]); // ok: expected strings can be null/empty
```

## Dynamic Classes

This is an advanced use of the RTV.js library. I recommend you read through the [Getting Started](#getting-started) guide or the [Verifications](#verifications) example first.

Let's suppose we have the following [shape](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.shape_descriptor) that describes a simple note:

```javascript
const {STRING, DATE} = rtv; // some types
const {EXPECTED} = rtv; // some qualifiers
const tags = ['car', 'money', 'reminder', 'grocery'];

const noteShape = {
  // required, non-empty string
  text: STRING,
  // required Array (could be empty) of non-empty tags names from the user's
  //  list of "tags"
  tags: [[STRING, {oneOf: tags}]],
  // required Date when the note was created
  created: DATE,
  // expected date of update (either null, or Date)
  updated: [EXPECTED, DATE]
};
```

Based on this shape, we can dynamically define a JavaScript class with getters and setters that ensure they are being set correctly:

```javascript
const classGenerator = function(shape) {
  const ctor = function(initialValues) {
    // by definition, a shape descriptor is made-up of its own-enumerable
    //  properties, so we enumerate them
    const props = Object.keys(shape);

    const typesets = {}; // prop -> fully-qualified Array typeset
    const values = {}; // prop -> value

    let initializing = true; // true while we apply "initialValues"

    props.forEach((prop) => {
      typesets[prop] = rtv.fullyQualify(shape[prop]);

      Object.defineProperty(this, prop, {
        enumerable: true,
        configurable: true, // could be false to lock this down further
        get() {
          return values[prop];
        },
        set(newValue) {
          const typeset = typesets[prop].concat(); // shallow clone

          if (initializing) {
            // allow each property to be initially null, or as the typeset specifies
            //  so we don't end-up with junk data
            // NOTE: in a fully-qualified typeset, the qualifier is always the
            //  first element
            typeset[0] = EXPECTED;
          }

          // we assume there are no interdependencies between nested typesets
          // this verification will throw an RtvError if the "newValue"
          //  violates the property's typeset
          rtv.verify(newValue, typeset);

          values[prop] = newValue;
        }
      });

      if (initialValues && initialValues.hasOwnProperty(prop)) {
        // go through the setter for verification
        this[prop] = initialValues[prop];
      } else {
        // initialize to null
        values[prop] = null;
      }
    });

    initializing = false;
  };

  return ctor;
};
```

Now we can generate a Note class and create an instance:

```javascript
const Note = classGenerator(noteShape);
const note = new Note({text: 'Hello world!'});

note.text; // "Hello world!", since it was initialized
note.created; // null, since it wasn't initialized
note.text = ''; // ERROR: "text" must be a non-empty string
```

## Reactive Validations

### originalValue

Let's revisit the Note shape from the [Dynamic Classes](#dynamic-classes) example, but we'll add one more property, `tagCount`:

```javascript
const {STRING, DATE, SAFE_INT} = rtv; // some types
const {EXPECTED} = rtv; // some qualifiers
const tags = ['car', 'money', 'reminder', 'grocery'];

const noteShape = {
  // required, non-empty string
  text: STRING,
  // required Array (could be empty) of non-empty tags names from the user's
  //  list of "tags"
  tags: [[STRING, {oneOf: tags}]],
                                                       //
  tagCount: SAFE_INT,                                  // <- NEW
                                                       //
  // required Date when the note was created
  created: DATE,
  // expected date of update (either null, or Date)
  updated: [EXPECTED, DATE]
};
```

The `tagCount` property should always be an integer equal to the length of the `tags` array. The most basic validation we could do is the above: Mark it as a `SAFE_INT`. The problem is, it's not a complete validation because the following Note would pass, however __it would still be invalid__:

```javascript
const note = {
  text: 'Buy potatoes',
  tags: ['reminder', 'grocery'],
  tagCount: 1,                    // <- does not match length of `tags` array
  created: new Date(Date.now()),
  updated: null
}

rtv.verify(note, noteShape); // ok (but not ok...)
```

To address this issue, we can use the `context` parameter provided to any [custom validator](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#typescustom_validator-function) since it provides a reference to the `originalValue` being validated:

```javascript
const noteShape = {
  ...,

  // tagCount: SAFE_INT,                             // <- BEFORE

  tagCount: [
    SAFE_INT,
    (value, match, typeset, context) => {            // <- AFTER
      if (value !== context.originalValue.tags.length) {
          throw new Error('tags and tagCount mismatch');
      }
    }
  ],
  ...
};
```

The first parameter, `value`, is the value of the `tagCount` property being validated by the [typeset](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.types.typeset) in which the custom validator is located. The fourth parameter, `context`, provides some additional information such as the original value, that being the Node object itself (the `note` object given to `rtv.verify(note, typeset)`).

```javascript
rtv.verify(note, noteShape); // ERROR: 'tags and tagCount mismatch'
```

With this change, we now have a _reactive validation_, since it reacts (or adjusts) according to some of the data its given.

### parent and parentKey

`originalValue`, however, may not always be sufficient because it never changes regardless of the hierarchy of objects being validated. Let's say we wanted to validate a __list__ of notes:

```javascript
rtv.verify([note], [[noteShape]]); // ERROR: 'cannot read property "length" of undefined'
    // (because `originalValue` is the array and does not have a `tags` property,
    // so `originalValue.tags.length` causes an exception)
```

This is where `parent` (and `parentKey`) are handy: `parent` will always refer to the immediate enclosing `Object`, `Array`, `Map`, or `Set`, whenever a property or element _within_ it is being validated. `parentKey` will be the property or index, depending on `parent`'s type, whose _value_ is being validated. See [custom validator context](https://gitlab.com/stefcameron/rtvjs/blob/master/API.md#rtvref.validator.type_validator_context) for more details on these two properties.

Therefore, we can change our typeset to this:

```javascript
const noteShape = {
  ...,
  tagCount: [
    SAFE_INT,
    (value, match, typeset, context) => {
      // if (value !== context.originalValue.tags.length) {    // <- BEFORE
      if (value !== context.parent.tags.length) {              // <- AFTER
          throw new Error('tags and tagCount mismatch');
      }
    }
  ],
  ...
};
```

And now the validation works again:

```javascript
rtv.verify([note], [[noteShape]]); // ok!
```

# Alternatives

RTV.js is not your only choice for runtime verification of values. Here are some alternatives you should consider. Compare them to what this library offers and choose the best one to fit your needs!

*   [Joi](https://github.com/hapijs/joi) offers object schema validation. In the _hapi ecosystem_, this is commonly paired with [Hoek](https://github.com/hapijs/hoek). Note that `Joi` is __only supported in Node.js__ environments.
*   [prop-types](https://github.com/facebook/prop-types) is useful __if you're building a React app__, but you can't get it to fail on purpose (it's React's support for it that causes errors in the console at runtime in a development build).
*   [yup](https://github.com/jquense/yup) is useful if you want to __validate an object schema__ (and can be a viable alternative to `Joi` which is only supported on Node.js since `yup` is also supported in the browser).

    While it has similarities to RTV.js, the picture is very different in practice: Yup has a concept of _coercions and transformations_ such that, for instance, `yup.string().required().validateSync(1)` would __not__ fail. Even if `strict` mode is enabled (for which there's no global setting; that would be on a per-statement basis), there are cases where it would still pass! [You wouldn't be the only one concerned with this](https://github.com/jquense/yup/issues/54) (and it's never been resolved, which is fine since `yup` isn't strictly focused on exact types for validations).

    RTV.js, on the other hand, is __specially designed to validate values against exact types, no implicit type coercions or transformations__. It's either a string or it's not. That's what's needed for type validation. Otherwise, (IMO) it's useless, in terms of validation, because you can't be certain of what you have (e.g. if `"1"` and `1` were the same, would `value.substr()` _always_ work...?).

# Contributing

[Contributing](CONTRIBUTING.md), including local development guide.

# License

[MIT](LICENSE)

# Future

See the list of proposed [enhancements](https://gitlab.com/stefcameron/rtvjs/issues?label_name%5B%5D=enhancement). Up-vote the ones you like to help contributors prioritize them!

Feel free to log an __enhancement__ if you have an idea! You may also file a PR, although it might be best to discuss your idea with the community first by creating an enhancement issue.
