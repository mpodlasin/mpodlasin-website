---
slug: "/articles/betas/generators-i"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: "Part I - Basics"
---

In this series I will teach you basically everything there is to know about generators in JavaScript - what they are, how to use them and - as usual - all the intricacies involved. And as usual, we will begin with some basics, to give you an overview of that the generators are.

This series doesn't assume *any* previous knowledge about generators, but it does assume a very solid knowledge of iterables and iterators in JavaScript. If you don't know iterables/iterators, or don't really feel confident using them, make sure to check out my [previous article](/articles/iterables-and-iterators), which covers them in depth.

On top of that, in the later parts of this article we will rely on your knowledge of Promises and recursion. Unfortunately I don't have any materials on those, but if you would like me to prepare some, just let me know on [Twitter](https://twitter.com/m_podlasin).

Learned all the prerequisites? Awesome! You are ready to dive into the world of generators. It is a strange, strange world, where many things are completely different to what you are used to in a regular JavaScript code. 

But the actual mechanism is very simple, and after reading this article you will feel confident in your capability to actually use generators by yourself.

So let's get started!

## Motivation

"But why would I even want to learn about using generators?" - you might ask.

And that's a very fair question. Indeed, generators are still a fairly exotic feature, not used very commonly in most of the codebases.

But there *are* problems which can be solved with generators surprisingly elegantly. And indeed, in my next article I will show you how to combine generators with React to create code that is highly superior to "hooks-only" code. This, hopefully, will inspire you to seek your own use-cases for generators.

But don't think for a second that generators are still somehow "experimental". There are a lot of projects used in production codebases that lean on generators heavily. 

