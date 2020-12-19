---
slug: "/articles/betas/generators-i"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: "Part I - Basics"
---

In this series I will teach you basically everything there is to know about generators in JavaScript - what they are, how to use them and - as usual - all the intricacies involved. And as always, we will begin with some basics, to give you an overview of that the generators are.

This series doesn't assume *any* previous knowledge about generators. However it does assume a very solid knowledge of iterables and iterators in JavaScript. If you don't know iterables/iterators, or don't really feel confident using them, make sure to check out my [previous article](/articles/iterables-and-iterators), which covers them in depth.

Know the prerequisites? Awesome! You are ready to dive into the world of generators. It is a strange, strange world, where many things are completely different to what you are used to in a regular JavaScript code. 

But the actual mechanism is very simple, and after reading this article you will feel confident in your capability to actually use generators by yourself.

So let's get started!

## Motivation

"But why would I even want to learn about using generators?" - you might ask.

And that's a very fair question. Indeed, generators are still a fairly exotic feature, not used very commonly in most of the codebases.

But there *are* problems which can be solved with generators surprisingly elegantly. And indeed, in my next article I will show you how to combine generators with React to create code that is highly superior to "hooks-only" code. This, hopefully, will inspire you to seek your own use-cases for generators.

But don't think for a second that generators are still somehow "experimental". There are a lot of projects used in production codebases that lean on generators heavily. 

