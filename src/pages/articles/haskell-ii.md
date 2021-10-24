---
slug: "/articles/haskell-ii"
date: "2021-10-24"
title: "Haskell - The Most Gentle Introduction Ever (Part II)"
---

This is the second article in my little series explaining the basics of Haskell.

If you haven't yet, I would recommend you to read [the first article](https://mpodlasin.com/articles/haskell-i), before diving into this one.

So far we've learned the basics of defining functions and datatypes, as well as using them, all based on the Haskell `Bool` type.

In this article, we will deepen our understanding of functions in particular, while also learning a bit about built-in Haskell types representing numbers.

#### Type of Number 5

Before we begin this section, I must warn you. In the previous article, I purposefully used the `Bool` type, due to its simplicity. 

You might think that types representing numbers would be equally simple in Haskell. However, that's not *really* the case.

Not only does Haskell have quite a lot of types representing numbers, but there is also a significant effort in the language to make those types as interoperable with each other as possible. Because of that, there is a certain amount of complexity, which can be confusing to beginners.

To see that, type in the following in the `ghci`:

```
:t 5
```

You would probably expect to see something simple and concrete, like `Number` or `Int`. However, what we see is this:

```hs
5 :: Num p => p
```

Quite confusing, isn't it? 

For a brief second try to ignore that whole `Num p =>` part. If it wasn't there, what we would see, would be just `5 :: p` So what is written here is that the value `5` has type `p`. 

This is the first time we see the name of the type being written using a small letter. That's important. Indeed, `p` is not a specific type. It is a *type variable*. This means that `p` can be potentially many different, concrete types.

It wouldn't however make sense for `5` to have - for example - `Bool` type. That's why `Num p =>` part is also written in the type description. It basically says that this `p` has to be a *numeric* type. 

So, overall, `5` has type `p`, as long as `p` is a *numeric* type. For example, writing `5 :: Bool` would be forbidden, thanks to that restriction.

The exact mechanism at play here will not be discussed right now. We still have to cover a few basics before we can explain it fully and in detail. But perhaps you've heard it about it already - it's called *typeclasses*. We will learn about typeclasses very soon. After we do, this whole type description will be absolutely clear to you.

For now, however, we don't need to go into specifics. Throughout this article, we will use concrete, specific types, so that you don't get confused. I am just warning you about the existence of this mechanism so that you don't get unpleasantly surprised and discouraged when you investigate the types of functions or values on your own. 

Which I encourage you to do! Half of reading Haskell is reading the types, and you should be getting used to that.

#### Functions and Operators

Let's begin by doing some simple operations on numbers, familiar from other programming languages.

We can, for example, add two numbers. Writing in `ghci`:

```hs
5 + 7
```

results in a fairly reasonable answer:

```hs
12
```

But to get a deeper insight into what is happening there, let's write a "wrapper" function for adding numbers.

We will call it `add` and we will use it like so:

```hs
add 5 7
```

As a result, we should see the same answer as just a moment ago:

```hs
12
```

We would like to, of course, begin with a type signature of that function. What could it potentially be?

```hs
add :: ???
```

As I mentioned before, Haskell has many different types available for numerical values. 

Let's say that we want to work only with integers for now. Even for integers, there are multiple types to choose from.

The two most basic ones are `Integer` and `Int`.

`Int` is a type that is "closer to the machine". It's a so-called fixed precision integer type. This means that - depending on the architecture of your computer - each `Int` will have a limited number of bits reserved for its value. Going out of those bounds can result in errors. This is a type very similar to C/C++ `int` type.

`Integer` on the other hand is an arbitrary precision integer type. This means that the values can potentially get bigger than those of `Int`. Haskell will just reserve more memory if that becomes necessary. So those integers are "arbitrarily" large, but, of course, only in principle - if you completely run out of computer memory, nothing can save you.