I guess the most popular in the React world is [redux-saga](https://redux-saga.js.org/) package, which is a middleware for Redux, allowing you to write side effects code which is extremely readable and extremaly testable at the same time (which doesn't happen that often!). 

I hope that those examples convinced you that it is absolutely worth learning generators. Are you now excited to study them? Let's do it then!

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

So let's check how our two versions of `getNumber` generator behave with `for ... of ` loops.

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

Huh. Very curious. But if you think about it, this is really just how the iterators behave with the `for ... of ` loop. The `done` property decides wether the next iteration step should be ran or not.

Since if we use `return` in our generator, we will get a `{ value: 3, done: true }` object on the third call, meaning - the `for ... of` loop will run only twice, when the `done` was set to `false`.

So the rule is fairly simple - do you want a value to appear in a `for ... of` loop? `yield` it!

Do you want to return it from a generator, but not include it in a iteration? `return` it!

## Control flow in generators

TODO!!!

## Sending values to a generator

So on those simple examples we've seen that we can use generators to create typical iterators.

But it turns out that an iterator returned from a generator allows you to... pass some values back to the generator as well!

Let's enhance our previous generator example:

```js
function* getNumber() {
    const first = yield 1;
    const second = yield 2;
    const third = yield 3;
}
```

As you can see, we are still simply yielding numbers from the generator, but we also assign to variables whatever those `yield <number>` expressions evaluate to.

Obviously at the moment those variables are not used in any way. For the tutorial purposes, we will be just logging them. We will also add a log at the very beginning of the function.

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

Let's run this new generator just as before:

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

In order to do that, we will have to abandon `for ... of` loop and consume the iterator by hand.

Let's just call `next` method of the iterator 4 times, to get our 3 numbers and the last object with `done` set to `true`. We will log each result coming from the `next` call.

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

After running that (with the generator uchanged), we get:

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

So not much changed here - `undefined` values still here, we just swapped numbers from a `for ... of` loop to logging whole objects coming from `next` calls.

Generators utilize in a smart way the flexibility of an iterator interface. After all, an iterator has to have a `next` method, returning an object of shape `{ done, value }`. But nobody said that this method can't accept some arguments! A `next` method that accepts some argument still obeys the interface, as long as it returns an object of expected shape! 

So let see what happens when we pass some strings to those `next` calls:

```js
const iterator = getNumber();

console.log(iterator.next('a'));
console.log(iterator.next('b'));
console.log(iterator.next('c'));
console.log(iterator.next('d'));
```

After you run this, you'll finally see something else than `udefined` in the console:

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

But it's actually fairly straight forward to see what is happening here, if we do it step by step.

The rule is that a call to `next` causes the generator function to run until it encounteres a `yield <some value>` call. When this call is encountered, the `<some value>` part gets returned from the `next` call (as value in the `{ value, done }` object). From this moment on, the generator simply waits for an another `next` call. The value passed to that *another* next call will become the value to which the whole `yield <something>` expression gets evaluted.

Let's see it step by step on our example generator.

When you call `next` the first time, it simply begins the execution of the generator function. In our case this means that `console.log('start')` will get executed.

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

console.log(iterator.next('a')); // we've added console.log here
```

This now logs:

```
start
{ value: 1, done: false }
```

The 1 there is precisely what we yielded in the generator. 

And this point, the generator has stopped. Even the statemenent where we encountered `yield` - `const first = yield 1;` - did *not* get executed fully. After all, the generator doesn't know yet what the value of `yield 1` part should be.

We are providing that value with our *next* `next` call:

```js
const iterator = getNumber();

console.log(iterator.next('a'));
iterator.next('b'); // we've added another next call
```

This will print:

```
start
{ value: 1, done: false }
b
```

So we see that generator resumed execution and basically replaced `yield 1` with a valule that we passed to the `next` call - `b` string.

To make sure you *really* understand what is happening, you can try to pass some other values there:

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

*You* are the one who decides here to what `yield 1` will evaluate to.

So at this point we see, that our *first* `yield` expression uses the value provided in the *second* `next` call. This is crucial to understand the generators. Basically when encountering a `yield <some value>`, the generator is saying: "in *this* `next` call I will return you a `<some value>`, but in the *next* `next` call please provide me as an argument what should I replace `yield <some value>` with".

And this actually means that the argument passed to the *first* `next` call will never be used by generator. There is simply no point to provide it, so we will just remove it from our example:

```js
const iterator = getNumber();

console.log(iterator.next()); // no need to pass anything on the first `next` call
iterator.next('b');
```

After we've called `next` second time, generator simply executes the code, until it encounteres *another* `yield` statement - `yield 2`. Once again, number 2 gets returned from our `next` call as a value.

So this:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b')); // we've added console.log here
```

prints this:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
```

What happens now? Generator does not know to what it should evaluate `yield 2` in the `const second = yield 2;` statement. So it just waits there, suspended, until you pass it another value in the `next` call:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
iterator.next('c');  // we've added another next call
```

This now logs:

```
start
{ value: 1, done: false }
b
{ value: 2, done: false }
c
```

After this `next` call, code in the generator starts being executed again, until we encounter `yield 3`. So 3 will be the value returned from that call:

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

Now the generator is suspended at the `const third = yield 3;` statement. We know what to do to make it running again - another `next` call!

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

And - because our generator doesn't how anymore `yield` statements in it, it runs till completion. So the last result return from the next method, notifies that our iterator has finished:

```js
const iterator = getNumber();

console.log(iterator.next());
console.log(iterator.next('b'));
console.log(iterator.next('c'));
console.log(iterator.next('d')); // we've added console.log here
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
{ value: undefined, done: true }
```

And that's it! If this still seems confusing, you need to run this example by yourself, adding those succesive `next` and `console.log` calls step by step just like I did, and trying to understand at which line(s) of the generator function you currently are. Don't just read the article - run this example by yourself, as many times as necessary, to make sure that you actually understand what is happening!

## Fighting nulls and undefineds with generators

The behavior of generators that we just described is not complicated, but it is certainly surprising and might be difficult to grasp at the very beginning.

So in this section, instead of introducting more concepts, we will stop for a little and use only what we've learned so far, while discovering a cool use-case for generators.

Let's say that we have a function like this:

```js
function maybeAddNumbers() {
    const a = maybeGetNumberA();
    const b = maybeGetNumberB();

    return a + b;
}
```

Functions `maybeGetNumberA` and `maybeGetNumberB` returns numbers, but sometimes they might also return `null` or `undefined`. When that's the case, we shouldn't try to add those numbers, but rather bail out immediately and just return, let's say, `null` again.

So we have to add a check that makes sure those numbers are not `null` or `undefined`:

```js
function maybeAddNumbers() {
    const a = maybeGetNumberA();
    const b = maybeGetNumberB();

    if (a === null || a === undefined || b === null || b === undefined) {
        return null;
    }

    return a + b;
}
```

But then we realize - if `a` is either a `null` or `undefined`, there is really no point in calling the `maybeGetNumberB` function. That's because we already know that we will return a `null`.

So let's rewrite the function again:

```js
function maybeAddNumbers() {
    const a = maybeGetNumberA();

    if (a === null || a === undefined) {
        return null;
    }

    const b = maybeGetNumberB();

    if (b === null || b === undefined) {
        return null;
    }

    return a + b;
}
```

Uuuh. From an easy to read 3-liner, we now have 10 lines of code in the function body (not counting empty lines). Not only that, it's now filled with `if` cases, which you have to get through in order to understand what this function does.

And this is just a toy example! You can probably imagine that in actual codebases, containing much more complex logic, those checks would become even more complicated.

So what if we could use generators here and bring back the code to it's simpler form? Take a look at this:

```js
function* maybeAddNumbers() {
    const a = yield maybeGetNumberA();
    const b = yield maybeGetNumberB();

    return a + b;
}
```

What if we could give `yield <maybe something>` statement the functionality of checking if `<maybe something>` is an actual value and not `null` or `undefined`?

If it turned out that `<maybe something>` is `null` or `undefined`, we would just bail early and return `null`, just like in the more verbose version of our code.

So you would write code that looks *almost* as if it deals only with actual, defined values, but the generator would check for you if that's actually the case and it would adjust accordingly! Sounds magical, doesn't it?

And yet it's not only possible, it's also fairly easy to write!

Of course generators themselves don't posses this functionality. They just return iterators and optionally allow you to inject some values back into the generator.

So we will have to write a wrapper, call it `runMaybe`, which will give the generator this capability.

So instead of calling the function directly:

```js
const result = maybeAddNumbers();
```

We will be calling it as an argument to that wrapper:

```js
const result = runMaybe(maybeAddNumbers());
```

And this is a pattern that you will see incredibly often with generators.

Generators by themselves don't do much, but by writing custom wrapper like this, which control the iteration process of the generator, you can grant generators custom behaviors! And that's precisely what we will do right now.

So `runMaybe` obviously is a function and it accepts one argument - an iterator produced by the generator:

```js
function runMaybe(iterator) {

}
```

We will run this iterator in a `while` loop. In order to do that we need to call the iterator the first time and start checking the `done` property:

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {

    }
}
```

Now inside a loop we have two options. If `result.value` is `null` or `undefined` we want to break the iteration process immediately and return `null`. Let's do that:

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {
        if (result.value === null || result.value === undefined) {
            return null;
        }
    }
}
```

