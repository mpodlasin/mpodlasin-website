---
slug: "/articles/generators-i"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: "Part I - Basics"
---

<iframe class="youtubeVideo" src="https://www.youtube.com/embed/tF-NUY_wwtE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In this series I will teach you basically everything there is to know about generators in JavaScript - what they are, how to use them, and - as usual - all the intricacies involved. And as always, we will begin with some basics, to give you an overview of what the generators are.

This series doesn't assume *any* previous knowledge about generators. However, it does assume a very solid knowledge of iterables and iterators in JavaScript. If you don't know iterables/iterators, or don't really feel confident using them, make sure to check out my [previous article](/articles/iterables-and-iterators), which covers them in-depth.

Know the prerequisites? Awesome! You are ready to dive into the world of generators. It is a strange, strange world, where many things are completely different from what you are used to in a regular JavaScript code. 

But the actual mechanism is very simple, and even after reading this first article, you will feel confident in your capability to actually use generators by yourself.

So let's get started!

## Motivation

"But why would I even want to learn about using generators?" - you might ask.

And that's a very fair question. Indeed, generators are still a fairly exotic feature, not used very commonly in most of the codebases.

But there *are* problems which can be solved with generators surprisingly elegantly. And indeed, in the next article, I will show just such an example. And after we master the generators, we will actually try to combine them with React to create code that is highly superior to "hooks-only" code. This, hopefully, will inspire you to seek your own use-cases for generators.

But don't think for a second that generators are still somehow "experimental". There are a lot of projects used in production codebases that lean on generators heavily. 

