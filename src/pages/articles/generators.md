---
slug: "/articles/betas/generators"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
---

In this article I will teach you basically everything there is to know about generators in JavaScript - what they are, how to use them and - as usual - all the intricacies involved.

This article doesn't assume *any* previous knowledge about generators, but it does assume a very solid knowledge of iterables and iterators in JavaScript. If you don't know iterables/iterators, or don't really feel confident using them, make sure to check out my previous article, which covers them in depth.

Learned about iterables and iterators? Awesome! You are ready to dive into the world of generators. It is a strange, strange world, where many things are completely different to what you are used to in a regular JavaScript code. 

But the actual mechanism is very simple, and after reading this article you will feel confident in your capability to write clean code with generators without any bugs or rookie mistakes.

So, let's get started!

## Motivation

"But why would I even want to learn about using generators?" - you might ask.

And that's a very fair question. Indeed, generators are still a fairly exotic feature, not used very commonly in most of the codebases.

But there *are* problems which can be solved with generators surprisingly elegantly. And indeed, in my next article I will show you how to combine generators with React to create code that is highly superior to typical hooks code. This, hopefully, will inspire you to seek your own use-cases for generators.

But don't think that generators are still somehow "experimental". There is a lot of projects used in production codebases that lean on generators heavily. 

I guess the most popular in the React world is `react-saga` package, which is a middleware for Redux, allowing you to write side effects code which is extremely readable and extremaly testable at the same time (which doesn't happen that often!). 

I hope that those examples convinced you that it is absolutely worth learning generators. Are you now excited to study them? So let's do it!

## Introduction

If I was tasked with explaining generators only in one sentence, I would probably write - "it is a syntax sugar for producing iterators". Of course this doesn't even come close to covering everthing that generators are and can do, but it is not very far from the truth.

Let's take a basic, regular function, simply returning a number:

```js
function getNumber() {
    return 5;
}
```

If we were to type it using TypeScript, we would add that it returns a `number` type:

```ts
function getNumber(): number {
    return 5;
}
```

In order to change a function into a generator function, we just need to add a `*` sign after the `function` keyword:

```js
function* getNumber(): number {
    return 5;
}
```

Altough if you were to do that in TypeScript, the compiler would start to complain. Indeed, a generator function doesn't simply return a value that is returned in it's body. 

It instead returns an iterator!

Indeed, if you were to type this code in the following way:

```ts
function* getNumber(): Iterator<number> {
    return 5;
}
```

TypeScript compiler will allow that, without any issues.

But that's TypeScript. Let's test if `function*` really returns us an iterator in pure JavaScript.

We can do that for example by trying to call `next` on the "thing" returned from our function:

```js
const probablyIterator = getNumber();

console.log(probablyIterator.next());
```

This not only works, but it also logs `{ value: 5, done: true }` to the console.

It's actually very reasonable behavior. In a sense, a function *is* an iterable, that just returns one value and then is finished.

But would it be possible to return multiple values from a generator function? 

The first thing that might've come to your mind is to use multiple returns:

```js
funciton* getNumber() {
    return 1;
    return 2;
    return 3;
}
```

Now this looks like a blasphemy for someone used to regular functions. But I told you, we are in a completely different world now! Everything is possible.

However... this doesn't work. Let's run it:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

You will see the following result in the console:

```js
{ value: 1, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So we only got our first value, an after that the iterator is stuck in it's "done" state. Interestingly the returned value is accesible only one time to use - further `next` calls just return `undefined` as value.

This is however not such a bad thing, because it still obeys a common rule in functions - `return` always stops executing the function body. This is true also for generator functions.

But *there is* a way to "return" mutiple values from our iterator. Exactly for that purpose the keyword `yield` was introduced. Let's try that:

```js
function* getNumber() {
    yield 1;
    yield 2;
    yield 3;
}
```

Now let's run our code again:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

A success! Now we get the following result:

```js
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
```

So indeed, yielding values in a generator, allows you to create an iterator that will return multiple values.

What happens if we call `next` method more times after that? It behaves like any typical iterator, by returning a `{ value: undefined, done: true }` object.

Note now that the last line in our generator is also a `yield`. Would it make any difference if we changed it to a `return`? Let's check

```js
function* getNumber() {
    yield 1;
    yield 2;
    return 3; // note that we used a `return` here!
}

const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

This code outputs:

```js
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: true }
```

Hmm. Interesting. So it does basically the same thing, but the `done` property gets set to `true` one step earlier.

You should remember that `done` property in returned object basically decides wether the `for ... of` loop should continue running or not. 

So let's check how our two version of `getNumber` generator behave with `for ... of ` loops.

First let's run the iterator with 3 yields:

```js
function* getNumber() {
    yield 1;
    yield 2;
    yield 3;
}

const iterator = getNumber();

for (let element of iterator) {
    console.log(element);
}
```

After running this code, we get:

```js
1
2
3
```

No suprises really, that's how an iterator should behave.

Now let's do the same but for a generator with 2 yields one 1 return:

```js
function* getNumber() {
    yield 1;
    yield 2;
    return 3; // only this line changed
}

const iterator = getNumber();

for (let element of iterator) {
    console.log(element);
}
```

What we get:

```js
1
2
```

Huh. Very curious. But if you think about it, this is really just how the iterators behave with the `for ... of ` loop. The `done` property decides wether the next iteration step should be ran or not.

Since if we use `return` in our generator, we will get a `{ value: 3, done: true }` object on the third call, meaning - the `for ... of` loop will run only twice, when the `done` was set to `false`.

So the rule is fairly simple - do you want a value to appear in a `for ... of` loop? `yield` it!

Do you want to return it from a generator, but not include it in a iteration? `return` it!

## An iterator is more than just next()...
