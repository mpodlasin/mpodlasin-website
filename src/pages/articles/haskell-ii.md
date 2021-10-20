---
slug: "/articles/haskell-ii"
date: "2021-08-10"
title: "Haskell - The Most Gentle Introduction Ever (Part II)"
---

This article is a second in my series explaning the basics of Haskell.

If you didn't, I would recommend you to read [the first article](https://mpodlasin.com/articles/haskell-ii), before diving into this one.

So far we've learned the basics of defining functions and datatypes, as well as using them, all based on a Haskell `Bool` type.

In this article we will deepen what we've learnt so far, learning more built-in Haskell types on the way.

#### Type of Number 5

Before we begin this section, I must warn you.

In the previous article I purposefully used `Bool` type, due to its simplicity. You might think that types representing numbers would be equally simple in Haskell. However that's not *really* the case.

Not only Haskell has quite a lot of types representing numbers, but there is also a singinicant effort in the language to make those types as interoperable as possible. Because of that, there is a certain amount of complexity, which can be confusing for the beginners.

To see that, type in the following in the `ghci`:

```
:t 5
```

You would expect to see a very simple answer, describing the type of the value `5`. However what we see is this:

```hs
5 :: Num p => p
```

Quite confusing, isn't it? 

What is written here is that the value `5` has type `p`. This is the first time we see the name of the type being written using a small letter. 

That's important. Indeed, `p` is not a specific type. It is a *type variable*. This means that `p` can be potentially many different, concrete types.

It wouldn't however make sense for `5` to have - for example - `Bool` type. That would be nonsense. That's why `Num p =>` part is also written in the type description. It basically says that this `p` has to be a *numeric* type. So, overall, `5` has type `p`, as long as `p` is a *numeric* type. For example, writting `5 :: Bool` would be forbidden.

The precise mechanism at play here will not be discussed right now. We still have to cover a few basics before we can explain it fully and easily. But perhaps you've heard it about it already. It's called *typeclasses*. We will learn typeclasses very soon, and after we do, this whole description will be absolutely clear to you.

For now however we don't really need to go into specifics. Thorought this article we will use conrete, specific types, so that you don't get confused. I am just warning you about the existence of this mechanism, so that you don't get unpleasantly surprised when you investigate the types of functions or values on your own.

#### Functions and Operators

Let's begin by doing some simple operations on numbers, familiar from other programming languages.

We can add two numbers. Writing in `ghci`:

```hs
5 + 7
```

results in a resonable answer:

```hs
12
```

To get a better grasp at what is going on here, let's write a "wrapper" function for adding numbers.

We would like to of course begin with a type signature of a function:

```hs
add :: ???
```

As I mentioned before, Haskell has many different types for number values. Let's say that we want to work only with integers for now. Even for integers there are multiple types to choose from.

Two most basic ones are `Integer` and `Int`.

`Int` is a type that is "closer to the machine". It's a "fixed precision" integer type. This means that - depending on the architecture of your computer - each `Int` will have a limited number of bits reserved for its value. Going out of those bounds can result in confusing errors. This is a type very similar to C/C++ `int` type.

`Integer` on the other hand is an "arbitrary precision" integer type. This means that the values can get potentially bigger than those of `Int`. Haskell will just reserve more memory if that becomes necessary.

At the first glance it would seem that `Integer` has some clear advantages, however `Int` is being widely used where memory efficiency is important or where we have guarantees that numbers will not become too big.

For now we will use `Integer` type. We can finally write the singature of our function:

```hs
add :: Integer -> Integer -> Integer
```

What we have written here is probably a bit confusing. So far, we've only written declarations of functions that accept a single value and return a single value.

However when adding numbers, we have to accept two values as parameters (two numbers to add) and then return a single result (number resulting from adding two numbers). So in our type singature about, first two `Integer`s represent paramters and the last `Integer` represents the return value.

Let's now write the implementation:

```
add :: Integer -> Integer -> Integer
add x y = x + y
```

Create a file called `lesson_02.hs` and write that definition. Next, load the file in `ghci` and type:

```hs
add 5 7
```

As expected you will see our resonable response.

```hs
12
```

I will now show you a neat trick. If your function accepts two arguments - like it is the case with `add` - you can use an "infix notation" to call a function. Write:

```hs
5 `add` 7
```

You will again see `12` as a response.

Note that we didn't have to change the definition of `add` in any way, we just used backticks and we were immediately able to use it in infix notation. You can use this feature with literally any function that accepts two parameters - this is not a feature restricted only to funcitons operating on numbers.

At this point those two calls:

```hs
5 `add` 7
```

and

```hs
5 + 7
```

look eerily similar.

That's not an accident. Indeed, you can do a reverse, and call `+` "operator" as you would a regular function - before the parameters. If it's an operator, you just have to wrap it in parantheses:

```hs
(+) 5 7
```

This works and returns `12` again!

Perhaps you already know where am I going with this. I am trying to show you that built-in `+` operator is indeed just a function. There are of course syntactical differences (like using backtics or parantheses for certain calls), but conceptually it is good to think of `+` as being no different than `add`. Both are functions that work on `Integer` type - accept two `Integer` numbers and return an `Integer` number as a result.