I guess the most popular in the React world is [redux-saga](https://redux-saga.js.org/) package, which is a middleware for Redux, allowing you to write side effects code that is extremely readable and extremely testable at the same time (which doesn't happen that often!). 

I hope that this convinced you that it is absolutely worth learning generators. Are you now excited to study them? Let's do it then!

## Introduction

If I was tasked with explaining generators in only one sentence, I would probably write - "it is a syntax sugar for producing iterators". Of course, this doesn't even come close to covering everything that generators are and can do. But it is not very far from the truth.

Let's take a basic, regular function, simply returning a number:

```js
function getNumber() {
    return 5;
}
```

If we were to type it using TypeScript, we would say that it returns a `number` type:

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

But if you really were to do that in TypeScript, the compiler would start to complain. Indeed, a generator function doesn't simply return a value that is being returned in its body. 

It instead returns an iterator!

If you would change the typings this way:

```ts
function* getNumber(): Iterator<number> {
    return 5;
}
```

TypeScript compiler would allow that without any issues.

But that's TypeScript. Let's test if `function*` really returns an iterator in pure JavaScript.

We can check it for example by trying to call the `next` method on the "thing" returned from the generator:

```js
const probablyIterator = getNumber();

console.log(probablyIterator.next());
```

This not only works but it also logs `{ value: 5, done: true }` to the console.

It's actually very reasonable behavior. In a sense, a function is an iterable that just returns one value and then is finished.

But would it be possible to return multiple values from a generator function? 

The first thing that might've come to your mind is to use multiple returns:

```js
function* getNumber() {
    return 1;
    return 2;
    return 3;
}
```

Now, this looks like blasphemy for someone used to regular functions. But I told you, we are in a completely different world now! Everything is possible.

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

So we only got our first value, and after that, the iterator is stuck in it's "done" state. Interestingly the returned value is accessible only one time for us - further `next` calls just return `undefined`.

And this behavior is actually very reasonable. It obeys a basic rule true for *all* functions - `return` always stops executing the function body, even if there is some code after the `return` statement. This is true also for generator functions.

But *there is* a way to "return" multiple values from our generator. Exactly for that purpose the keyword `yield` was introduced. Let's try that:

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

So yielding values in a generator allows you to create an iterator that will return multiple values.

What happens if we call the `next` method more times after that? It behaves like any typical iterator by always returning a `{ value: undefined, done: true }` object.

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
{ value: 3, done: true }  // now done is true here!
```

Hmm. Interesting. So it does basically the same thing, but the `done` property gets set to `true` one step earlier.

You probably remember that the `done` property in the returned object basically decides whether the `for ... of` loop should continue running or not. 

So let's check how our two versions of the `getNumber` generator behave with `for ... of ` loops.

First let's run the version with 3 yields:

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

No surprises really, that's how an iterator should behave.

Now let's do the same but for a generator with 2 yields and 1 return:

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

Huh. Very curious. But if you think about it, this is really just how iterators behave with the `for ... of ` loop. The `done` property decides whether the next iteration step should be run or not.

Take a look at how in the iterables article we simulated the `for ... of` loop with a `while`:

```js
let result = iterator.next();

while (!result.done) {
    const element = result.value;

    console.log(element);

    result = iterator.next();
}
```

In that code, if you would get a `{ value: 3, done: true }` object from the `iterator.next()` call, the 3 would also never appear in the console. 

That's because before `console.log(element)` gets called, we first have a `!result.done` condition. Since this condition is false for the `{ value: 3, done: true }` object, `while` body would not be executed for the number 3.

And `for ... of` loops works in exactly the same way.

So the rule is fairly simple - do you want a value to appear in a `for ... of` loop? `yield` it!

Do you want to return it from a generator, but not include it in a `for ... of` iteration? `return` it!

## Control flow in generators

At this point, we must clarify that in a generator function you can use all the typical control flow constructions.

For example, you might choose which number to yield based on an argument passed to the generator:

```js
function* getNumber(beWeird) {
    yield 1;

    if(beWeird) {
        yield -100;
    } else {
        yield 2;
    }

    yield 3;
}
```

Calling `getNumber(false)` will create an iterator that returns numbers: 1, 2, 3.

Calling `getNumber(true)` will create an iterator that returns numbers: 1, -100, 3.

Not only that, you can even use loops in generators! And that's actually where their real power comes in.

In our iterables article, we've created an infinite iterator, which was generating numbers 0, 1, 2, 3, ... - up to infinity. It wasn't too difficult, but it also wasn't the most readable code ever.

Now we can do that with a generator in just few simple lines:

```js
function* counterGenerator() {
    let index = 0;

    while(true) {
        yield index;
        index++;
    }
}
```

We simply start with an `index` set to 0. We then run an infinite `while(true)` loop. In that loop, we `yield` current `index` and then we simply bump that `index` by one. This way, in the following step, `index` will be yielded with a new value.

Beautifully simple, right?

This is the exact example that literally blew my mind when I was first learning generators. I hope that it blows your mind as well, at least a little bit.

Just look how far we've come - we were used to functions that can only ever return a single value. And now we are writing a function that "returns" basically... forever!

## Sending values to a generator

On those first, simple examples we've seen that we can use generators to create typical iterators.

But it turns out that an iterator returned from a generator is a bit strange. It allows you to... pass some values back to the generator as well!

Let's enhance our previous generator example:

```js
function* getNumber() {
    const first = yield 1;
    const second = yield 2;
    const third = yield 3;
}
```

As you can see, we are still simply yielding numbers from the generator, but we also assign to variables whatever those `yield <number>` expressions evaluate to.

Obviously, at the moment those variables are not used in any way. For the tutorial purposes, we will be simply logging them, but you could of course do with them whatever you want. 

We will also put an additional log at the very beginning of the function.

```js
function* getNumber() {
    console.log('start');

    const first = yield 1;
    console.log(first);

    const second = yield 2;
    console.log(second);

    const third = yield 3;
    console.log(third);
}
```

In the rest of this section, we will be running that exact generator multiple times. I would therefore advise you to copy this code somewhere, or just open this article again in a second browser tab. 

It will be *much* easier for you to understand what is happening if you look at this generator as often as possible while we run the examples!

So let's run this new generator just as we did the previous one.

```js
for (let element of getNumber()) {
    console.log(element);
}
```

What we get is:

```
start
1
undefined
2
undefined
3
undefined
```

I hope it's clear which logs come from the generator itself and which come from the `for ... of` loop. Just to make sure, here are the answers:

```
start          <- generator
1              <- loop
undefined      <- generator
2              <- loop
undefined      <- generator
3              <- loop
undefined      <- generator
```

So apparently `yield <number>` statements just evaluate to `undefined`. But we can change that!

To do that, we will have to abandon the `for ... of` loop and consume the iterator by hand.

Let's just call the `next` method of the iterator 4 times, to get our 3 numbers and the last object with `done` set to `true`. We will log every result coming from the `next` call.

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

After running that (with the generator unchanged), we get:

```
start
{ value: 1, done: false }
undefined
{ value: 2, done: false }
undefined
{ value: 3, done: false }
undefined
{ value: undefined, done: true }
```

So not much changed here - `undefined` values are still here. We just swapped numbers from a `for ... of` loop to logging whole objects coming from `next` calls.

Generators utilize in a smart way the flexibility of an iterator interface. After all, an iterator has to have a `next` method, returning an object of shape `{ done, value }`. But nobody said that this method can't accept some arguments! A `next` method that accepts some argument still obeys the interface, as long as it returns an object of expected shape! 

So let's see what happens when we pass some strings to those `next` calls:

```js
const iterator = getNumber();

console.log(iterator.next('a'));
console.log(iterator.next('b'));
console.log(iterator.next('c'));
console.log(iterator.next('d'));
```

After you run this, you'll finally see something else than `undefined` in the console:

```
start
{ value: 1, done: false }
b                                <- no more undefined
{ value: 2, done: false }
c                                <- no more undefined
{ value: 3, done: false }
d                                <- no more undefined
{ value: undefined, done: true }
```

Perhaps this result is surprising to you. After all, the first letter we've passed to the `next` was `a`. And yet we only see `b`, `c` and `d` here.

But it's actually fairly straightforward to see what is happening here if we do it step by step.

The rule is that a call to `next` causes the generator function to run until it encounters a `yield <some value>` call. When this call is encountered, the `<some value>` part gets returned from the `next` call (as a value in the `{ value, done }` object). From this moment on, the generator simply waits for another `next` call. The value passed to that *another* `next` call will become the value to which the whole `yield <something>` expression gets evaluated.

Let's see it step by step on our example generator.

When you call `next` the first time, it simply begins the execution of the generator function. In our case, this means that `console.log('start')` will get executed.

Indeed, running:

```js
const iterator = getNumber();

iterator.next('a');
```

results in the following:

```
start
```

In the generator function, after `console.log('start')`, we encounter the `yield 1` expression. As we've explained, number 1 here will become the value returned from that first `next` call that we have just made.

Indeed, you can wrap the `next` call in `console.log` to make sure that's true:

```js
const iterator = getNumber();

console.log(iterator.next('a'));
```

This now logs:

```
start
{ value: 1, done: false }
```

The 1 there is precisely what we yielded in the generator. 

And this point, the generator is suspended. Even the statement where we encountered `yield` - `const first = yield 1;` - did *not* get executed fully. After all, the generator doesn't know yet what the value of the `yield 1` part should be.

We will provide that value with our *next* `next` call:

```js
const iterator = getNumber();

console.log(iterator.next('a'));
iterator.next('b');
```

This will print:

```
start
{ value: 1, done: false }
b
```

So we see that the generator resumed execution and basically replaced `yield 1` with a value that we passed to the `next` call - `b` string.

To make sure you *really* understand what is happening, you can try to pass some other values at this point:

```js
const iterator = getNumber();

console.log(iterator.next('a'));
iterator.next('this is some other string, which we created for tutorial purposes');
```

This will (hopefully obviously to you now) print:

```
start
{ value: 1, done: false }
this is some other string, which we created for tutorial purposes
```

*You* are the one who decides here what `yield 1` will evaluate to.

So at this point we see, that our *first* `yield` expression uses the value provided in the *second* `next` call. This is crucial to understand in generators. 

Basically, when encountering a `yield <some value>`, the generator is saying: "in current `next` call I will return you a `<some value>`, but in the *next* `next` call please provide me as an argument what should I replace `yield <some value>` with".

And this actually means that the argument passed to the *first* `next` call will never be used by the generator. There is simply no point to provide it, so we will just remove it from our example:

```js
const iterator = getNumber();

console.log(iterator.next()); // no need to pass anything on the first `next` call
iterator.next('b');
```

After we've called `next` a second time, the generator continued to execute the code, until it encountered *another* `yield` statement - `yield 2`. Therefore number 2 gets returned from this `next` call as a value.

So this:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
```

prints this:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
```

What happens now? The generator does not know to what it should evaluate `yield 2` in the `const second = yield 2;` statement. So it just waits there, suspended, until you pass it another value in the `next` call:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
iterator.next('c');
```

This now logs:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
c
```

So after that third `next` call, code in the generator starts being executed again, until we encounter `yield 3`. So 3 will be the value returned from that call:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
console.log(iterator.next('c')); // we've added console.log here
```

This prints:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
c
{ value: 3, done: false }
```

Now the generator is suspended at the `const third = yield 3;` statement. We know what to do to make it running again - another `next` call with a value!

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
console.log(iterator.next('c'));
iterator.next('d'); // we've added another next call
```

This prints:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
c
{ value: 3, done: false }
d
```

And - because our generator doesn't how more `yield` statements in it - it doesn't have more values to return. It also runs till completion. 

That's why the last `{ done, value }` object from the `next` call, has no value in it and also notifies us that the iterator has finished.

So this code:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
console.log(iterator.next('c'));
console.log(iterator.next('d')); // we've added console.log here
```

Prints this:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
c
{ value: 3, done: false }
d
{ value: undefined, done: true }
```

And that's it! If this still seems confusing, you need to run this example by yourself, perhaps even a few times. 

Help yourself by adding those successive `next` and `console.log` calls step by step just like I did. Try also to always control in which line of the generator you currently are. Remember! You have to look at the generator code at each step to really understand what is happening here!

Don't just read the article - run this example by yourself, as many times as necessary, to make sure that you actually understand what is happening!

## Conclusion

In this article, we've learned the basics of generators. How to create them, how to use the `yield` keyword, and how to consume the generators.

I hope that those first exercises and examples got you excited to learn more. We still have a lot to cover with regards to generators, so make sure to follow me on [Twitter](https://twitter.com/m_podlasin) to not miss those future articles.

Thanks for reading!