I guess the most popular in the React world is [redux-saga](https://redux-saga.js.org/) package, which is a middleware for Redux, allowing you to write side effects code which is extremely readable and extremely testable at the same time (which doesn't happen that often!). 

I hope that those examples convinced you that it is absolutely worth learning generators. Are you now excited to study them? Let's do it then!

## Introduction

If I was tasked with explaining generators in only one sentence, I would probably write - "it is a syntax sugar for producing iterators". Of course this doesn't even come close to covering everything that generators are and can do. But it is not very far from the truth.

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

But if you really were to do that in TypeScript, the compiler would start to complain. Indeed, a generator function doesn't simply return a value that is being returned in it's body. 

It instead returns an iterator!

If you changed the typings this way:

```ts
function* getNumber(): Iterator<number> {
    return 5;
}
```

TypeScript compiler would allow that without any issues.

But that's TypeScript. Let's test if `function*` really returns an iterator in pure JavaScript.

We can check it for example by trying to call `next` method on the "thing" returned from the generator:

```js
const probablyIterator = getNumber();

console.log(probablyIterator.next());
```

This not only works, but it also logs `{ value: 5, done: true }` to the console.

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

So we only got our first value, an after that the iterator is stuck in it's "done" state. Interestingly the returned value is accessible only one time for us - further `next` calls just return `undefined`.

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

What happens if we call `next` method more times after that? It behaves like any typical iterator by always returning a `{ value: undefined, done: true }` object.

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

So let's check how our two versions of `getNumber` generator behave with `for ... of ` loops.

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

Huh. Very curious. But if you think about it, this is really just how iterators behave with the `for ... of ` loop. The `done` property decides whether the next iteration step should be ran or not.

Take a look on how in the iterables article we simulated the `for ... of` loop with a `while`:

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

So the rule is fairly simple - do you want a value to appear in a `for ... of` loop? `yield` it!

Do you want to return it from a generator, but not include it in a `for ... of` iteration? `return` it!

## Control flow in generators

At this point, we must clarify that in a generator function you can use all the typical control flow constructions.

For example you might choose which number to yield based on an argument passed to the generator:

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

In our iterables article we've created an infinite iterator, which was generating numbers 0, 1, 2, 3, ... - up to infinity. It wasn't too difficult, but it wasn't the most readable code ever.

Now we can do that with a generator in just few simple lines:

```js
function* counterGenerator() {
    let i = 0;

    while(true) {
        yield i;
        i++;
    }
}
```

In fact, this is the exact example that literally blew my mind when I was first learning about generators. I hope that it blows your mind as well, at least a little bit.

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

Obviously at the moment those variables are not used in any way. For the tutorial purposes, we will be simply logging them, but you could of course do with them whatever you want. 

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

In the rest of this section we will be running that exact generator multiple times. I would therefore advise you to copy this code somewhere, or just open this article again in a second browser tab. 

It will be *much* easier for you to understand what is happening, if you look at this generator as often as possible while we run the examples!

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

In order to do that, we will have to abandon `for ... of` loop and consume the iterator by hand.

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

So let see what happens when we pass some strings to those `next` calls:

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

But it's actually fairly straight forward to see what is happening here, if we do it step by step.

The rule is that a call to `next` causes the generator function to run until it encounters a `yield <some value>` call. When this call is encountered, the `<some value>` part gets returned from the `next` call (as value in the `{ value, done }` object). From this moment on, the generator simply waits for an another `next` call. The value passed to that *another* `next` call will become the value to which the whole `yield <something>` expression gets evaluated.

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

*You* are the one who decides here to what `yield 1` will evaluate to.

So at this point we see, that our *first* `yield` expression uses the value provided in the *second* `next` call. This is crucial to understand in generators. 

Basically, when encountering a `yield <some value>`, the generator is saying: "in current `next` call I will return you a `<some value>`, but in the *next* `next` call please provide me as an argument what should I replace `yield <some value>` with".

And this actually means that the argument passed to the *first* `next` call will never be used by generator. There is simply no point to provide it, so we will just remove it from our example:

```js
const iterator = getNumber();

console.log(iterator.next()); // no need to pass anything on the first `next` call
iterator.next('b');
```

After we've called `next` second time, generator continued to execute the code, until it encountered *another* `yield` statement - `yield 2`. Therefore number 2 gets returned from this `next` call as a value.

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

What happens now? Generator does not know to what it should evaluate `yield 2` in the `const second = yield 2;` statement. So it just waits there, suspended, until you pass it another value in the `next` call:

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

And - because our generator doesn't how more `yield` statements in it - it doesn't have more values to return and it also runs till completion. 

That's why the last `{ done, value }` object from the `next` call, has no value in it and also notifies us that the iterator has finished.

This code:

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

Help yourself by adding those successive `next` and `console.log` calls step by step just like I did. Also try to always control in which line of the generator you currently are. Remember! You have too look at the generator code at each step to really understand what is happening here!

Don't just read the article - run this example by yourself, as many times as necessary, to make sure that you actually understand what is happening!

## yield expression

So far we only used `yield` keyword either on it's own, almost like a `return`, or we used it in such a contruction:

```js
const variable = yield something;
```

But it's important to clarify that you don't have to necesarrily write it this way.

`yield something` is an expression, so you can put that part wherever an expression would be acceptable in typical JavaScript.

For example, instead of storing the result of `yield something` in a variable, only to later `console.log` it, we might have as well simply write it like this:

```js
const variable = yield something;

console.log(variable);
```

we might have as well simply write it like this:

```js
console.log(yield something);
```

Basically, if there is a place where you would put a variable - function call, `if` statement, right side of variable assignment - you can also use `yield something` expression directly. 

So, for example, all of those are correct:

```js
someFunction(yield something);
```

```js
if (yield something) {
    // do stuff
}
```

```js
let x = yield something;
```

After all, as we've seen - when you call the `next` function, `yield something` gets "replaced" anyways with the value that you provided as an argument. So imagine that someone swaps in your code `yield something` for a value. Does it still look correct? If so, it is also correct with a `yield`.

You have to be careful however when combining `yield` with operators, for example with a plus sign.

`yield a + b` actually gets interpreted as `yield (a + b)`. If you wanted to yield only `a` you would have to write `(yield a) + b`.

There are some rules of operator precedence, but in my experience it is the best to just get a feel for it, playing with some examples and getting a lot of practice.

## Fighting null and undefined with generators

This behavior of generators that we've described so far is not complicated, but it is certainly surprising and might be difficult to grasp at the very beginning.

So in this section, instead of introducing more concepts, we will pause a bit and use only what we've learned to this point, while discovering a cool use-case for generators.

Let's say that we have a function like this:

```js
function maybeAddNumbers() {
    const a = maybeGetNumberA();
    const b = maybeGetNumberB();

    return a + b;
}
```

Functions `maybeGetNumberA` and `maybeGetNumberB` return numbers, but sometimes they might also return `null` or `undefined` - that's what "maybe" in their names signalizes. 

When that's the case, we shouldn't try to add those values (for example a number and `null`), but rather bail out immediately and just return, let's say, `null` again. After all, it's better to return `null` here, rather than some unpredictable value resulting from adding `null/undefined` with a number or with another `null/undefined`.

So we have to add a check that makes sure those numbers are actually defined:

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

This works okay, but if `a` is either a `null` or an `undefined`, there is really no point in calling the `maybeGetNumberB` function at all. That's because we already know that we will return a `null`.

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

Uuuh. From an easy to read 3-liner, we now have 10 lines of code (not counting empty lines). Not only that, this function is now filled with `if` cases, which you have to get through in order to understand what it does.

And this is just a toy example! You can imagine that in actual codebases, which contain much more complex logic, those checks would become even more complicated.

So what if we could use generators here and bring back the code to it's simpler form? 

Take a look at this:

```js
function* maybeAddNumbers() {
    const a = yield maybeGetNumberA();
    const b = yield maybeGetNumberB();

    return a + b;
}
```

What if we could give `yield <maybe something>` statement the functionality of checking if `<maybe something>` is an actual value and not `null` or `undefined`?

If it turned out that `<maybe something>` is `null` or `undefined`, we would just bail early and return `null`, just like in the more verbose version of our code.

This way we could write code that looks *almost* as if it deals only with actual, defined values.
It's the generator itself that would check for you if that's really the case and it would adjust accordingly! Sounds magical, doesn't it?

And yet it's not only possible, it's also very easy to write!

Of course generators themselves don't posses this functionality. They just return iterators and optionally allow you to inject some values back into the generator.

So we will have to write a wrapper - let's call it `runMaybe` - which will give the generator this capability.

So instead of calling the function directly:

```js
const result = maybeAddNumbers();
```

We will be calling it as an argument to that wrapper:

```js
const result = runMaybe(maybeAddNumbers());
```

This is a pattern that you will see incredibly often with generators.

Generators by themselves don't do much, but by writing custom wrappers like this one, you can grant generators custom behaviors! And that's precisely what we will do right now.

So `runMaybe` obviously is a function and it accepts one argument - an iterator produced by the generator:

```js
function runMaybe(iterator) {

}
```

We will run this iterator in a `while` loop. In order to do that we need to call the iterator for the first time and start checking the `done` property:

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

If however it is a defined value, we want to "give it back" to the generator. 

For example in `yield maybeGetNumberA()`, if it turns out that `maybeGetNumberA()` is actually a number, we just want to replace `yield maybeGetNumberA()` with the value of the number itself. 

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

And as you can see, the new result gets now stored in the `result` variable again. We've specifically declared `result` with `let` so that it's possible.

We are almost there. If at any point the iterator produces a `null/undefined`, we just return a `null`. 

But we need to return something also if the iteration process finishes without encountering any `null/undefined` values. After all, if we receive two actual numbers in our generator, we want to return their sum!

We remember that `return <something>` in a generator causes an iterator to return an object `{ value: <something>, done: true }`. Because `done` is `true`, `while` loop stops running, but the returned value is still stored in the `result`! So at the end we can simply return it:

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {
        if (result.value === null || result.value === undefined) {
            return null;
        }

        result = iterator.next(result.value)
    }

    // just return the last value of the iteration
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

It lays in the fact that we've created a *general* helper, which can handle *any* generator that potentially yields `null/undefined` values.

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

We could run it in our wrapper as well without any issues. 

This is exactly what developers find exciting about generators. They actually allow you to introduce custom functionality to the code that looks very regular (apart from `yield` calls of course).

And this functionality can be literally anything you want. Generators introduce a sea of endless possibilities and the only limitation are our imaginations! And in the following articles we will be exploring those possiblities.

## Conclusion

In this article we've learned the basics of generators. How to create them, how to use `yield` keyword, how to consume them.

We've also seen a potential use-case for the generator mechanism, which showed us why generators are believed to be so powerful.

I hope that those first exercises and examples got you excited to learn more. We still have a lot to cover with regards to generators, so make sure to follow me on [Twitter](https://twitter.com/m_podlasin) to not miss those future articles.

Thanks for reading!
