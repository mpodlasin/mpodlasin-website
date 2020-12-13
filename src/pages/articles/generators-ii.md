---
slug: "/articles/betas/generators-ii"
date: "2019-05-04"
title: "Generators - An In-Depth JavaScript Tutorial"
subtitle: "Part II"
---

## An iterator is more than just next()...

After learning about iterators, you might believe that they only possess one method - `next`.

Although that's the only *obligatory* method, that they need to have, there are also two methods, which your iterators *might* have, if you decide to implement them.

The first is a `return` method. This method is used to notify the iterator, the a consumer has decided to finish the iteration and they don't intend to do any more calls to the `next` method.

It turns out, for example, that a `break` statement in a `for ... of` loop will trigger that method.

Let's take a simple infinite iterator returning integers:

```js
const counterIterator = {
    index: -1,
    next() {
        this.index++
        return {
            value: this.index,
            done: false
        };
    },
    [Symbol.iterator]() {
        return this;
    }
}
```

Let's add a `return` method on it, where we will just use `console.log` to make sure that it was called:

```js
const counterIterator = {
    index: -1,
    next() {
        this.index++
        return {
            value: this.index,
            done: false
        };
    },
    // return method added:
    return() {
        console.log('return was called');
    },
    [Symbol.iterator]() {
        return this;
    }
}
```

Let's run that iterator in a simple `for ... or` loop:

```js
for (let elements of counterIterator) {
    if (elements > 5) {
        break;
    }
    console.log(elements);
}
```

In the console you will see the output:

```
0
1
2
3
4
5
return was called
```

So we see that, indeed, the iterator was running as usual, than we called `break` in the loop, which triggered the `return` function, which in turn logged a string to the console.

However interestingly, after this output, we also get an error message in the console:

```
TypeError: Iterator result undefined is not an object
```

It turns out, that `return` method has to obey the same rules as the `next` method - it's output has to be an object of shape `{ value, done }`.

So let's add that object:

```js
const counterIterator = {
    index: -1,
    next() {
        this.index++
        return {
            value: this.index,
            done: false
        };
    },
    return() {
        console.log('return was called');
        // now we return a value:
        return {
            done: true,
            value: undefined
        };
    },
    [Symbol.iterator]() {
        return this;
    }
}
```

As you can see, we've set `done` to `true`, which is the only reasonable value here.

We also don't have any reasonable value to return, so we've just set `value` to `false`.

At the point our code has the same behavior - outputing numbers and `returns was called` string - but now it runs without any errors.

The second optional method of an iterator is `throw` method, which has similar behavior as `return`, but this time calling it is supposed to mean that something went wrong with the iteration.

Now you might ask - why would it be useful to have those methods? Having a `return` called when the `break` happens in a loop might actually be useful in situations where you might want to do some kind of cleanup of your iterator. But granted, in most cases this is not needed, since each iteration typically uses a brand new iterator and the previous one simply gets discarded.

The real answer is that those methods become actually useful, when combined


