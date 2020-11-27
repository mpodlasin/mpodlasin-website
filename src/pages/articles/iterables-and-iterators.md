---
slug: "/articles/betas/iterables-and-iterators"
date: "2019-05-04"
title: "Iterables & Iterators in JS - an In-Depth Tutorial"
---

This article is the first in a three-part series. We will begin by learning about iterables & iterators. In the second article, we will deal with generators. And in the third article, we will show how to mix generators with React hooks in a neat way, in order to write much more readable code.

As a matter of fact, I planned to start with the generators article, but it quickly became obvious that they are tough to explain without a solid understanding of iterables & iterators.

That's why in this article we will focus on iterables & iterators only. We will assume no previous knowledge about them, but at the same time, we will go fairly in-depth. So if you know *something* about iterables & iterators, but you still don't feel fully comfortable using them, this article should fix that.

## Introduction

As you've noticed, we are talking about iterables *and* iterators. They are related, but distinct concepts, so while reading the article make sure to keep tabs on which one we are talking about at any given moment. 

Let's begin with iterables. What are they? An iterable is basically something that can be iterated over, like so:

```javascript
for (let element of iterable) {
    // do something with an element
}
```

Note that we are talking only about `for ... of` loops here, which were introduced in ES6. `for ... in` loops are an older construct and we will not use it at all in this article.

You might now think, "okay, this `iterable` variable is simply an array!". And indeed, arrays are iterables. But even currently in native JavaScript, there are other data structures that we could use in a `for ... of` loop. In other words, there are more iterables in native JavaScript than just arrays.

For example, we can iterate over ES6 Maps:

```js
const ourMap = new Map();

ourMap.set(1, 'a');
ourMap.set(2, 'b');
ourMap.set(3, 'c');

for (let element of ourMap) {
    console.log(element);
}
```

This code will print out:

```js
[1, 'a']
[2, 'b']
[3, 'c']
```

So variable `element` in the code above stores in each iteration step an array of two elements. The first element is a key, and the second element is a value.

The fact that we could use `for ... of` loop to iterate over Map, proves to us that Maps are iterables. Once again - *only* iterables can be used in `for ... of` loops. So if something works with that loop - it is an iterable.

Funnily enough, `Map` constructor itself optionally accepts an iterable of key-value pairs. So this is an alternative way to construct the same Map as before:

```js
const ourMap = new Map([
    [1, 'a'],
    [2, 'b'],
    [3, 'c'],
]);
```

And since - as we've just noted - Map itself is an iterable, we can create copies of Maps extremely easily:

```js
const copyOfOurMap = new Map(ourMap);
```

We have now two distinct maps, although they are storing the same values under the same keys.

So we've seen two examples of iterables so far - an array and an ES6 Map.

But we still didn't explain *how* do they possess this magic power of being able to be iterated over.

The answer is simple - they have *iterators* associated with them. Read that carefully. Itera**tors**, not itera**bles**.

In what way an iterator is associated with it's iterable? An iterable object simply has to have a function under its `Symbol.iterator` property. This function, when called, should return an iterator for that object.

For example, we can retrieve an array's iterator like so:

```js
const ourArray = [1, 2, 3];

const iterator = ourArray[Symbol.iterator]();

console.log(iterator);
```

This code will print `Object [Array Iterator] {}` to the console.

So we know that our array has an associated iterator and that this iterator is some kind of object.

What is an iterator then?

It's fairly simple. An iterator is just an object that has a `next` method. This method, when called, should return:
* next value in a sequence of values,
* information whether the iterator has finished producing values or not.

Let's test it, by calling the `next` method of the iterator of our array:

```js
const result = iterator.next();

console.log(result);
```

We will see an object `{ value: 1, done: false }` printed in the console.

The first element of the array we created was 1, so it appeared as the value here. We also got information that the iterator is not done yet, meaning we still can call the `next` function and expect to see some values.

Let's do it! In fact, let's call `next` two more times:

```js
console.log(iterator.next());
console.log(iterator.next());
```