Indeed, you can even investigate the type of an operator in `ghci`, just as you would investigate the type of `add` function.

Typing:

```hs
:t (+)
```

results in:

```
(+) :: Num a => a -> a -> a
```

This means that `+` has type `a -> a -> a`, where `a` has to be a numeric type. So it's a function that accepts two parameters of type `a` and returns the result of the same type.

#### Partial Application

Let's go back to the type of `add` functions, which is probably friendlier to read at this point of our Haskell adventure:

```hs
add :: Integer -> Integer -> Integer
```

The way we write the type definition of a function accepting two parameters might be surprising to you. We see two `->` arrows in the definition, almost suggesting that we are dealing with two functions here.

And indeed we are!

In order to increase the readability even more, we can use the fact that `->` is right associative. This basically means that our type definition is equivalent to this:

```hs
add :: Integer -> (Integer -> Integer)
```

Focus on the part that is outside of parantheses first:

```
add :: Integer -> (...)
```

This basically says that `add` is a function that accepts an `Integer` and returns *something*.

What is that thing that gets returns? In order to find out, we have to look inside the parantheses:

```hs
(Integer -> Integer)
```

This is - again! - a function that accepts an `Integer`. This second function returns an `Integer` as a result.

So if we look at the type of `add` again:

```
add :: Integer -> Integer -> Integer
```

we see that - in a sense - I was lying to you the whole time! I was saying that this is how we describe a function that accepts two parameters. But that's false! There is no funciton that accepts two parameters here - there is only a function that accepts a single parameter and then... returns another function! And then that second functions accepts another ("second") parameter and then returns a result!

To state it in terms of another language, here is how you would write a function that accepts two parameters in JavaScript:

```js
function add(x, y) {
    return x + y;
}
```

However in Haskell that's not the case! In Haskell we create something closer to this:

```js
function add(x) {
    return function(y) {
        return x + y;
    }
}
```

Note how we have two functions here, each accepting only a single parameter.

So, at least in principle, we should be able to call `add` function with only one parameter.

Let's try that in `ghci`:

```hs
add 5
```

Regrettably, we get an error message:

```
<interactive>:108:1: error:
    • No instance for (Show (Integer -> Integer))
        arising from a use of ‘print’
        (maybe you haven't applied a function to enough arguments?)
    • In a stmt of an interactive GHCi command: print it
```

It turns out however, that this is not really a problem. The problem arises, because `add 5` returns - as we stated - a function and Haskell doesn't know how to print a function.

We can however check the type of `add 5` expression and convince ourselves that this indeed works:

```
:t add 5
```

As a result, we see:

```hs
add 5 :: Integer -> Integer
```

So it's a success! Expression `add 5` has type `Integer -> Integer`, as we wanted!

We can convince ourselves even more that that's the case, by calling that `add 5` function on a number:

```hs
add 5 7
```

Oh... Wait. We just discovered something! It was probably confusing so far why Haskell has this strange way of calling functions on values, especially on multiple values. We were just separating them by space, like so:

```hs
f x y z
```

Now it becomes clear, that Haskell simply deal with single-argument functions all the time and calling a function on multiple values is simply an illusion!

Our call:

```hs
add 5 7
```

is equivalent to:

```hs
(add 5) 7
```

First we apply `add` to `5` and as a result we get a function of type `Integer -> Integer`, as we've just seen.

Then we apply that new function (`add 5`) on a value `7`. As a result we get an `Integer` - number `12`.

#### More Numbers and Operations

This section will be far from a complete rundown, however I want to take you quickly up to speed with operations on numbers in Haskell.

So far we've covered two numeric types - `Integer` and `Int` and we've shown that we can add them.

Just as in other languages, we can also substract and multiply them in usual way.

So:

```hs
5 - 2
```

results in:

```hs
3
```

while:

```hs
5 * 3
```

results in:

```hs
15
```

Another popular number types are `Float` and `Double`. Those are number types that can represent numbers beyond simple integers. The main difference between `Float` and `Double` is how big their storage capacity is. Most of the time you will likely use `Double`, unless you have some specific reason to use `Float`.

`Float` and `Double` values can be added, substracted and multiplied just like `Int` and `Integer` values.

#### Identity

Let's now take a small break from numbers and go back to our beloved booleans.

Previously, we have written a `not` function, which was reversing the booleans, converting `True` to `False` and `False` to `True`.

But what if we wanted to do... the opposite?

What if we wanted to create a function that returns `True` when passed `True` and returns `False` when passed `False`? This might sound a bit nonsensical. In a way, this function would do literally nothing. We will see however, that this function will have a tremendous educational value for us, so let's curb our doubts and try to write it anyway.

First let's start with the type signature. We will call our function `identity`, because in mathematics a function that returns exactly the same thing that it was passed is often called like that.

`identity` will receive a `Bool` and return exactly the same thing, so... `Bool` as well!

