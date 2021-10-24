---
slug: "/articles/generators-iii"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: 'Part III - "Advanced" Concepts'
---

This is the last article in our 3 part series, where we are explaining in great detail what are generators and how they work.

This however doesn't mean that we are finishing dealing with generators just yet. In future articles, as I've been promising for a long time now, we will continue exploring their capabilities, this time in a more practical setting - namely using them with React.

But before we move on to that, we still need to explain some "advanced" concepts. But don't let the title fool you. The knowledge in this article is absolutely necessary to understand generators deeply. So let's get started!

## yield expression

So far we only used the `yield` keyword either on its own, almost like a `return`, or we used it in such a construction:

```js
const variable = yield something;
```

But it's important to clarify that you don't have to necessarily write it this way.

`yield something` is an expression, so you can put it wherever an expression would be acceptable in typical JavaScript.

For example, instead of storing the result of `yield something` in a variable, only to later `console.log` it:

```js
const variable = yield something;

console.log(variable);
```

we might have as well simply written it like this:

```js
console.log(yield something);
```

Basically, if there is a place where you would put a variable, you can also use the `yield something` expression directly. 

So, for example, all of those examples are correct:

```js
// we used let, instead of const
let x = yield something;
```

```js
someFunction(yield something);
```

```js
if (yield something) {
    // do stuff
}
```

After all - as we've seen - `yield something` gets "replaced" anyways with the value that you provided as an argument to the `next` call. So when writing code with `yield` you just have to imagine someone swapping in your code `yield something` for an actual value. Does it still look correct? If so, it is also correct with a `yield something`.

You have to be careful however when combining `yield` with operators, for example with a plus sign.

`yield a + b` actually gets interpreted as `yield (a + b)`. If you wanted to yield only `a` here, you would have to write `(yield a) + b`.

There are some rules of operator precedence, but in my experience, it is best to just get a feel for it, by playing with some examples and getting a lot of practice. Simply make sure to double-check that your code actually yields the values that you are expecting.
## An iterator is more than just next()...

Before we continue, I have to confess to you something... In my iterators series, I haven't told you *the whole* truth about iterators. And now, before we move to generators again, I need to add some things to what I explained so far in my previous articles.

At this point, you might believe that iterators only possess one method - `next`.

Although that's the only *obligatory* method that they need to have, there are also two methods, which your iterators *might* have, if you decide to implement them.

The first is a `return` method. This method is used to notify the iterator, that the consumer has decided to stop the iteration *before* it actually finished. It's kind of a declaration that - although the iteration process hasn't fully completed - a consumer doesn't intend to make more `next` calls.

This method is actually called by native JavaScript consumers - like a `for ... of` loop - if they stop iteration prematurely. For example when `for ... of` loop encounters a `break` statement or if an exception is thrown in the loop body.

Of course, as we said, this method is completely optional, so if a `for ... of` loop doesn't find a `return` method on its iterator, it will simply do nothing. But if the iterator has such a method, it will be called, to notify it that the iteration process ended faster than expected.

Let's take a simple infinite iterator, returning integers, starting from zero:

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

Let's add to it a `return` method. Interestingly, `return` has to obey the same interface as `next`. This means it has to return an object of the shape `{ value, done }`.

The only reasonable value for `done` here is `true` because after `return` gets called, the iterator should indeed stop its iteration process. And for a `value` let's just stick to good old `undefined`. This property will be more important when we move on to generators.

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

As you can see, we've also added a log, to find out when that `return` method really gets called.

Let's now run a `for ... of` loop with a `break`:

```js
for (let element of counterIterator) {
    if (element > 2) {
        break;
    }

    console.log(element);
}
```

In the loop, we are simply logging the elements returned by the iterator. If numbers returned from it become bigger than 2, we immediately stop the iteration.

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

Since we are throwing, we had to wrap our loop in a `try-catch` block.

And no surprises here - the code logs exactly the same output:

```
0
1
2
return was called
```

So whether it's `break` or `throw` - if `for ... of` loop finishes prematurely, it lets the iterator know by calling its `return` method.

Okay, that's how `return` works. But... why it's here in the first place? `return` is very useful for doing cleanups. If there is some logic that is *critical* for an iterator to perform after the iteration ends, it should be probably put both into `return` *and* `done`. That's because successful iterations - the ones that were running till the end - don't call the `return` method, so you need to remember to do a cleanup in both cases.

We've mentioned that there are *two* optional methods that iterators can have. `return` is one of them, and the second is `throw`. 

`throw` also has to obey a similar interface as `next` and `return`. It's meaning is supposed to be similar to `return`. The iterator is informed that the iteration process ends prematurely, but it is also encouraged to raise some kind of an error.

Intuitively, `throw` should be used when something goes really, really wrong. And yet, as we've seen, when `for ...of` loop encounters an exception, it calls `return`. It turns out that in that case `throw` *doesn't* get called. That's probably because a typical iterator doesn't really care about *why* the iteration process ends earlier than it should - it just does the necessary cleanup and that's it.