At the first glance, it would seem that `Integer` has some clear advantages. That being said, `Int` is still being widely used where memory efficiency is important or where we have high confidence that numbers will not become too large.

For now, we will use the `Integer` type. We can finally write the signature of our function:

```hs
add :: Integer -> Integer -> Integer
```

What we have written here is probably a bit confusing at the first glance. 

So far, we've only written declarations of functions that accept a single value and return a single value.

But when adding numbers, we have to accept *two* values as parameters (two numbers to add) and then return a single result (a sum of those numbers). So in our type signature, the first two `Integer` types represent parameters and the last `Integer` represents the return value:

```hs
add :: Integer {- 1st parameter -} -> Integer {- 2nd parameter -} -> Integer {- return value -}
```

(By the way, you can see here what syntax we've used to add comments to our code.)

Let's now write the implementation:

```hs
add :: Integer -> Integer -> Integer
add x y = x + y
```

Simple, right?

Create a file called `lesson_02.hs` and write down that definition. Next, load the file in `ghci` (by running `:l lesson_02.hs`) and type:

```hs
add 5 7
```

As expected, you will see the reasonable response:

```hs
12
```

I will now show you a neat trick. If your function accepts two arguments - like it is the case with `add` - you can use an "infix notation" to call a function. Write:

```hs
5 `add` 7
```

You will again see `12` as a response.

Note that we didn't have to change the definition of `add` in any way to do that. We just used backticks and we were immediately able to use it in infix notation. 

You can use this feature with literally any function that accepts two parameters - this is not a feature restricted only to functions operating on numbers.

At this point those two calls:

```hs
5 `add` 7
```

and

```hs
5 + 7
```

look eerily similar.

That's not an accident. 

Indeed, you can do the reverse, and call the `+` operator as you would call a regular function - in front of the parameters. If it's an operator, you just have to wrap it in parentheses:

```hs
(+) 5 7
```

Try it in `ghci`. This works and returns `12` again!

Perhaps you already know where am I going with this. 

I am trying to show you that the built-in `+` operator is indeed just a regular function. 

There are of course syntactical differences (like using backticks or parentheses for certain calls), but conceptually it is good to think of `+` as being no different than `add`. Both are functions that work on the `Integer` type - accept two `Integer` numbers and return an `Integer` number as a result.

Indeed, you can even investigate the type of an operator in `ghci`, just as you would investigate the type of `add` function.

Typing:

```hs
:t (+)
```

results in:

```
(+) :: Num a => a -> a -> a
```

This means that `+` has type `a -> a -> a`, where `a` has to be a numeric type. So it's a function that accepts two parameters of numeric type `a` and returns the result of the same type.

I hope that at this point it makes sense why it is beneficial for the `+` operator to have such an abstract definition. A clear benefit `+` has over our custom `add` function is that `+` works on *any* numeric type. No matter if it's `Integer`, `Int`, or any other type that somehow represents a number - `+` can be used on it. Meanwhile, our `add` function works only on `Integer` types. For example, if you try to call it on - very similar - `Int` numbers, the call will fail.

So you can see that complexity introduced in number types doesn't come out of nowhere. It keeps the code typesafe, while still allowing huge flexibility. Types might seem complex, but this makes writing actual implementations a breeze.

#### Partial Application

Let's go back to the type of `add` function, which is probably still friendlier to read at this point.

```hs
add :: Integer -> Integer -> Integer
```

The way we have written the type definition here might be surprising to you. We see two `->` arrows in the definition, almost suggesting that we are dealing with two functions.

And indeed we are!

To increase the readability even more, we can use the fact that `->` is right-associative. This means that our type definition is equivalent to this:

```hs
add :: Integer -> (Integer -> Integer)
```

Let's focus on the part that is outside of the parentheses first:

```hs
add :: Integer -> (...)
```

This says that `add` is a function that accepts an `Integer` and returns *something*.

What is that *something*? To find out, we have to look inside the parentheses:

```hs
(Integer -> Integer)
```

That's again a function! This one also accepts an `Integer` as an argument. And as a result, it returns another `Integer`.

So if we look at the type of `add` again:

```hs
add :: Integer -> Integer -> Integer
```

we see that - in a certain sense - I was lying to you the whole time! 

I was saying that this is how we describe a function that accepts two parameters. But that's false! There is no function that accepts two parameters here! 

There is only a function that accepts a single parameter and then... returns another function! 

And then that second function accepts yet another parameter and *just then* returns a result!

To state the same thing in terms of another language, here is how you would write a regular function that accepts two parameters in JavaScript:

```js
function add(x, y) {
  return x + y;
}
```

However what we are creating in Haskell is something closer to this JavaScript code:

```js
function add(x) {
  return function(y) {
    return x + y;
  }
}
```

Note how we have two functions here, each accepting only a single parameter.

In the code snippet above, function `add` accepts parameter `x` and the second, anonymous, function accepts the parameter `y`. There is no function here that accepts two parameters.

So, based on what we have said so far, in Haskell we should be able to call the `add` function with only one parameter and get a function, right?

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

But that doesn't happen, because we did something wrong. The problem arises, because `add 5` returns - as we stated - a function, and Haskell doesn't know how to print functions.

We can however check the type of the `add 5` expression and this way convince ourselves that this indeed works:

```
:t add 5
```

As a result, we see:

```hs
add 5 :: Integer -> Integer
```

So it's a success! The expression `add 5` has type `Integer -> Integer`, just as we wanted!

We can convince ourselves even more that that's the case, by calling that `add 5` function on a number:

```hs
add 5 7
```

Oh... Wait. We just discovered something! 

It was probably confusing so far why Haskell has this strange way of calling functions on values, especially on multiple values. We were just separating them by space, like so:

```hs
f x y z
```

Now it becomes clear, that Haskell simply deals with single-argument functions all the time, and calling a function on multiple values is simply an illusion!

Our call:

```hs
add 5 7
```

is equivalent to:

```hs
(add 5) 7
```

First, we apply `add` to `5` and as a result, we get a function of type `Integer -> Integer`, as we've just seen.

Then we apply that new function (`add 5`) on a value `7`. As a result, we get an `Integer` - number `12`.

Note that this means that in Haskell function call is left-associative:

```hs
(add 5) 7
```

Contrasting with what we found out before - that type definition of function is right-associative:

```hs
add :: Integer -> (Integer -> Integer)
```

It is of course done this way so that we get a sane default. Thanks to those properties, in the case of both defining and calling the `add` function, we can simply forget about parentheses:

```hs
add :: Integer -> Integer -> Integer
```

```hs
add 5 7
```

How else can we convince ourselves that the result of calling `add 5` is an actual, working function? Well... let's give a name to that function and use it that way!

In your `lesson_02.hs` file add the following line:

```hs
addFive = add 5
```

Load the file in `ghci`.

First let's investigate the type one more time, just to be sure what we are dealing with:

```
:t addFive
```

This gives us:

```hs
addFive :: Integer -> Integer
```

Exactly what we expected after applying the `add` function to one argument.

We could have also written down that type definition explicitly in our file:

```hs
addFive :: Integer -> Integer
addFive = add 5
```

Do that to convince yourself that it all compiles when written this way.

Now you can use your, highly specific, `addFive` function to... add five to integers.

```hs
addFive 7
```

This results in the expected:

```hs
12
```

Now, I am sure this example with adding the number five seems a bit silly to you, and rightfully so.

But I hope that it shows you the power of partial application in Haskell, where you can easily use highly general functions, accepting a higher number of parameters, to create something more specific and fitting your particular needs.

For example, you can imagine a function that needs some kind of complex configuration in order to work - let's call it `imaginaryFunction`.

Let's assume that this configuration is some kind of data structure of type `ComplexConfiguration`. We can make that configuration the first argument of our function:

```hs
imaginaryFunction :: ComplexConfiguration -> OtherParameter -> Result
```

Why do we want to pass it as a parameter instead of just having it "hardcoded" inside the function? Who knows, perhaps different versions of our app need different configurations. Or perhaps we just need to change its value in our unit test suite.

If we do that, then, in the actual app, we can simply apply `imaginaryFunction` to a specific `ComplexConfiguration`:

```hs
configuredImaginaryFunction = imaginaryFunction config
```

After that, we can use the `configuredImaginaryFunction` directly, without the need to *explicitly* import `config` object, whenever we want to use `imaginaryFunction` in our code. Haskell just carries that config around for us! 

Sweet!

#### More Numbers and Operations

This section will be far from a complete rundown, but I still want to quickly take you up to speed with basic operations on numbers in Haskell.

So far we've covered two numeric types - `Integer` and `Int` and we've shown that we can add them.

Just as in other languages, we can also subtract and multiply them in the usual way.

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

Other popular number types are `Float` and `Double`. Those are number types that can represent numbers beyond simple integers. The main difference between `Float` and `Double` is how big their storage capacity is. Most of the time you will likely use `Double` unless you have some specific reason to use `Float`.

`Float` and `Double` values can be added, subtracted, and multiplied just like `Int` and `Integer` values.

Let's see some examples, just to make ourselves comfortable with that:

```hs
1.1 - 0.1
```

results in:

```hs
1.0
```

```hs
1 + 0.1
```

result in:

```hs
1.1
```

Note that in Haskell's standard library there are  *much more* numeric types available. Some of them are fairly common, others are fairly specific. There are also many more built-in functions. 

This section was just meant to make you comfortable with making simple operations on basic number types. In the future we will come back to numbers for sure - there is a great deal of interesting type-level stuff at play here, and we will want to cover that for sure!

#### Identity

Let's now take a small break from numbers and go back to our beloved booleans.

Previously, we have written a `not` function, which was negating the booleans - converting `True` to `False` and `False` to `True`.

But what if we wanted to do... the opposite?

What if we wanted to create a function that... returns `True` when passed `True` and returns `False` when passed `False`? 

This might sound a bit nonsensical. In a way, this function would do literally nothing. However, we will see that it will have a tremendous educational value for us, so let's curb our doubts and let's try to write it anyway.

First, let's start with the name and type signature as all Haskell programming should.

In mathematics, a function that takes a value and returns the exact same value is usually called an identity function. Since this one will operate on the `Bool` type, we will call it `boolIdentity`.

`boolIdentity` will receive a single argument of type `Bool` and return the same thing, so... `Bool` as well! Therefore its type signature is this:

```hs
boolIdentity :: Bool -> Bool
```

Now let's get started with actual implementation. Your first instinct might be to write something like this:

```hs
boolIdentity True = True
boolIdentity False = False
```

This will work perfectly fine and is a valid solution, but there is a way to write the same thing in a more terse way. 

After all, we are returning the same value that we are receiving as a parameter, so we can simply write:

```hs
boolIdentity x = x
```

In the end, our whole definition looks like that:

```hs
boolIdentity :: Bool -> Bool
boolIdentity x = x
```

Write that down in your `lesson_02.hs` file and reload the file in `ghci`.

You can convince yourself that our function works, by running it:

```hs
boolIdentity True
```

This call results in:

```hs
True
```

And at the same time `boolIdentity False` returns `False` (hopefully not surprisingly).

Now let's create a similar function, but for numbers - let's say for `Integer` type. We want a function that will take an `Integer` value and return the same value. For example, if we call it with `5`, we want to see `5` again.

Let's call it `integerIdentity`. Let's begin by writing the type signature:

```hs
integerIdentity :: Integer -> Integer
```

This was simple.

Now let's think about the implementation. Well... we want to take the parameter passed to the function and... just return it!

So we get:

```hs
identityInteger x = x
```

But... but this is exactly the same implementation as in the case of identity for `Bool` values!

Let's compare the two:

```hs
boolIdentity :: Bool -> Bool
boolIdentity x = x
```

```hs
integerIdentity :: Integer -> Integer
integerIdentity x = x
```

Everything looks the same. The only difference here is the types. In the first function, we operate on the `Bool` type. In the second we operate on the `Integer` type.

Now, if only there was a way to write that function only once. In the current state of things, we would have to write an identity function for each type in existence, which... sounds daunting, to say the least.

It luckily turns out that Haskell does have a mechanism to deal with that easily. Not only that - we've already encountered that mechanism!

Remember how the type of number `5` was `Num p => p`? The `p` in the type description was a type variable - basically a placeholder for actual, concrete types. 

We've also seen that the `+` operator was quite general - it could be called on *any* numeric type. It also had a type variable in its type signature.

So the question is, can we use a type variable, to write the most generic version of the identity function possible? The answer is... absolutely!

Let's remove the two previous identity functions and replace them with only one:

```hs
identity :: a -> a
identity x = x
```

Note how we used `a` as a type variable here. The 3 type definitions we've seen so far, share the same "shape". You can see that the type definitions of identity for `Bool` type and for `Integer` type both "fit" this new type definition if you imagine variable `a` being a placeholder for other types:

```hs
boolIdentity :: Bool -> Bool
```
```hs
integerIdentity :: Integer -> Integer
```
```hs
identity :: a -> a
```

Let's run the code in `ghci` and convince ourselves that we can indeed use this new, generic identity on both `Bool` and `Integer` values:

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

At this point, it's important to emphasize a certain point. Given the implementation that we've used for the identity function:

```hs
identity x = x
```

we could **not** give it, for example, the following type:

```hs
identity :: Integer -> Bool
```

This type definition in itself is not absurd. You can easily imagine functions that accept integers and return true or false (for example based on some condition).

However, in this particular case, where we take argument `x` and immediately return it, without doing anything else, it's clearly impossible for `x` to "magically" change the type.

And this fact **is** reflected even in the most generic type definition of identity:

```hs
identity :: a -> a
```

Note that this definition states that `identity` accepts a value of type `a` and returns a value **of that same type** - namely `a` again.

On the flip side, the following definition:

```hs
identity :: a -> b
```

wouldn't be allowed. In fact, it won't compile, with an error, part of which says:

```
Couldn't match expected type ‘b’ with actual type ‘a’
```

So the compiler literally says that in place of `b` there should be the type variable `a` present.

That's because - given the current implementation - it's impossible for the value named `x` to just change the type out of nowhere.

And indeed, when Haskell infers the type of untyped code, it goes for the most general interpretation possible.

You can convince yourself of that, by removing the type definition from `lesson_02.hs` file, and leaving only the implementation:

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

This is exactly the same type definition that we wrote by hand. It simply uses a different letter (`p` instead of `a`).

At the very end of this section, it would be good to mention, that you don't actually have to define the `identity` function by yourself. We only did it for educational purposes.

`Prelude` - the standard library for Haskell - has it always available for you under the shorter name `id`.

To convince yourself of that, write the following in `ghci`:

```
:t id
```

As a response you will see, more than familiar now, type:

```
id :: a -> a
```

#### Conclusion

In the second part of "The Most Gentle Introduction Ever" to Haskell, we used operators and functions on numbers and discovered that they are in fact almost the same. We've also seen that there are no functions of multiple variables in Haskell - they are just functions that return other functions. 

And at the end, we expanded our understanding of what a type definition can be, by showing the simplest possible usage of type variables - using the identity function as an example.

All those things were meant to make you feel more comfortable with the concept of a function in Haskell. And in the future article, we will use a similar approach to enhance our understanding of algebraic data structures, especially custom ones.

So see you next time and thanks for reading!