Unsurprisingly, we get `{ value: 2, done: false }` and `{ value: 3, done: false }` printed, one after another.

But our array had only 3 elements. So what happens, if we try to call `next` yet again?

```js
console.log(iterator.next());
```

This time we see `{ value: undefined, done: true }` printed. This is information for us that the iterator has finished. There is no point calling `next` again. In fact, if we do so, we will receive the same `{ value: undefined, done: true }` object over and over again. `done: true` is a sign for us to stop the iteration.

Now we can understand what `for ... of` loop does under the hood.

* First `[Symbol.iterator]()` method is called to get an iterator,
* `next` method is being called on that iterator in a loop until we get `done: true`,
* after each call to `next`, `value` property is used in the loop's body.

Let's write all that in code:

```js
const iterator = ourArray[Symbol.iterator]();

let result = iterator.next();

while (!result.done) {
    const element = result.value;

    // do some something with element

    result = iterator.next();
}
```

All this code is directly equivalent to:

```js
for (let element of ourArray) {
    // do something with element
}
```

You can make sure that's the case by, for example, placing `console.log(element)` in place of `// do something with element` comment.

## Creating our own iterator

So we know what the iterables and iterators are. The question then becomes - is it possible to write our own instances of them?

Absolutely!

There is nothing magical about iterators. They are just objects with a `next` method, which behaves in a specified way.

We've said which native JS values are iterables. We haven't mention objects there. Indeed, they are not iterables natively. Take an object like this:

```js
const ourObject = {
    1: 'a',
    2: 'b',
    3: 'c'
};
```

When we try to iterate over that object with `for (let element of ourObject)`, we will get an error, stating that `object is not iterable`.

So let's practice writing custom iterators by making such an object an iterable!

In order to do that, we would have to patch `Object` prototype with our custom `[Symbol.iterator]()` method. Since patching prototypes is a bad practice, let's just create a custom class, extending `Object`:

```js
class IterableObject extends Object {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
}
```

The constructor of our class simply takes a regular object and copies its properties onto an iterable one (although it's not really iterable yet!).

So we will be creating an interable object like this:

```js
const iterableObject = new IterableObject({
    1: 'a',
    2: 'b',
    3: 'c'
})
```

In order to make the `IterableObject` class *actually* iterable, it needs to have a `[Symbol.iterator]()` method. Let's add it then.

```js
class IterableObject extends Object {
    constructor(object) {
        super();
        Object.assign(this, object);
    }

    [Symbol.iterator]() {

    }
}
```

Now we can start writing an actual iterator!

We already know that it has to be an object, which has a `next` method on it. So let's start with that.

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        return {
            next() {}
        }
    }
}
```

After every call to `next`, we have to return an object of shape `{ value, done }`. Let's do just that, with some dummy values.


```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        return {
            next() {
                return {
                    value: undefined,
                    done: false
                }
            }
        }
    }
}
```

Given an iterable object: 

```js
const iterableObject = new IterableObject({
    1: 'a',
    2: 'b',
    3: 'c'
})
```

we would like to print it's key-value pairs, similarily to what iterating over ES6 Map did:

```js
['1', 'a']
['2', 'b']
['3', 'c']
```

So in our custom iterator, under the `value` property we want to place an array `[key, valueForThatKey]`.

Note that this - compared to the previous steps of the example - is our own design decision. If we wanted to write an iterator that returned only keys or only property values - we might do that as well, and it would be perfectly fine. We simply ourselves decided to return key-value pairs.

So we will need arrays of shape `[key, valueForThatKey]`. The easiest way to obtain them is simply to use the `Object.entries` method.

We can use it just before creating an iterator object in the `[Symbol.iterator]()` method:

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        // we made an addition here
        const entries = Object.entries(this);

        return {
            next() {
                return {
                    value: undefined,
                    done: false
                }
            }
        }
    }
}
```

The iterator returned in that method will have an access to the `entries` variable thanks to a JavaScript closure.

