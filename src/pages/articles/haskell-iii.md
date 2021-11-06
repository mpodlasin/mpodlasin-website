---
slug: "/articles/haskell-iii"
date: "2021-10-24"
title: "Haskell - The Most Gentle Introduction Ever (Part III)"
---

Welcome to the 3rd article of my "The Most Gentle Introduction Ever" series, where we go through the basics of Haskell.

Of course checkout [two] [previous] articles in the series, before jumping into this one.

In this article we will focus mostly on data structures and algebraic data types. We've already shown you an example of how to create a custom type in the first article of the series.

Here we will expand this idea much more, allowing you to build data structures of basically unlimited complexity.

But before we do that, we will introduce two more built-in Haskell data types - lists and tuples. This will allow you to get comfortable with an idea of types which "contain" other types.


## Lists and Tuples

You perhaps know lists and tuples from other languages.

Tuples are more rare, but do exist in mainstream langauges, like Python for example.

On the other hand, some kind of "list-like" data structures exist in almost any modern language. Think arrays in JavaScript.

The reason why we have waited so long with introducing them, is that they are much different than types like numbers or booleans. Namely, they are types that "contain" other types.

Let's create a list containg integers. In Haskell you would do it in a way which probably looks very familiar to you:

```hs
[1, 2, 3]
```

Nothing scary here. Just a list of three integers.

Note how we immediately used the phrase "list of integers". Lists are always lists of *something*. And we would like that fact to be reflected in the type definition.

Let's name this array:

```hs
x = [1, 2, 3]
```

Now let's write a type definition for `x`. But bare in mind, this is a fake syntax, not really existing in Haskell, that we use only to prove a point. Imagine, that the type definition would look like this:

```hs
x :: List
```

Imagine you are writing a function that accepts `x` as an argument. The only thing you know about it is that it's a list. But what it might contain? We have no clue.

This would force us to write weird code, checking at runtime types of items on that list. And in fact you see code like that often in JavaScript:

```js
function doSomethingWith(x) {
  for (let element of x) {
    if (typeof element === 'number') {
      // do something...
    }
  }
}
```

It results in very verbose code, buggy behavior (for example forgeting to handle some type). But the worst thing is that it leads to this weird paranoia mentality, where you are constantly checking and double-checking types of everything at runtime.

We don't want that in Haskell. We want code that gets type-checked *before* the code even runs, so that we can be sure we are operating on types we expect to see. This means less verbose code and less paranoia.

That's why, coming back to lists specifically, the type definition of list includes also the type of its elements:

```
x :: [Integer]
x = [1, 2, 3]
```

Here `x :: [Integer]` means "`x` is a list, containing values of type `Integer`". Or putting it more simply: "`x` is a list of integers".

Note that Haskell creators purposefully made the type definition `[Integer]` resemble how actual value is created `[1]`, so that reading the type definion is easier and feels more natural. At the very least, it makes the types involving lists immediately recognizable.

Fire up `ghci`, create a file `lesson_03.hs` and rewrite that definition. Load the file in `ghci` by running `:l lesson_03.hs` and convince yourself, what is the type of `x`, by running:

```
:t x
```

You will see:

```hs
x :: [Integer]
```

which is what we expected.

If you type:

```
x
```

`ghci` will respond to you with the value of `x`:

```hs
[1,2,3]
```

Let's play around with some functions operating on lists. We can use `head` function, to access the first element on the list:

```hs
head x
```

results in:

```
1
```

On the opposite spectrum `tail` returns the whole list *but* the first element:

```hs
tail x
```

results in:

```hs
[2, 3]
```