```hs
identity :: Bool -> Bool
```

Now let's get started with an actual implementation. Your first instinct might be to write something like this:

```hs
identity True = True
identity False = False
```

This will work perfectly fine and is a valid solution, but there is a way to write the same thing in a more terse way. After all, we are returning the same value that we are receiving as parameter, so we can simply write:

```hs
identity x = x
```

In the end, our whole definition looks like that:

```
identity :: Bool -> Bool
identity x = x
```

You can convince yourself that it works, by running it in `ghci`:

```hs
identity True
```

This call results in:

```hs
True
```

And at the same time `identity False` returns `False` (hopefully not surprisingly).

Now let's create the same function, but for numbers - let's say `Integer`s. We want a function that will take an `Integer` value and return... exactly the same value.

To avoid collisions, let's call it `identityInteger`. Let's begin by writing the type signature:

```hs
identityInteger :: Integer -> Integer
```

This was simple. Now let's think about the implementation. Well... we want to take the parameter passed to the function and... just return it!

So we get:

```hs
identityInteger x = x
```

But... but this is exactly the same implementation as in the case of `identity` for `Bool` values!

Let's compare the two:

```hs
identity :: Bool -> Bool
identity x = x
```

```hs
identityInteger :: Integer -> Integer
identityInteger x = x
```

Everything looks the same. The only difference here are the types really. In the first function we operate on `Bool` type. In the second we operate on `Integer` type.

Now, if only there was a way to write that function only once. In this state of things, we would have to write an identity function for each type in existence, which... sounds daunting, to say the least.

It luckily turns out that Haskell does have a mechanism to deal with that in an easy way. Not only that - we've already encountered that mechanism!

Remember how the type of number `5` was `Num p => p`? The `p` in the type description was a type variable - basically a placeholder for actual, concrete types. 

So the question is, can we use a type variable, to write the most generic version of identity function possible? The answer is... absolutely!

Let's remove the two identity functions and replace them with only one:

```hs
identity :: a -> a
identity x = x
```

Note how we used `a` as a type variable here. The 3 type definitions we've seen so far, share the same "shape". You can see that type definitions of identity for `Bool`s and for `Integer`s both "fit" this new type definition, if you imagine `a` being a placeholder for other types:

```hs
boolIdentity :: Bool -> Bool
```
```hs
integerIdentity :: Integer -> Integer
```
```hs
identity :: a -> a
```

Let's run this code in `ghci` and convince ourselves that we can ideed use this new, generic identity on both `Bool` and `Integer` values:

```hs
identity True
```

works and results in:

```
True
```

And at the same time:

```hs
identity 5
```

works as well and results in:

```hs
5
```

Now at this point it's important to emphasize a certain point. Give the implementation that we've used for identity:

```hs
identity x = x
```

We couldn't give it the following type:

```
identity :: Integer -> Bool
```

Now, this type in itself is not absurd. You can easily imagine functions that accept integers and return true/false, based on some condition.

However in this particular case, where we take parameter `x` and immediately return it, without doing anything else, it's clearly impossible for `x` to "magicaly" change the type.

And this fact *is* reflected even in the most generic type definition of identity:

```hs
identity :: a -> a
```

Note that this definition states that `identity` accepts a value of type `a` and returns a value **of that same type** - namely `a` again.

On the flipside, the following definition:

```hs
identity :: a -> b
```

wouldn't be allowed. In fact it won't compile, with an error, which part of says:

```
Couldn't match expected type ‘b’ with actual type ‘a’
```

So the compiler literally says that in place of `b` there should be the type variable `a` present.

That's because - given the current implementation - it's impossible for parameter `x` to change type out of nowhere.

And indeed, when Haskell infers the type of the code, it goes for the most general interpretation possible.

You can convience yourself of that, by removing the type definition, leaving only implementation:

```hs
identity x = x
```

And then compiling it in `ghci` and checking the type of `identity` by running:

```
:t identity
```

As an answer you will see:

```hs
identity :: p -> p
```

This is exactly the same type definition that we wrote by hand. It simply uses a different letter (`p` instead of `a`). But because this letter is used twice in the type definition, it still expresses the same idea of a "function that accepts a value of some type and returns the value of that exact same type".

At the very end of that section it would be good to mention, that you don't actually have to define the `identity` function for yourself. We only did it for educational purposes.

`Prelude` - standard library for Haskell - has it available for you under the shorter name `id`.

To convince yourself of that, write the following in `ghci`:

```
:t id
```

As a response you will see, more than familiar now, type:

```
id :: a -> a
```

#### Conclusion

In the second part of "The Most Gentle Introduction" to Haskell, we used both operators and functions on numbers, and discovered that they are in fact almost the same. We've also seen that there are no functions of multiple variables in Haskell - only functions that return other functions. 

And at the end we expanded our understanding of what a type definition can be, by showing the simplest possible usage of type variables - using `identity` function as an example.

All those things were meant to make you feel more comfortable with the concept of a function in Haskell. And in the future article we will use a similar approach to enhance our understanding of algebraic data structures, especially custom ones.