But we also need some kind of state variable. It will tell us which key-value pair should be returned in a current `next` call. So let's add that as well.

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        const entries = Object.entries(this);
        // we made an addition here
        let index = 0;

        return {
            next() {
                return {
                    value: undefined,
                    done: false
                }
            }
        }
    }
}
```

Note how we declared `index` variable with a `let` because we know that we plan to update its value after each `next` call.

We are now ready to return an actual value in the `next` method:

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        const entries = Object.entries(this);
        let index = 0;

        return {
            next() {
                return {
                    // we made a change here
                    value: entries[index],
                    done: false
                }
            }
        }
    }
}
```

This was easy. We just used both `entries` and `index` variables to access a proper key-value pair from the `entries` array.

Now we have to deal with that `done` property because currently, it will be always set to `false`.

We could keep another variable - alongside `entries` and `index` - and update it after every `next` call. But there is an even easier way. We can simply check if `index` already went out of bounds of the `entries` array:

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        const entries = Object.entries(this);
        let index = 0;

        return {
            next() {
                return {
                    value: entries[index],
                    // we made a change here
                    done: index >= entries.length
                }
            }
        }
    }
}
```

Indeed, our iterator is done when the `index` variable is equal to the length of `entries` or is bigger.

For example, if `entries` has length 3, it has values under indexes 0, 1, and 2. So when the `index` variable is 3 (equal to the length), or bigger, it means there are no more values to get. That's when we are done.

This code *almost* works. There is only one more thing we need to add. 

The `index` variable starts with a value 0, but... we are never updating it!

It's actually kind of tricky because we should update it *after* we return `{ value, done }`. But when we return it, the `next` method stops running immediately, even if there is some code after the `return` statement. 

We can however create the `{ value, done }` object, store it in a variable, update the `index` and *just then* return the object:

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        const entries = Object.entries(this);
        let index = 0;

        return {
            next() {
                const result = {
                    value: entries[index],
                    done: index >= entries.length
                };

                index++;

                return result;
            }
        }
    }
}
```

After all these changes, this is how our `IterableObject` class looks so far:

```js
class IterableObject extends Object {
    constructor(object) {
        super();
        Object.assign(this, object);
    }

    [Symbol.iterator]() {
        const entries = Object.entries(this);
        let index = 0;

        return {
            next() {
                const result = {
                    value: entries[index],
                    done: index >= entries.length
                };

                index++;

                return result;
            }
        }
    }
}
```

This code works perfectly fine, but it became a bit convoluted. There is actually a smarter (but less obvious) way to deal with having to update `index` *after* creating the `result` object. We can simply initialize `index` with -1!

Then, even though the `index` update happens before returning the object from `next`, everything will work just fine, because the first update will bump -1 to 0.

So let's do just that:

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        const entries = Object.entries(this);
        let index = -1;

        return {
            next() {
                index++;

                return {
                    value: entries[index],
                    done: index >= entries.length
                }
            }
        }
    }
}
```

As you can see, now we don't have to juggle the order of creating the result object and updating `index`. That's because we are starting with -1. During the first `next` call, `index` will be updated to 0 and then we will return the result. 

During the second call, `index` will be updated to 1 and we will return another result, etc...

So everything will work just as we wanted, and the code looks now much simpler than the previous version.

How we can test if it really works properly? We could manually run `[Symbol.iterator]()` method to create an iterator instance, then directly test the results of `next` calls, etc.

But there is a much simpler way!  We've said that every iterable can be plugged into `for ... of` loop! So let's do just that and log the values returned by our custom iterable:

```js
const iterableObject = new IterableObject({
    1: 'a',
    2: 'b',
    3: 'c'
});

