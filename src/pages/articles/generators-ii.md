---
slug: "/articles/betas/generators-ii"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: "Part II - Beyond Basics"
---

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
## An iterator is more than just next()...

Before we begin, I have to confess you something... In my iterators series, I haven't told you *the whole* truth about iterators... And now, before we move to generators again, I need to add some things to what I explained so far.

At this point, you might believe that iterators only possess one method - `next`.

Although that's the only *obligatory* method that they need to have, there are also two methods, which your iterators *might* have, if you decide to implement them.

The first is a `return` method. This method is used to notify the iterator, that the consumer has decided to stop the iteration *before* it actually finished. It's kind of like a declaration that - although the iteration process haven't fully completed - consumer doesn't intend to make more `next` calls.

This method is actually called by native JavaScript consumers, like `for ... of` loop, if they stop iteration prematurely - for example by encountering `break` statement or if an exception is thrown in the loop body.

Of course, as we said, this method is completely optional, so if `for ... of` loop doesn't find a `return` method on its iterator, it will simply do nothing. If however the iterator has such method, it will be called, to notify it, that the iteration process ends faster than expected.

Let's take our simple infinite iterator, returning integers, starting from zero:

```js
const counterIterator = {
    index: -1,

    next() {
        this.index++;

        return {
            value: this.index,
            done: false,
        }
    },

    [Symbol.iterator]() {
        return this;
    }
}
```

Let's add to it a `return` method. Interestingly, `return` has to obey the same interaface as `next`, meaning it has to return an object of shape `{ value, done }`.

The only reasonable value for `done` is `true`, because after `return` called, the iterator should be indeed done. And for a `value` let's just stick to good old `undefined`.

```js
const counterIterator = {
    index: -1,

    next() {
        this.index++;

        return {
            value: this.index,
            done: false,
        }
    },

    // new `return` method
    return() {
        console.log('return was called');

        return {
            value: undefined,
            done: true
        }
    },

    [Symbol.iterator]() {
        return this;
    }
}
```

As you can see, we've also added a log, to make sure when `return` really gets called.

Let's now run a `for ... of` loop with a `break`:

```js
for (let element of counterIterator) {
    if (element > 2) {
        break;
    }

    console.log(element);
}
```

We are just logging the elements returned by the iterator. If numbers returned from it become bigger than 2, we stop the iteration.

Running this code logs:

```
0
1
2
return was called
```

So we see that indeed our `return` method was called when the `break` statement was encountered.

Let's now try throwing inside the loop:

```js
try {
    for (let element of counterIterator) {
        if (element > 2) {
            throw 'error';
        }

        console.log(element);
    }
} catch {}
```

Because we are throwing, we had to wrap our loop in a `try` block.

And no surprises here - this code logs exactly the same output:

```
0
1
2
return was called
```

So whether it's `break` or `throw` - if `for ... of` loop finishes prematurely, it let's the iterator know by calling its `return` method.

