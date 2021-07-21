---
slug: "/articles/haskell-i"
date: "2021-07-25"
title: "Haskell - The Most Gentle Introduction Ever"
---

#### For who is this article?

This article is a first in (hopefully) a series on functional programming in Haskell.

It doesn't assume any previous knowledge of Haskell or even functional programming for that matter.

It does however assume that you can already program in **some** programming language.

If you feel fairly comfortable in a language like JavaScript, Python, Java, C/C++, or anything similar, you are more than capable to go through this tutorial. Before publishing it, I have beta tested it on readers just like you. So you can rest assured that everything will be explained slowly and carefully.

The main point of this series will be to highlight the differences between Haskell and those "typical" langauges. So the less you know about Haskell and/or functional programming, the more mindbending those articles will be for you.

I will also be showing you how learning Haskell can benefit you in writing better code even when using other, more typical langauges. If you feel stuck when it comes to your programming skills and you feel like you haven't been stretching your coding muscles lately, Haskell is perfect for you. 

Wether you are a senior veteran in coding, or a junior dev that barely started their career, Haskell will push you to be an even better programmer.

Are you ready? Let's go then!

#### Why (I) Learn Haskell?

I've already written once [why it is beneficial to learn Haskell](https://dev.to/mpodlasin/5-practical-reasons-why-your-next-programming-language-to-learn-should-be-haskell-gc), even if you don't plan to code in it professionally.

So to not repeat myself, I will rather write why I personally decided to (re)learn Haskell at this point in my life.