for (let element of iterableObject) {
    console.log(element);
}
```

It works! You will see the following result printed in the console:

```js
[ '1', 'a' ]
[ '2', 'b' ]
[ '3', 'c' ]
```

That's exactly what we wanted!

Isn't this cool? We've started with objects not being able to be used in `for ... of` loops because natively they don't have built-in iterators. But we created a custom `IterableObject`, which *does* have an associated iterator, which we have written by hand.

I hope that by now you can see and appreciate the power of iterables and iterators. It's a mechanism that allows your own data structures to cooperate with JS features like `for ... of` loops, in a way indistinguishable from the native data structures! That's very powerful and in certain situations, it can vastly simplify the code, especially if you plan to do iterations on your data structures often.

On top of that, we can customize what exactly such iteration will return. We've settled on returning key-value pairs from our iterator. But what if we cared only about the values themselves? No problem! We can just rewrite our iterator:

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        // changed `entries` to `values`
        const values = Object.values(this);
        let index = -1;

        return {
            next() {
                index++;

                return {
                    // changed `entries` to `values`
                    value: values[index],
                    // changed `entries` to `values`
                    done: index >= values.length
                }
            }
        }
    }
}
```

And that's it!

If we run `for ... of` loop after this change, we will see the following output in the console:

```
a
b
c
```

So we really returned only the objects values, just as we wanted.

This proves how flexible your custom iterators can be. You can really make them return whatever you wish.

## Iterators as... iterables

You will see people very often confusing iterators and iterables.

That's a mistake and I was trying to carefully differentiate between the two in this article, but I think I know one of the main reasons why people confuse them so often.

It turns out that iterators... are sometimes iterables as well!

What does it mean? We said that an iterable is an object that has an iterator associated with it.

It turns out that every native JavaScript iterator also has a `[Symbol.iterator]()` method, returning yet another iterator! This - according to our previous definition - makes that first iterator an iterable.

We can check that it is true, by taking an iterator returned from an array and calling `[Symbol.iterator]()` on it once more:

```js
const ourArray = [1, 2, 3];

const iterator = ourArray[Symbol.iterator]();

const secondIterator = iterator[Symbol.iterator]();

console.log(secondIterator);
```

After running this code, you will see `Object [Array Iterator] {}`.

So not only our iterator has another iterator associated with it, but we also see that it is again an array iterator.

In fact, if we compare those two iterators with `===`, it turns out that this is simply exactly the same iterator:

```js
const iterator = ourArray[Symbol.iterator]();

const secondIterator = iterator[Symbol.iterator]();

// logs `true`
console.log(iterator === secondIterator);
```

This behavior of an iterator being its own iterator might seem strange at the beginning.

But it's actually fairly useful.

You cannot plug a bare iterator into the `for ... of` loop. `for ... of` accepts only an iterable - that is an object with a `[Symbol.iterator]()` method.

However, an iterator being its own iterator (and hence an iterable) mitigates that problem. Since native JavaScript iterators *do* have `[Symbol.iterator]()` methods on them, you can pass them to `for ... of` loops directly without thinking twice.

So because of that feature, both:

```js
const ourArray = [1, 2, 3];

for (let element of ourArray) {
    console.log(element);
}
```

and:

```js
const ourArray = [1, 2, 3];
const iterator = ourArray[Symbol.iterator]();

for (let element of iterator) {
    console.log(element);
}
```

work without any problems and do exactly the same thing.

But why would you even want to use an iterator directly in a `for ... of` loop like that? The answer is simple - it turns out that sometimes it is simply unavoidable.

First of all, you might want to create an iterator without any iterable to which it belongs. We will see such example later, and it's actually not *that* rare to create such "bare" iterators. Sometimes an iterable itself just isn't needed.

And it would be very akward if having a bare iterator meant you couldn't just consume it via `for ... of`. It's of course always possible to do it manually with a `next` method and, for example, a `while` loop, but we've seen that it requires quite a lot of typing and boilerplate. 

It's simple - if you want to avoid that boilerplate and use your iterator in a `for ... of` loop, you have to make it an iterable as well.

On the other hand, you will also quite often receive iterators from methods other than `[Symbol.iterator]()`. For example, ES6 Map has `entries`, `values` and `keys` methods. All of them return iterators.

If native JavaScript iterators weren't iterables as well, you couldn't just use those methods directly in `for ... of` loops like that:

```js
for (let element of map.entries()) {
    console.log(element);
}

for (let element of map.values()) {
    console.log(element);
}

for (let element of map.keys()) {
    console.log(element);
}
```

The code above works, because iterators returned by the methods are also iterables.

If they weren't, we would have to, for example, awkardly wrap a result from `map.entries()` call in some kind of a dummy iterable. Luckily we don't have to, and we can just use those methods directly, without worrying too much about it.

For those reasons, it is a good practice to make your custom iterators iterables as well. *Especially* if they will be returned from some methods other than `[Symbol.iterator]()`.

And it's actually very simple to make an iterator an iterable. Let's do that with our `IterableObject` iterator.

```js
class IterableObject extends Object {
    // same as before

    [Symbol.iterator]() {
        // same as before

        return {
            next() {
                // same as before
            },

            [Symbol.iterator]() {
                return this;
            }
        }
    }
}
```

As you can see, we just created a `[Symbol.iterator]()` method under the `next` method.

We've made this iterator it's own iterator by simply returning `this` - so it just returned itself. We've seen that that's exactly how the array iterator behaved.

That's enough to make sure that our iterator works with `for ... of` loops, even when used in them directly.

## State of an iterator

It should be fairly clear by now that each iterator has a state associated with it.

For example in our `IterableObject` iterator, we kept the state - an `index` variable - as a closure.

After each iteration step, that `index` was updated.

So what happens after the iteration process ends? It's simple - the iterator becomes useless and we can (and should!) discard it.

We can doublecheck that this happens even with iterators of native JavaScript objects.

We will take an iterator of an array and try to run it in a `for ... of` loop twice.

```js
const ourArray = [1, 2, 3];

const iterator = ourArray[Symbol.iterator]();

for (let element of iterator) {
    console.log(element);
}

for (let element of iterator) {
    console.log(element);
}
```

You might expect to see numbers `1, 2, 3` appearing in the console twice. But this is not what happens. The result is still just:

```
1
2
3
```

But why?

We can discover that, by trying to call `next` manually, after the loop finishes:

```js
const ourArray = [1, 2, 3];

const iterator = ourArray[Symbol.iterator]();

for (let element of iterator) {
    console.log(element);
}

console.log(iterator.next());
```

The last log prints `{ value: undefined, done: true }` to the console.

Aaah. So after the loop finishes, the iterator is now in its "done" state. From now on it always return a `{ value: undefined, done: true }` object.

Is there a way to "reset" the state of this iterator, in order to use it in a `for ... of` loop second time?

In some cases perhaps, but there is really no point. This is exactly why `[Symbol.iterator]` is a method and not just a property. We can simply call that method again to obtain *another* iterator:

```js
const ourArray = [1, 2, 3];

const iterator = ourArray[Symbol.iterator]();

for (let element of iterator) {
    console.log(element);
}

const secondIterator = ourArray[Symbol.iterator]();

for (let element of secondIterator) {
    console.log(element);
}
```

Now it works as we would expect.

Right now you should be able to understand why looping over an array directly multiple times works:

```js
const ourArray = [1, 2, 3];

for (let element of ourArray) {
    console.log(element);
}

for (let element of ourArray) {
    console.log(element);
}
```

That's because each of those `for ... of` loops uses a *different* iterator! After an iterator is done and a loop ends, that iterator is never used again.

## Iterators vs arrays

Because we use iterators (although indirectly) in `for ... of` loops, they might look to you deceivingly similar to arrays.

But there are two important distinctions to be made between the iterators and the arrays.

Both of them have to do with the concept of eager and lazy values.

When you create an array, at any given moment it has a specific length and its values are already initialized. 

I mean, sure, you can create an array wihout any values inside, but that's not what we mean here. 

We mean that it is impossible to create an array that initializes its value only *after* you attempt to access that value by writing `array[someIndex]`. I mean, perhaps it is *possible* with some Proxy or other JS trickery, but by default JavaScript arrays don't behave in that way. You just create an array with values initialized beforehand and that's it.