So most of the time, when writing custom iterators, it's perfectly fine to omit `throw` and only use `return`.

On the other hand, the behavior of generators will actually differ depending on whether we use `return` or `throw`. We will see that in the following sections.

## return() with generators

Let's start with running `return` on generators first.

There are no big surprises here. When the generator gets informed via `return` call that the iteration process ended early, it just stops from ever returning further values.

Let's take an infinite "counter" iterator the same as before, but written as a generator:

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
{ value: undefined, done: true } // logged by `return` call
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So we see, that while we were calling `next` methods, the iterator was behaving as usual.

We then called `return`, which immediately resulted in `{ value: undefined, done: true }` object. 

And since then, even though we came back to calling the `next` method, we couldn't receive further values anymore.

Now perhaps the iterator doesn't return anything, but the generator itself is still running underneath?

Let's check it, by adding some logs to the generator function:

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
0                            // from generator
{ value: 0, done: false }
1                            // from generator
{ value: 1, done: false }
2                            // from generator
{ value: 2, done: false }
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So our doubts were unwarranted - the generator actually *stops running completely* after we call `return` on its iterator.

Having a `return` method on an iterator allowed us to perform some cleanup logic in case the iteration process ended earlier than expected.

Could we somehow replicate that with generators?

Indeed, we can use a `try-finally` construct for that.

Let's wrap our generator code in `try-finally`:

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

Note that if this was a regular function with a `while(true)` loop inside, without any returns or errors, the `finally` block would never get executed because we would never finish running the `try` block. With generators that's different, because we can now stop executing the `try` section "from the outside".

In our `finally` block we have made a simple `console.log`. Let's again run the previous `next` and `return` sequence:

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
finally was called!              <- log from finally block
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So indeed, the `finally` block ran after we've called `return` on this generator's iterator. So `finally` block is a place that you can use if you want to implement any kind of cleanup logic.