I've been coding professionally for about 6 years now. Since the very beginning of my career I've been using JavaScript/TypeScript and React. Over and over again. In the past year I've been noticing some serious burnout symptoms, culminating in the "burnout event" that I've documented in my [previous article](https://mpodlasin.com/articles/burnout).

So I think it's clear that I need some change. 

I need something that will spark my interest in coding once again. Something that will stimulate my imagination, show me new ways of doing things and in general swap boredom for fascination.

And at the current moment I can't think of a language more fascinating and stimulating than Haskell.

I used to dabble in Haskell a bit when I was studying Computer Science. And I remember that Haskell always seemed like a neverending box of bold, new, innovative, and fresh programming ideas. 

It seems like a language you can never master, because there is always something new on the horizon. A library that flips the language on its head, some crazy experimental extension or an academic paper presenting some ingenious programming pattern.

And that's exactly what I need right now. Fascination, imagination, wonder.

#### Installing Haskellers Toolbelt

If you are on this journey with me, you need to begin by installing some software needed to run Haskell.

But if you are still unsure/unconvinced, you don't have to do even that. I will be keeping all the examples as simple as possible, so it will be absolutely enough to just use a REPL like [this one](https://replit.com/languages/haskell). So if you don't wish to install anything, or it seems too intimidating, you can safely omit the rest of this section and just start coding.

Still here? All in on learning Haskell? Awesome!

The download section on [haskell.org](https://haskell.org) can be a bit confusing, so I would recommend you to go straight to [ghcup](https://www.haskell.org/ghcup/) page. You just have to copy the script from that website, paste it to your terminal and run it.

`ghcup` is a "Haskell toolchain installer". In practice this means that it allows you to easily install and manage various tools related to Haskell.

The installation process guides you by hand - you will just have to answer a few questions. 

The installer will ask you about installing some secondary packages like `stack` or `hls`. I would choose `yes` to all of those, because they will make our Haskell adventure much easier, both at the beginning and in the future.

`hls` is "Haskell Language Server", which allows IDE plugins and extensions to work seemlessly with Haskell. So it's definitely worth to have it since the very beginning.

`stack` is a build tool that allows you to create isolated Haskell projects easily. This would be a massive overkill for simple, one-file scripts that we will be writing at the beginning. However once we move on to writing bigger, more complex programs, Stack will be extremely helpful. Wether you prefer to install it now or later - it's up to you.

After running the script, you can test if everything went well by running `ghci` command.

We've mentioned quite a few tools so far, but `ghci` is the one that we will *actually* use in this article. It is an interactive environment for running Haskell code. `ghc` stands for Glasgow Haskell Compiler. `ghc` is in fact it's own command, that will allow us to actually compile code into binary executables.

However if we just want to play around with code and test some stuff, interactive `ghc` - `ghci` - is perfect for that, because it allows us to run Haskell code without the compilation step. On top of that it has some handy commands which we will use today.

If you type in `ghci` in the terminal and get an error, it likely means that your terminal doesn't know how to find the `ghci` binary. You might have to close and reopen the terminal window after finishing the installation.

If it's still not working, then - depending on the environment you are using - you will have to edit your `.bashrc` or `.zshrc` file.

Luckily `ghcup` is very tidy - it just installs everything in a single directory, in my case `/Users/mateusz.podlasin/.ghcup`. In that directory there is a `bin` folder. You need to point the terminal you are using to that folder.

So, in my case, I had to add a following line to my `.zshrc` file:

```
export PATH="/Users/mateusz.podlasin/.ghcup/bin:$PATH"
```

After closing the terminal and opening it again, running `ghci` should result in the following output:

```
GHCi, version 8.10.5: https://www.haskell.org/ghc/  :? for help
Prelude>
```

If you see this, you are ready to begin our Haskell adventure.

#### Fun(ctional) with Booleans

A boolean (in Haskell named `Bool`) is one of the simplest and most familiar values that a programmer encounters on a regular basis. No matter what programming language you used previosly, you likely know booleans very well.

That's why they will be perfect for learning the basics of Haskell.

In Haskell those values are written starting with big letter, so we have `True` and `False`.

In `ghci` you can type in:

```
:t True
```

`:t` is a `ghci` command for checking the type of a value. Note that this command is not a part of Haskell itself, just a `ghci` functionality.

As a result you will see:

```
True :: Bool
```

You can read `::` as "has type". So this line says that the value True has type Bool.

Just to make sure we understand that correctly, let's check the type of value False:

```
:t False
```

We see:

```
False :: Bool
```

As you probably anticipated, the value False has type Bool as well. So True and False are of the same type. In Haskell - quite resonably - True and False are the **only** values of the type Bool.

Contrary to `:t`, the `<value> :: <type>` syntax **is** a part of Haskell language. And this should already hint at something to you. If a langauage has a dedicated syntax to express a sentence "\<value\> has type \<type\>", it means that this language has to treat types fairly seriously. 

As we will soon see, types are at the very heart of programming in Haskell. As a matter of fact, sometimes when coding in Haskell you will be thinking about types *more* than about actual values!

And while we are here, note that the name of the type - `Bool` - is also written starting with big letter in Haskell. This will be important later.

We will now start writing some actual code. We will still use `ghci` to run it, but we need to write it in an actual file.

So create a file called `lesson_1.hs`. Note the `.hs` suffix. You can create that file anywhere you want. You can also create and edit it with any type of text editor you desire. I would recommend using Visual Studio Code, which has many handy plugins for working with Haskell files.

After you've created the file, make sure to be - using the terminal - in the same directory where the file is located. To do that, you can leave `ghci` by running `:q`. Then switch directories to a proper one and run `ghci` command once again. In `ghci` try loading the file, by running:

```
:l lesson_1.hs
```

Even though your file doesn't have any code in it just yet, you should see a success message like this:

```
[1 of 1] Compiling Main             ( lesson_1.hs, interpreted )
Ok, one module loaded.
```

If you don't see that, you've likely run `ghci` in a different directory than your file is located.

If you see the message, you are ready to begin coding!

So we have types (`Bool`) and values (`True` and `False`). What can we do with them? The most basic thing would be to assign a value to a variable.

Write the following line in `lesson_1.hs`:

```hs
x = True
```

Now load it again in `ghci` with `:l lesson_1.hs` (remember to save the file beforehand).

In `ghci` you can now type:

```
x
```

As a response you will see:

```
True
```

This shows that, indeed, we assigned the value True to the variable x.

Now let's do something that might surprise you and that will show you just like radically different Haskell is from "regular" languages.

In `lesson_1.hs` file let's write:

```hs
x = True
x = False
```

Load it again in `ghci`. You will see the following output:

```
[1 of 1] Compiling Main             ( lesson_1.hs, interpreted )

test.hs:2:1: error:
    Multiple declarations of ‘x’
    Declared at: lesson_1.hs:1:1
                 lesson_2.hs:2:1
  |
2 | x = False
  | ^
```

The most important part of that message says "Multiple declarations of ‘x’".

It turns out that once you assing a value to a variable in Haskell, you can't overwrite it.

Ever.

If it's a Bool, you can't change it from True to False. If it's a number (which we will cover in future articles), you can't change it's value. For example you can't even increase the value of a variable by one!

This sounds incredibly radical to someone used to tranditional, imperative programming. Idioms like:

```
i++;
```

or

```
someBoolean = !someBoolean;
```

etc. are so prevalent in those languages that a though of only assigning a value to a variable only once sounds frankly just... crazy.

Is it even possible to write actual, real-world programs with a language like this? 

The answer is absolutely, and we will see that quite soon. But for now you just have to accept that - once assigned a value - you can't ever change that variable anymore.

It's likely that you've heard already about immutability. I myself wrote once about [immutability in JavaScript](https://dev.to/mpodlasin/functional-programming-in-js-part-ii-immutability-vanilla-js-immutable-js-and-immer-2ccm).

That's the thing though. In those other, imperative langauges immutability has to be introduced via some library or specific programming method. 

It's exactly the reverse in Haskell. Here immutability is the default and you have to use libraries or specific methods to achieve mutable variables/state.

That might sound cumbersome, but it's not an accident that the principle of immutability became so popular even in mutable languages. It really makes your code less bugy, safer and more predictable.

Ok, enough of talky talk. So we know that once created, we can't really alter that variable. But it is by no means useless. We can now call some functions using it.

Remove `x = False` line from our file, so that loading the file works again and `x` has value True.

Then run the following in `ghci`:

```hs
not x
```

As an answer you will see:

```
False
```

Now, if you've coded in Python or a language with similar syntax, you might think that this `not` is some special, reserved keyword for negating booleans.

No.

In Haskell, `not` is a regular function.

In typical language, a function call would look like that:

```
not(x)
```

But this is not the case in Haskell. In Haskell you write the function name and then - instead of paranthesis - you provide arguments separating them with a single space.

So to call a function `f` on a variable `x` you would write:

```hs
f x
```

If `f` accepted two parameters, instead of typical `f(x, y)` you would write:

```hs
f x y
```

If `f` accepted three parameters, you would write:

```hs
f x y z
```

And so on. You get the idea.

Let's go back to our `not` function. We called it on a variable, but of course there is nothing preventing us from calling it on values directly.

In `ghci` type:

```hs
not True
```

and you will see:

```
False
```

Typing:

```hs
not False
```

results in the response:

```
True
```

Now, just as values have types (True has type Bool), functions have types as well. In fact we can investigate the type of `not` function in the same way we investigated the types of True and False - using `:t` command in `ghci`.

Type:

```
:t not
```

and you will see the following answer:

```
not :: Bool -> Bool
```

We again see the `::` symbol, which means "has type". We see the Bool type mentioned twice. The only new symbol here is `->`. As you probably expect, `<something> -> <something else>` reads as "function from \<something\> to \<something else\>".

So the output that we got from `ghci` can be read as "not has type function from Bool to Bool". Or more naturally "not **is** a function from Bool to Bool".

This shouldn't be surprising. When we call `not` on a Bool value, we expect to see the Bool value as a result. If we called `not True` and got `15` as an answer, we would be extremely confused.

#### Writing your own functions

At this point I would like to prove to you that there is nothing magical about `not`. If it's just a regular function, you should be able to write it by yourself, right?

Yup, and that's exactly what we will do right now. You will write your first Haskell function!

We will do that in our `lesson_1.hs` file.

Under our `x` defintion, write the following line:

```hs
myNot x = if x then False else True
```

Let's break down what is happening here a little bit. 

First, we have something what looks exactly like a call of a function - beginning with the name (`myNot`), and later the parameters of the function, separated by spaces. In this particular case we have only one parameter, which we named `x`.

After that we have assignment (`=` character) after which we write the actual function, sometimes called "function body", itself.

In this case the function body is just a simple `if then else` statement. After `if` keyword we have to provide a condition. Our condition is really `x == True`. But because that's the same as simply writing `x`, we just write `x` for brevity.

If `x` - our condition - evaluates to `True`, the function will return the value after `then` keyword. If `x` evaluates to `False`, the function will return the value after `else` keyword. Quite simple.

And I will admit that I used `x` as a parameter name here to confuse you a little bit. For a second you might think that there is a naming conflict between `x` that we defined earlier and the `x` from the function.

You can however convince yourself that that's not true, by loading the file with `:l lesson_1.hs` command in `ghci`. It loads properly, without any errors. On top of that, our newly defined function `myNot` actually works.

Calling in `ghci`:

```hs
myNot True
```

returns 

```
False
```

and vice versa.

We can even used the function on our `x` variable defined about it.

Running:

```
myNot x
```

results in:

```
False
```

Which is correct, because in the file we assigned `x` to `True`.

So there is no naming conflict, but **it is** true that we are "shadowing" the `x` variable. If we now wanted to use it in the function body, we couldn't, because we decided to give the parameter the same name.

So, just for clarity, let's change the name of the function parameter to `b` (from "boolean"):

```hs
x = True

myNot b = if b then False else True
```

This will help us not getting confused.

Perhaps this definition that we came up with is not at all what you expected. We moaned for so long about the importance of types, but now we've written something that borderline looks like untyped Python. What's going on? Where are those scary types?

It turns out that Haskell's type system is so powerful, that many times it can **infer** what should be the type of the function you've written. Save the file, load it in `ghci` and write:

```
t: myNot
```

You will see:

```
myNot :: Bool -> Bool
```

So indeed your custom `myNot` function has the same type as `not`. But how Haskell came to that conclusion?

It's quite straightforward.

Since you wrote `if x`, using `x` as a condition, Haskell new that parameter `x` had to be a Bool. That's because Haskell is (again!) quite strict here and only Bool type can be used as a condition in the `if then else` construct.

At the same time you wrote `then False else True`.

So in both cases ("then" case and "else" case) you are returning a Bool. Therefore the output of your function has type Bool.

Those two facts combined bring us to a conclusion that the type of `myNot` has to be `Bool -> Bool`.

Now although you don't have to write that type defintion in your code (unless Haskell has a problem with infering the type of the function), it's still recommended to do so.

You do it simply by writing the type of the function above it's definition:

```hs
myNot :: Bool -> Bool
myNot x = if x then False else True
```

Writing the type in the code has some major advantages.

First of all it increases the readability of the code. Types are incredibly useful as a documentation of what your function does. In Haskell you will often be able to infer what a function does simply by looking at its name and type signature.

Function called `not` has type `Bool -> Bool`? It surely must negate the booleans!

Second of all, it's valuable to write the type of the function before writing the function defintion itself. If you do that, Haskell's type system will "guide you" and help validate that your code actually works as expected.

After all, inferred type of a function may differ from what you have intended. Writing the type beforehand is almost like sketching or designing the function, before actually writing it. 

Personally I find that writing the type first often gives me a better idea on how to actually implement the function.

And this is actually an example of skill that Haskell teaches you that you can easily transfer to other languages, even if they are untyped. Even when I am writing untyped JavaScript, I still always start by thinking what kind of type signature my function will have. This helps me to write code faster and make less bugs, even if I have to be my own type-checker in that case.

So we have successfully replicated the `not` function. `myNot` has the same type **and** behaves in the same way. Running `myNot True` evaulates to `False`, running `myNot False` evaluates to `True`.

But let's stay on this topic a bit longer and try to write the same function in a completely different manner.

Let's write:

```hs
myNot :: Bool -> Bool
myNot True = False
myNot False = True
```

You can check for yourself that this loads properly in the `ghci`. You can also test that `myNot` still behaves exactly the same as before.

What is happening here?

We used what is known as pattern matching.

Instead of declaring the first (and only) parameter of the function as a variable named `b`, we can avoid naming that parameter entirely and simply matching it with a value that will be provided to the function once it's called.

When we make a call `myNot True`, Haskell literally looks for a definition that "fits" such call. In this case it's the first line (after the type definition). If we made a call `myNot False`, then the second line would *match* that call - hence the name "pattern matching".

I hope it's clear, but if you call `myNot` with a variable, not an actual value, pattern matching will still works just fine.

So with this new defintion, calling:

```hs
myNot x
```

Still properly returns:

```
False
```

So far we have two versions of the same function:

```hs
myNot :: Bool -> Bool
myNot x = if x then False else True
```
```hs
myNot :: Bool -> Bool
myNot True = False
myNot False = True
```

For all intents an purposes those two functions behave in exactly the same way (and have the same type). Which one you prefer depends entirely on you.

Do you want to see yet another way to write the same function? Here you go:

```hs
myNot: Bool -> Bool
myNot b
    | b         = False
    | otherwise = True
```

Arguably this way of writing the function looks the most exotic and the most challening.

It uses what is know as "guards". A guard is basicaly a condition, which is placed between `|` and `=` characters. When the condition is satisfied, the function that is defined after `=` gets executed.

In our case the first guard is `b == True`. But, just as before, we can write the same condition as simply `b`. If `b` is True, this condition is satisfied and the part that returns False will be executed.

Otherwise (so when `b` is not True), the part that returns True will be executed.

Interestingly, there is nothing magical about the keyword `otherwise` here. (Are you noticing a pattern here, where some "feature" of the language is not actually a feature, but simply something that someone coded in that language?)

You can convince yourself that this is true by writing `otherwise` in the `ghci` console. As a response you will see:

```
True
```

Yup. `otherwise` is nothing more than a regular variable, holding value True! Just as our `x` is!

So, without the `otherwise` our "guarded" version of the function would look like this:

```hs
myNot: Bool -> Bool
myNot b
    | b         = False
    | True      = True
```

Just as in `if then else`, a condition has to be a Bool value. If we set the last condition to be True, it will always hold and therefore it will act as a catchall case if the guards above it fail. Calling the True value `otherwise` is something done only to make this a bit more readable and obvious.

So we have written `myNot` in 3 different ways. Which one you prefer depends on you. Nertheless it's extremely valuable to get to know 3 constructs what we've used - `if then else`, pattern matching and guards - because they appear almost all the time in Haskell code.

In fact, we used them in separation here, but in the future you will see that you can mix those techniques in various ways, especially when writing more complex code.

#### Creating your own types and values

So far we have written a custom `not` function for the `Bool` type. But what if we could recreate the `Bool` type itself? Is it even possible?

Indeed, it's possible and it's even simple. Let's create a `MyBool` type. It will have two values - `MyTrue` and `MyFalse`. It might seem that we are getting a bit possesive here (wink, wink) but that's only to avoid conflicts with already existing names.

At the top of our `lesson_1.hs` file let's write:

```hs
data MyBool = MyTrue | MyFalse
```

Easy right?

After you load that file in the `ghci`, you can run `:t MyTrue` to doublecheck that `MyTrue` has type `MyBool`, mirroring how `True` has type `Bool`:

```
MyTrue :: MyBool
```

The same is true for `MyFalse`:

```
MyFalse :: MyBool
```

You can now write functions that operate on those types, just as we wrote a function for built-in `Bool` type.

So if we wanted `myNot` to work on that custom `MyBool` type, we would do it like that:

```hs
myNot :: MyBool -> MyBool
myNot MyTrue = MyFalse
myNot MyFalse = MyTrue
```

We simply replaced all occurences of `Bool` with `MyBool`, all occurences of `True` with `MyTrue` and all occurences of `False` with `MyFalse`.

We now have both a regular, built-in version and a custom version of a boolean type. Wouldn't it be convenient to write some functions to switch between them?

Let's do it!

First let's write a `boolToMyBool` function. It will take a regular, Haskell `Bool` and transform it to our custom `MyBool`:

```hs
boolToMyBool :: Bool -> MyBool
boolToMyBool b = if b then MyTrue else MyFalse
```

And let's write a function that will do the reverse:

```hs
myBoolToBool :: MyBool -> Bool
myBoolToBool MyTrue = True
myBoolToBool MyFalse = False
```

We used two different ways to write a function on purpose here. Note that we wouldn't be able to use `if then else` with `MyBool` type, because it works only on actual, Haskell Bools. But on the other hand we could've used pattern matching in both - pattern matching works with custom defined values without any problems.

Great. We can now transform back and forth between built-in and custom types. Let's try that.

Load the file in `ghci` with both definitions and run:

```hs
boolToMyBool True
```

You will see `MyTrue` as a response.

Now let's try to transform the same value back. Let's write:

```hs
myBoolToBool (boolToMyBool True)
```

You will see `True` as the response. What happened is that we converted `True` to `MyTrue` using `boolToMyBool` funciton (inside the brackets), and then we took that result and converted it back to `True` using `myBoolToBool` function, all in single expression.

Is it a bit nonsensical operation? Perhaps, but it shows us how we can chain multiple function calls.

In fact, the brackets around the first function call are important.

Try to run the following in `ghci`:

```hs
myBoolToBool boolToMyBool True
```

Compiler will show a fairly elaborate error message, but if you read it carefully, you will find the following sentence:

```
The function ‘myBoolToBool’ is applied to two arguments,
      but its type ‘MyBool -> Bool’ has only one
```

Ha, so we found what is the problem. Indeed, it looks as if we are trying to apply `myBoolToBool` function to two parameters - `boolToMyBool` and `True`. Remember how `f x y` was representing calling a function `f` on two parameters? That's exactly what we are doing here! In that case, `f` is `myBoolToBool`, `x` is `boolToMyBool` and `y` is `True`.

We have to show the compiler that we actually want to apply `myBoolToBool` function to a single parameter. And that parameter is a result of calling `boolToMyBool` on `True`. So we wrap that call in brackets, to make that clearer (both to the compiler and to us):

```hs
myBoolToBool (boolToMyBool True)
```

Can we use those conversion functions for something more practical than only translating booleans back and forth? Absolutely, we can use them to rewrite our `myNot` implementation once again.

We can use the fact that `Bool` has already the `not` function defined, which works exactly how we want, it just operates on different types. So let's take a `MyBool` value, convert it to `Bool`, use `not` on it and then convert it back to `MyBool`:

```hs
myNot :: MyBool -> MyBool
myNot mb = boolToMyBool (not (myBoolToBool mb))
```

Let's review step by step how that function works.

Since it's a function of type `MyBool -> MyBool`, its argument is a `MyBool` - that's why we called it `mb`. We pass that variable to a function - `myBoolToBool mb` - and as a result we are getting something of type `Bool`. Then we are applying `not` on it, by writing `not (myBoolToBool x)`. Note that at this step the type doesn't change - we are feeding `not` a `Bool` and getting `Bool` again, since `not` is of type `Bool -> Bool`. At the end we convert back to `MyBool`, by writing `boolToMyBool (not (myBoolToBool x))` - which is the return value of our function.

This could be again summarised as follows:

```hs
mb :: MyBool
```

```hs
(myBoolToBool mb) :: Bool
```
```hs
(not (myBoolToBool mb)) :: Bool
```
```hs
(boolToMyBool (not (myBoolToBool mb))) :: MyBool
```

This technique of tracking which value has which type is extremely valuable, especially when starting with Haskell. Whenever you feel lost how certain function works, I would encourage you to analyze all the types of all the values in the function first. You will discover that when you know all the types well, it's much easier to understand how the code actually works and what it does.

This is an another example of a skill that Haskell teaches you, which is immediately transferable to programming in other languages. Even if your day to day language is loosely typed and doesn't have types in the actual syntax, you can still use this kind of thinking to track what kinds of values are going flowing your function at each step.

In time you will discover that this allows you to read and analyze code much faster, especially the code that you haven't written yourself.

#### Conclusion

So we had a bit of functional fun with Bools in Haskell.

We've learnt the basics of syntax, we've seen how to create functions and even some simple datatypes.

In future articles we will elaborate on those ideas quite a bit, so if you are hooked on Haskell by now (as I hope you are!), I would recommend to follow me on [Twitter](https://twitter.com/m_podlasin. I don't run any kind of newsletter email or anything like that, so that's the best way to get notified when a new article drops. 

Thanks for reading and see you in the future articles!