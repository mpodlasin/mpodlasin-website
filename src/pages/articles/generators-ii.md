---
slug: "/articles/generators-ii"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: "Part II - Simple use-case"
---

<iframe class="youtubeVideo" src="https://www.youtube.com/embed/d9AVOH-fCK0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The behavior of generators that we've described in the [previous article](/articles/generators-i) is not complicated, but it is certainly surprising and might be difficult to grasp at the very beginning.

So in this article, instead of introducing more concepts, we will pause a bit and use only what we've learned to this point while discovering a cool use-case for generators.

Let's say that we have a function like this:

```js
function maybeAddNumbers() {
    const a = maybeGetNumberA();
    const b = maybeGetNumberB();

    return a + b;
}
```

Functions `maybeGetNumberA` and `maybeGetNumberB` return numbers, but sometimes they might also return `null` or `undefined`. That's what "maybe" in their names signalizes. 

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

This works okay, but if `a` is either a `null` or an `undefined`, there is really no point in calling the `maybeGetNumberB` function at all. That's because we already know that we will return a `null` anyways.

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

Uuuh. From an easy to read 3-liner, this quickly grew to 10 lines of code (not counting the empty lines). This function is now filled with `if` cases, which you have to get through in order to understand what it does.

And this is just a toy example! You can imagine that in actual codebases, which contain much more complex logic, those checks would become even more complicated.

So what if we could use generators here and bring back the code to its simpler form? 

Take a look at this:

```js
function* maybeAddNumbers() {
    const a = yield maybeGetNumberA();
    const b = yield maybeGetNumberB();

    return a + b;
}
```

What if we could give that `yield <something>` expression the functionality of checking if `<something>` is an actual value and not `null` or `undefined`?

If it turned out that `<something>` is `null` or `undefined`, we would just bail early and return `null`, exactly like in the more verbose version of our code.

This way we could write code that looks *almost* as if it deals only with actual, defined values.
It's the generator itself that would check for you if that's really the case and it would act accordingly! Sounds magical, doesn't it?

And yet it's not only possible but also very easy to write!

Of course, generators themselves don't possess this functionality. They just return iterators and optionally allow you to inject some values back into the generator.

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

We will run this iterator in a `while` loop. In order to do that, we need to call the iterator for the first time and start checking its `done` property:

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

You can see that we are immediately stopping the iteration with the `return` and we are returning a `null` from our wrapper.

If however `result.value` is an actual, defined value, we want to "give it back" to the generator. 

For example in `yield maybeGetNumberA()`, if it turns out that `maybeGetNumberA()` is actually a number, we just want to replace `yield maybeGetNumberA()` with the value of the number itself.

Even more specifically, if `maybeGetNumberA()` evaluated to, say, number 5, we would like to change `const a = yield maybeGetNumberA();` into `const a = 5;`. As you can see, we don't want to change the yielded value in any way, but simply pass it *back* to the generator.

We remember that we can replace `yield <something>` with some value by passing that value as an argument to the iterators `next` method. So let's do that!

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {
        if (result.value === null || result.value === undefined) {
            return null;
        }

        // we are passing result.value back
        // to the generator
        result = iterator.next(result.value)
    }
}
```

And as you can see, the new result gets now stored in the `result` variable again. We've specifically declared `result` with `let` so that it's possible.

We are almost there - if at any point our generator encounters a `null/undefined` when yielding a value, we just return a `null` from our `runMaybe` wrapper.

But we need to return something also if the iteration process finishes without encountering any `null/undefined` values. After all, if we receive two actual numbers in our generator, we want to return their sum from the wrapper!

Our `maybeAddNumbers` generator ends with a `return` statement.

We remember that `return <something>` in a generator causes its iterator to return an object `{ value: <something>, done: true }` from a `next` call.

When this happens, `while` loop will stop running, because `done` property will be set to `true`. But that last returned value (in our specific case `a + b` value) still will be stored in the `result.value` property! So at the end we can simply return it:

```js
function runMaybe(iterator) {
    let result = iterator.next();

    while(!result.done) {
        if (result.value === null || result.value === undefined) {
            return null;
        }

        result = iterator.next(result.value)
    }

    // just return the last value
    // after the iterator is done
    return result.value;
}
```

And... that's it!

Let's create dummy `maybeGetNumberA` and `maybeGetNumberB` functions. Let's make them return actual numbers first:

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

We will see - as expected - number 15 in the console.

Let's however change one of the added numbers to `null`:

```js
const maybeGetNumberA = () => null;
const maybeGetNumberB = () => 10;
```

Now running the code logs `null`!

It was however important to us to make sure that `maybeGetNumberB` function doesn't called when the first function - `maybeGetNumberA` - returns `null/undefined`. So let's double-check if we really succeeded.

We can do it simply by adding a `console.log` to the second function:

```js
const maybeGetNumberA = () => null;
const maybeGetNumberB = () => {
    console.log('B');
    return 10;
}
```

If we wrote our `runMaybe` helper correctly, the letter `B` should *not* appear in the console when running this example.

And indeed, if you run the code now, you will simply see `null` in the console, and nothing else. This means that our helper actually stops running the generator after it encounters a `null/undefined` value.

Our code also works as intended - by logging `null` - in any of those combinations:

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

We can run it in our `runMaybe` wrapper as well without any issue!

In fact, our wrapper doesn't even rely on the fact that in our examples those functions are returning numbers. Note that in `runMaybe` we don't mention the number type at all. So no matter what kind of values you are using in your generator - numbers, strings, objects, arrays, more complex data structures - it will still work with our helper!

This is exactly what developers find exciting about generators. They allow you to introduce custom functionality to the code that looks very regular (apart from those `yield` calls of course). You just need to create a wrapper that iterates over a generator in a particular way. This way, the wrapper basically "grants" the generator custom functionality!

And that functionality could be literally anything you want. Generators introduce potentially endless possibilities and the only limitation are our imaginations! 

And in the following articles, we will keep exploring those possibilities, especially in combination with React. So if this sounds interesting to you, follow me on [Twitter](https://twitter.com/m_podlasin) to not miss those future articles.

Thanks for reading!