Now the mystery of why the `return` method has to return a `{ value, done }` object will be finally (sic!) solved. After all, in regular functions, it's perfectly legal to make a `return` statement in a `finally` block. Let's try that here, replacing our `console.log`:

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
{ value: -123, done: true } // result of `return` call
{ value: undefined, done: true }
{ value: undefined, done: true }
```

We see that now the result from the `return` method contains an actual value - in this case, a -123 number - instead of `undefined`.

Ha! So this way the generator can still communicate something to "the outside", even if the iteration process gets somehow interrupted!

## throw() with generators

Let's now solve the mystery of the `throw` method.

With iterators, it was a bit unclear why actually this method is needed.

As we've said previously, it's supposed to signalize to the iterator, that the iteration failed in a very bad way and the iterator should raise some kind of error.

And that's exactly what the generator does!

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

Let's run the `next` calls, but this time we will interrupt them with the `throw` method instead of `return`.

```js
const iterator = counterGenerator();

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.throw()); // now it's a throw
console.log(iterator.next());
console.log(iterator.next());
```

After running this code, you will see:

```
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 2, done: false }
caught error undefined           <- log from catch block
{ value: undefined, done: true }
{ value: undefined, done: true }
{ value: undefined, done: true }
```

So we see that the error was indeed thrown, and that error was... `undefined`.

On top of that, just as was the case with the `return` method, after calling `throw` the generator stops running and it doesn't generate new values anymore.

We see that the error thrown in the generator was `undefined`. Could it possibly be that we can also pass an argument to `throw`, which will become our error? Let's try it!

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

So we were right! Whatever you pass into the `throw` method as an argument will become the error object that actually gets thrown inside the generator.

One more thing. Similar to the `return` method, a value returned inside the `catch` block will become a value that gets returned by the `throw` method.

So this code:

```js
function* counterGenerator() {
    try {
        let i = 0;

        while(true) {
            yield i;
            i++;
        }
    } catch {
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
{ value: -666, done: true }      // result of `throw` call
{ value: undefined, done: true }
{ value: undefined, done: true }
```

And although it's not visible in this example, I hope it's clear to you exactly in which place the error gets thrown inside our generator. It is exactly the place where the generator gets suspended while waiting for the `next` call.

To show that, let's take this example:

```js
function* getNumbers() {
    yield 1;

    try {
        yield 2;
    } catch {
        console.log('We caught error!');
    }

    yield 3;
}
```

We can start this generator by calling `next` for the first time. That `next` call returns `{ value: 1, done: false }` object and at this point the generator gets suspended on the `yield 1;` statement.

If now the second call to the iterator would be `throw`, then the error wouldn't get caught by `try-catch`. That's simply because the generator is still on the `yield 1;` line, which is not wrapped in a `try-catch`.

Indeed, running:

```js
const iterator = getNumbers();

iterator.next();
iterator.throw('some error');
```

results in an uncaught string  - `some error` - appearing in the console.

If however, you would run `next` as a second method, then this second call would return an object `{ value: 2, done: false }` and the generator would be suspended on the `yield 2;` line.

If you called the `throw` method now, the error *would* be caught by `try-catch` and you would just see the log from the `catch` block.

So this code:

```js
const iterator = getNumbers();

iterator.next();
iterator.next();
iterator.throw('some error');
```

simply prints:

```
We caught error!
```

Of course most of the time you won't rely on exactly which statements are supposed to throw. You will just use larger `try/catch` blocks. But it's still valuable to understand what exactly is happening here.

## yield* - yield delegation

By now we got used to the `yield` keyword and its behavior doesn't seem strange to us anymore.

So let's get out of our comfort zone once more and learn about `yield*` now.

Yes, you've read that correctly. Apart from the `yield` keyword, you can use also `yield*` (`yield with a star character).

The `*` suggests that this construction has something to do with generators. But in fact, it's an operator that works on *any* iterable.

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

Since an array is an iterable, we can call `yield*` on it, and at this point, the generator will start behaving as if it was a regular array iterator.

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

If you think about it, it totally makes sense why another keyword - `yield*` - had to be introduced.

Note that this generator:

```js
function* getNumbers() {
    // look! no star here!
    yield [1, 2, 3];
}
```

simply emits one value - an array with 3 elements. Running the `for ... of` loop on this example results in the following log:

```js
[ 1, 2, 3 ]
```

Only after you use `yield*`, the control will be actually *delegated* to the array.

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

We can also combine `yield` and `yield*` in any way we want:

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
    yield -3;
    yield -2;
    yield -1;
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
-3 // <- getNumbers()
-2
-1
0  // <- counterGenerator()
1
2
3
4
```

Of course in this example, since `counterGenerator` is infinite, `getNumbersThenCount` is infinite as well. If we wouldn't use `break`, it would run forever.

## Generators as methods & some other syntax issues

I've left this section for the end because it's not really necessary to understand the *how* and *why* of generators.

But leaving it out completely would be dishonest and it might lead you to confusion when reading generators written by someone else.

Let's first start by noting, that you can easily turn object and class methods into generators, simply by prefixing the method name with a `*` symbol:

```js
const object = {
    *generatorMethod() {
        yield 1;
    }
}
```

```js
class SomeClass {
    *generatorMethod() {
        yield 1;
    }
}
```

It is also important to stress, that you can easily declare *anonymous* generators. This might be handy when you are writing inline generators as arguments to some other functions. Remember our `runMaybe` helper? With a little rewrite we could use it with an inline generator like this:

```js
runMaybe(function*() {
    // do something
})
```

Going back to regular generator functions, it turns out, however, that the `*` character can be positioned in few different places.

Throughout this tutorial, we've written generators like this:

```js
function* generator() {
    yield 1;
}
```

But interestingly, this works as well:

```js
function *generator() {
    yield 1;
}
```

Note how the `*` character changed position.

Oh, and this works as well...

```js
function * generator() {
    yield 1;
}
```

Uuuuuhm. And this also...

```js
function*generator() {
    yield 1;
}
```

So this funny "looseness" of syntax means that you can see generators written in many ways. So don't get confused by it. In all of those cases, the behavior is exactly the same.

A similar thing applies to anonymous generator functions.

And in fact, `yield*` expressions are equally "loose".

So this works:

```js
function* getNumbers() {
    yield* [1, 2, 3];
}
```

But also this:

```js
function* getNumbers() {
    // * changed position here
    yield *[1, 2, 3];
}
```

And this:

```js
function* getNumbers() {
    yield * [1, 2, 3];
}
```

And - you guessed it! - this:

```js
function* getNumbers() {
    yield*[1, 2, 3];
}
```

In his phenomenal [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS), the author [Kyle Simpson](https://twitter.com/getify) recommends using the following syntax:

For declaring generators:

```js
function *someGenerator() {

}
```

For yield delegation:

```js
function *someGenerator() {
    yield *someIterable;
}
```

However, as you've seen in these tutorials, I prefer:

```js
function* someGenerator() {

}
```

And for yield delegation:

```js
function* someGenerator() {
    yield* someIterable;
}
```

That's because I see the `function*` string as a type declaration. So for me:

* `function` = a regular function,
* `function*` = a generator function.

Similarly, I like to think of a `yield*` as a single keyword (and hence written together), separate from `yield`. That's because it is basically a completely different mechanism, so in my mind, it makes sense to have a separate keyword for it.

But Kyle has some equally strong arguments, which you can read about [here](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/es6%20%26%20beyond/ch3.md#generators).

So ultimately just choose what you prefer and stick with it. In the end, it doesn't really matter. What's important is that you actually understand deeply the mechanisms under that syntax.

## Conclusion

Uhh... That was a lot!

But I hope that at this point you feel that you understand generators very, very deeply.

And I am beyond excited, because finally in the future article we will be able to put all this knowledge into practice, by combining generators with React!

So if you don't want to miss those future articles, subscribe to me on [Twitter](https://twitter.com/m_podlasin).

Thanks for reading!