If however it is a defined value, we want to "give it back" to the generator. For example in `yield maybeGetNumberA()`, if it turns out that `maybeGetNumberA()` is actually a number, we just want to replace `yield maybeGetNumberA()` with the value of the number itself. 

We remember that we did this by calling `next` again and passing the value as its argument. Let's do that!

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {
        if (result.value === null || result.value === undefined) {
            return null;
        }

        result = iterator.next(result.value)
    }
}
```

Obviously the new result gets now stored in the `result` variable.

We are almost there. If at any point the iterator produces a `null/undefined`, we just return a `null`. 

But we need to return something also if the iteration process ends. After all, the iteration process ending is equivalent to the generator finishing running!

We remember that `return <something>` in a generator causes an iterator to return an object `{ value: <something>, done: true }`. Because `done` is `true`, while loop is still running, but the returned value is still stored in the `result`! So at the end we can simply return it:

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {
        if (result.value === null || result.value === undefined) {
            return null;
        }

        result = iterator.next(result.value)
    }

    return result.value;
}
```

And... that's it!

Let's create `maybeGetNumberA` and `maybeGetNumberB` functions. Let's make them return actual numbers first:

```js
const maybeGetNumberA = () => 5;
const maybeGetNumberB = () => 10;
```

If we run our code now and log the results:

```js
function* maybeAddNumbers() {
    const a = yield maybeGetNumberA();
    const b = yield maybeGetNumberB();

    return a + b;
}

const result = runMaybe(maybeAddNumbers());

console.log(result);
```

We will see - as expected - 15 in the console.

Let's however change one of the added numbers to `null`:

```js
const maybeGetNumberA = () => null;
const maybeGetNumberB = () => 10;
```

Now running the code logs `null`!

The same happens in any of those combinations:

```js
const maybeGetNumberA = () => undefined;
const maybeGetNumberB = () => 10;
```

```js
const maybeGetNumberA = () => 5;
const maybeGetNumberB = () => null;
```

```js
const maybeGetNumberA = () => undefined;
const maybeGetNumberB = () => null;
```

etc.

The power of this example doesn't lay however in running this particular code.

It lays in the fact that we've created a *general* helper, which can handle *any* generator that yields potential `null/undefined` values.

For example if we wrote a more complex function:

```js
function* maybeAddFiveNumbers() {
    const a = yield maybeGetNumberA();
    const b = yield maybeGetNumberB();
    const c = yield maybeGetNumberC();
    const d = yield maybeGetNumberD();
    const e = yield maybeGetNumberE();
    
    return a + b + c + d + e;
}
```

we could run it in our wrapper as well without any issues. 

This is exactly what developers find exciting about generators. In a way they allow you to introduce custom functionality to the code that looks very regular (apart from `yield` calls of course).

And this functionality can be literally anything you want. Generators introduce a sea of endless possibilities and the only limitation are our imaginations!

## Conclusion

In this article we've learned the basics of generators. How to create them, how to use `yield` keyword, how to consume them.

We've also seen a potential use-case for the generator mechanism.

I hope that those first exmaples got you excited. We still have a lot to cover in regards to generators, so make sure to follow me on [Twitter](https://twitter.com/m_podlasin) to not miss future articles.

Thanks for reading!