Okay, that's how `return` works. But... why it's here in the first place? `return` is very useful for doing any kind of cleanups. If there is some logic which is *critical* for an iterator to perform after the iteration ends, it should be probably put into `return` *and* `done` (remember that succesfull iterations don't call `return`, so you need to remember to do a cleanup in both cases).

We've mentioned that there are *two* optional methods that iterators can have. `return` is one of them, and the second is `throw`. 

`throw` also has to obey similar interface as `next` and `return`. It's meaning is supposed to be similar to `return`. The iterator is informed that iteration process ends prematurely, but it is also encouraged to raise some kind of an error.

Intuitively, `throw` should be used when something goes really wrong. And yet, as we've seen, when `for ...of` loop encounteres an error, it calls `return` anyways. That's probably because a typical iterator doesn't really care about *why* the iteration process ends earlier than it should - it just does the necessary cleanup and that's it.

On the other hand, the behavior of generators will actually differ depending on wether we use `return` or `throw`, which we will see in the following sections.

## return() with generators

Let's start with `return` ran on generators first.

There are no big surprises here. When the generator gets informed via `return` call that the iteration process ended early, it just stops running the generator the returning further values.

Let's take an infinite iterator the same as before, but written as a generator:

```js
function* counterGenerator() {
    let i = 0;

    while(true) {
        yield i;
        i++;
    }
}
```

Let's run it by hand, using `next` and `return` methods of its iterator:

```js
const iterator = counterGenerator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.return()); // a return method!
console.log(iterator.next());
console.log(iterator.next());
```

This logs:

```js
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So we see, that while we were calling `next` methods, the iterator was behaving as usual.

We then ran `return`, which immediately resulted in `{ value: undefined, done: true }`. 

And since then, even though we came back to calling `next`, we only received that "done" object without any values.

Now perhaps the iterator doesn't return anything, but the iterator is still running underneath?

Let's check it, by adding some logs to the generator itself:

```js
function* counterGenerator() {
    let i = 0;

    while(true) {
        // we are now logging the value
        console.log(i);
        yield i;
        i++;
    }
}
```

Running the code now results in:

```js
0                            // <- from generator
{ value: 0, done: false }
1                            // <- from generator
{ value: 1, done: false }
2                            // <- from generator
{ value: 2, done: false }
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So our doubts were unwarranted - the generator actually stops running after we call `return` on it.

As we've seen, having a `return` method on the iterator allowed us to perform some logic if the iteration process ended eariler than expected.

Could we somehow replicate that in generators then?

Indeed, we can use `try/finally` construct.

Let's wrap our generator code in `try/finally`:

```js
function* counterGenerator() {
    try {
        let i = 0;

        while(true) {
            yield i;
            i++;
        }
    } finally {
        console.log('finally was called!');
    }
}
```

Note that if this was a regular function with a `while(true)` loop inside, without any returns or errors, the `finally` block would never run, because we would never finish the `try` block. With generators that's different, because we can finish the `try` block "from the outside".

In the `finally` block we have made a simple log. Let's run the previous `next` and `return` sequnce again:

```js
const iterator = counterGenerator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.return()); // a return method
console.log(iterator.next());
console.log(iterator.next());
```

This logs:

```
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
finally was called!              <- look here
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So indeed, the `finally` block ran after we've called `return` on this generators iterator. This is a place that you can use, if you want to implement some "just in case" or cleanup logic.

Now the mystery why the `return` method has to return a `{ value, done }` object will be finally (sic!) solved. After all, in regular functions it's perfectly legal to make a `return` statement in a `finally` block. Let's try that here, replacing our `console.log`:

```js
function* counterGenerator() {
    try {
        let i = 0;

        while(true) {
            yield i;
            i++;
        }
    } finally {
        return -123;
    }
}
```

Run the code again and you will see in the console:

```js
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
{ value: -123, done: true } // <- result of `return`
{ value: undefined, done: true }
{ value: undefined, done: true }
```

Ha! So this way the generator can still communicate something to "the outside" even if case the iteration process gets interrupted!

## throw() with generators

Let's now solve the mystery of the `throw` method.

As we've said previously, it's supposed to signalize to the iterator, that the iteration failed in a very bad way and the iterator should raise some kind of error.

And... that's exactly what the generator does!

Let's wrap our generator code in a `try/catch` now, instead of `try/finally`:

```js
function* counterGenerator() {
    try {
        let i = 0;

        while(true) {
            yield i;
            i++;
        }
    // now it's a catch
    } catch(error) {
        console.log('caught error', error)
    }
}
```

We are prepared to log whatever error will be thrown in our code.

Let's run the `next` calls, but this time we will interrupt them with `throw`, not a `return`:

```js
const iterator = counterGenerator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.throw()); // now a throw
console.log(iterator.next());
console.log(iterator.next());
```

After running this code, you will see:

```
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
caught error undefined           <- log from catch
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So we see that the error was indeed thrown, and that error was... `undefined`.

Could it possibly be, that we can also pass an argument to `throw`, which will become our error? Let's try!

```js
const iterator = counterGenerator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.throw("let's throw a string, why not, it's JS"));
console.log(iterator.next());
console.log(iterator.next());
```

We then see in the console:

```
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
caught error let's throw a string, why not, it's JS
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So we were right! Whatever you pass into the `throw` method as an argument will become an error object that get's thrown inside the generator.

And - similarily as with `return` method - a value returned inside `catch` block will become a value that gets returned by the `throw` method.

So this code:

```js
function* counterGenerator() {
    try {
        let i = 0;

        while(true) {
            yield i;
            i++;
        }
    } catch(error) {
        // now we return here
        return -666;
    }
}
```

Will result in this output:

```js
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
{ value: -666, done: true }      // <- returned value
{ value: undefined, done: true }
{ value: undefined, done: true }
```

And although it's not visible on this example, I hope it's clear to you exactly in which place the error gets thrown inside our generator. It is exactly the place where the generators gets suspended, while waiting for the `next` call.

Let's take this example:

```js
function* getNumbers() {
    yield 1;

    try {
        yield 2;
    } catch {
        console.log('caught error');
    }

    yield 3;
}
```

We can start this generator by calling `next` for the first time. `next` call returns `{ value: 1, done: false }` object and at this point the generator gets suspended.

If the second method we called was `throw`, then the error wouldn't get caught by `try/catch`, because the generator is simply not yet at this line in code.

Indeed, running:

```js
const iterator = getNumbers();

iterator.next();
iterator.throw('some error');
```

results in an uncaught string  - `some error` - appearing in the console.

If however you ran `next` as a second method, then this second call would return an object `{ value: 2, done: false }` and the generator would be suspended on the `yield 2` line.

If you called `throw` method now, the error would be caught by `try/catch` and you would just see our log.

So this code:

```js
const iterator = getNumbers();

iterator.next();
iterator.next();
iterator.throw('some error');
```

simply prints:

```
caught error
```

Most of the time you probably won't rely on which statements are supposed to throw and you will just use larger `try/catch` blocks, but it's still valuable to understand what is happening here.

## yield* - yield delegation

By now we got used to `yield` keyword and it's behavior doesn't seem that strange to us.

So let's get out of our comfort zone once more and learn about `yield*` now.

Yes, you've read that correctly. Apart from the `yield` keyword, you can use also `yield*` (`yield with star).

The `*` suggests that this construction has something to do with generators. In fact it's an operator that works on any iterable.

Its mechanism is called "yield delegation". `yield*` *delegates* execution to another iterable or generator.

We've started our generators adventure with this simple example:

```js
function* getNumbers() {
    yield 1;
    yield 2;
    yield 3;
}
```

But using yield delegation we might have written it much simpler:

```js
function* getNumbers() {
    yield* [1, 2, 3];
}
```

Since an array is an iterable, we can call `yield*` on it, and at this point the generator will start behaving as if it was an array iterator.

So running:

```js
for (let element of getNumbers()) {
    console.log(element)
}
```

simply logs numbers:

```js
1
2
3
```

Now it makes sense why another keyword - `yield*` - had to be introduced.

Note that this generator:

```js
function* getNumbers() {
    // look! no star here!
    yield [1, 2, 3];
}
```

simply emits one value - an array with 3 elements. Running `for ... of` loop on this example results in the following log:

```js
[ 1, 2, 3 ]
```

Only after you use `yield*`, the control will be actually delegated to the iterator.

Of course nothing stops us from using `yield*` multiple times:

```js
function* getNumbers() {
    yield* [1, 2, 3];
    yield* ['a', 'b', 'c'];
}
```

which results in:

```
1
2
3
a
b
c
```

We can also combine `yield` and `yield*`:

```js
function* getNumbers() {
    yield* [1, 2, 3];

    yield '---';

    yield* ['a', 'b', 'c'];
}
```

which logs:

```
1
2
3
---
a
b
c
```

Since generators return iterators and since those iterators are iterables, this means we can use `yield*` also on results coming from generators, basically allowing us to nest generators, just like we nest functions.

Take two generators we already know:

```js
function* getNumbers() {
    yield* [1, 2, 3];
}

function* counterGenerator() {
    let i = 0;

    while(true) {
        yield i;
        i++;
    }
}
```

We can easily run them one after another by creating another generator:

```js
function* getNumbersThenCount() {
    yield* getNumbers();
    yield* counterGenerator();
}
```

Running:

```js
for (let element of getNumbersThenCount()) {
    if (element > 4) {
        break;
    }
    console.log(element);
}
```

logs a sequence:

```js
1 // <- getNumbers()
2
3
0 // <- counterGenerator()
1
2
3
4
```

Of course in this example, since `counterGenerator` is infinite, consequently `getNumbersThenCount` is infinite as well. If we wouldn't use `break`, it would run forever.

## Generators as methods & some other syntax issues