And when saying that an array has a length, we in fact mean that the array is of a finite length. There are no infinite arrays in JavaScript.

Those two qualities point to the *eagerness* of arrays.

On the other hand, iterators are *lazy*.

To show that, we will create two custom iterators - the first one will be an infinite iterator, in contrast to finite arrays, and the second will initialize its values only when they are actually needed/requested by whoever is using the iterator.

Let's start with the infinite iterator. This might sound scary, but we will create something very simple - an iterator that starts at 0 and at each step returns the next integer in a sequence. Forever.

```js

const counterIterator = {
    integer: -1,

    next() {
        this.integer++;
        return { value: this.integer, done: false };
    },

    [Symbol.iterator]() {
        return this;
    }
}

```

That's it! We start with the `integer` property equal to -1. At each `next` call we bump it by one and return it as a `value` in the result object.

Note that we used here the same trick as before - starting at -1 in order to return 0 as the first result.

Look also at the `done` property. It will be *always* false. This iterator never ends!

Third thing, which you've probably noticed yourself - we have made this iterator an iterable, by giving it a simple `[Symbol.iterator]()` implementation.

And one last note. This is the case that we've been mentioning earlier - we've created an iterator, but there is no iterable in sight! This is an iterator which doesn't need an iterable "parent" for anything.

We can now try out this iterator in a `for ... of` loop. We just need to remember to break out of the loop at some point. Otherwise, the code would run forever!

```js
for (let element of counterIterator) {
    if (element > 5) {
        break;
    }
    
    console.log(element);
}
```

After running this code we will see the following in the console:

```
0
1
2
3
4
5
```

So we really created an infinite iterator, which can return you as many integers as you wish. And it was actually very easy do achieve!

Now, let's make an iterator, which doesn't create its values until they are requested.

Well... we already did it!

Have you noticed that at any given moment, our `counterIterator` stores only one number on the `integer` property? It stores only the last number that it has returned in a `next` call.

This is indeed the laziness we were talking about. This iterator can *potentially* return any number (non-negative integer, to be specific). But it only creates a number when it is actually needed - when someone is calling the `next` method.

This might not seem like a big benefit. After all, numbers are created fast and they don't occupy a lot of memory.

But if you are dealing with very big, memory-heavy objects in your code, sometimes swapping arrays for iterators can be extremely valuable, making your program faster more memory efficient.

The heavier the object (or the longer it takes to create it), the bigger the benefit.

## Some other ways to consume iterables

So far we've been playing only with a `for ... of` loop, or we've been consuming our iterators manually, using the `next` method.

But those are not your only options!

We've already seen that `Map` constructor accepts an iterable as an argument.

You can also easily transform an iterable into an actual array by using `Array.from` method. Be careful though! As we've said, laziness is sometimes a big benefit of an iterator. Converting it to an array gets rid of all the laziness. All the values returned by an iterator get initialized immediately and then they get put into an array.

In particular, this means that trying to convert our infinite `counterIterator` into an array would result in a catastrophe. `Array.from` would just run forever and never return any result! So before converting an iterable/iterator to an array, make sure it's a safe operation.

Interestingly, iterables also play nicely with a spread operator (`...`). Just keep in mind that this works similarly to an `Array.from`, where all the values of an iterator get initialized at once.

For example, we can use the spread operator to create our own version of `Array.from`.

We just apply the operator on an iterable and then put the values into an array:

```js

const arrayFromIterator = [...iterable];

```

We can also get all the values from an iterable and apply them to a function:

```js

someFunction(...iterable);

```

## Conclusion

I hope that at this point you understand why the title of this article was "Iterables *and* Iterators".

We've learned what are they, how do they differ, how to use them, and how to create your own instances of them.

This makes us more than ready to deal with generators. In fact, if you understand iterators well, then jumping into generators should be no problem at all!

If you've enjoyed this article and want more, remember to subscribe to me on [Twitter](https://twitter.com/m_podlasin).

Thanks for reading!

