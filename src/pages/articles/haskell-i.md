---
slug: "/articles/haskell-i"
date: "2021-07-25"
title: "Haskell - The Most Gentle Introduction Ever"
---

#### Who is That Article For?

This article is the first in (hopefully) a series on functional programming in Haskell.

It doesn't assume any previous knowledge of Haskell or even functional programming for that matter.

It does however assume that you can already program in **some** programming language.

If you feel fairly comfortable in a language like JavaScript, Python, Java, C/C++, or anything similar, you are more than capable of going through this tutorial. You can rest assured that everything will be explained slowly and carefully.

The main point of this series will be to highlight the differences between Haskell and those "typical" languages that I've mentioned. So the less you know about Haskell and/or functional programming, the more illuminating and mindbending those articles will be for you.

I will also be showing you how learning Haskell can benefit you in writing better code even when using other, more mainstream languages. If you feel stuck when it comes to your programming skills and if you feel like you haven't been stretching your coding muscles lately - Haskell will be perfect for you! 

Whether you are a senior coding veteran or a junior dev that barely started your career, Haskell will push you to be an all-around better programmer. If you need more convincing, in the past I've written about [why it is beneficial to learn Haskell](https://dev.to/mpodlasin/5-practical-reasons-why-your-next-programming-language-to-learn-should-be-haskell-gc), even if you don't plan to code in it professionally.

Are you ready? Let's go then!

#### Installing Haskellers Toolbelt

If you are on this journey with me, we'll begin by installing some software needed to run Haskell.

But if you are still unsure/unconvinced, you don't have to do even that. I will be keeping all the examples as simple as possible, so it will be enough to just use a REPL like [this one](https://replit.com/languages/haskell). The only thing you need to do there is to empty the file in the REPL - we will start from scratch - and run `ghci` command in the terminal. You are ready now, so if you don't want to install Haskell tools on your computer, you can safely omit the rest of this section.

Still here? All in on learning Haskell? Awesome!

The download section on [haskell.org](https://haskell.org) can be a bit confusing, so I would recommend you to go straight to [ghcup](https://www.haskell.org/ghcup/) page. You just have to copy the script from the website, paste it to your terminal and run it.

`ghcup` is a "Haskell toolchain installer". This means that it allows you to easily install and manage various tools related to Haskell.

The installation process guides you by hand - you will just have to answer a few questions. 

The installer will ask you about installing secondary packages - `stack` and `hls`.

`hls` is "Haskell Language Server". It allows IDE plugins and extensions to work seamlessly with Haskell. So it's worth having it since the very beginning.

`stack` is a build tool that allows you to create isolated Haskell projects easily. This would be massive overkill for simple, one-file scripts that we will be writing at the beginning. However, once we move on to writing more complex programs, Stack will be extremely helpful. Whether you prefer to install it now or later - it's up to you.

After running the script, you can test if everything went well by running the `ghci` command in your terminal.

We've mentioned quite a few tools so far, but `ghci` is the one that we will *actually* use in this article. It is an interactive environment for running Haskell code. `ghc` (no "i" at the end!) stands for Glasgow Haskell Compiler. `ghc` is in fact its own command, that will allow us to compile code into binary executables.

However, if we just want to play around with code and test some stuff, an *interactive* `ghc` - called `ghci` - is perfect for that, because it allows us to run Haskell code without the compilation step. On top of that, it has some handy commands which we will use today.

If you type in `ghci` in the terminal and get an error, it likely means that your terminal doesn't know how to find the `ghci` binary. You might have to close and reopen the terminal window after finishing the installation.

If it's still not working, then - depending on the environment you are using - you will have to edit your `.bashrc` or `.zshrc` file.

Luckily `ghcup` is very tidy - it just installs everything in a single directory, in my case `/Users/mateusz.podlasin/.ghcup`. In that directory, there is a `bin` folder. You need to point the terminal you are using to that folder.

So, in my case, I had to add the following line to my `.zshrc` file:

```
export PATH="/Users/mateusz.podlasin/.ghcup/bin:$PATH"
```

After closing the terminal and opening it again, running `ghci` should now result in the following output:

```
GHCi, version 8.10.5: https://www.haskell.org/ghc/ :? for help
Prelude>
```

If you see this, you are ready to begin our Haskell adventure.

#### Playing with Booleans

A boolean (in Haskell named `Bool`) is one of the simplest and most familiar types that a programmer encounters regularly. No matter what programming language you've used previously, you likely know booleans very well.

That's why they will be perfect for learning the basics of Haskell.

In Haskell boolean values are written starting with a big letter, so we have `True` and `False`.

In `ghci` you can type in:

```
:t True
```

`:t` is a `ghci` command for checking the type of a value. Note that this command is not a part of Haskell itself, just a `ghci` functionality.

After clicking enter, as a result, you will see:

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

As you probably anticipated, the value False has type Bool as well. So True and False are of the same type. And in Haskell - quite reasonably - True and False are the *only* values of the type Bool.

Contrary to `:t`, the `<value> :: <type>` syntax *is* a part of Haskell language. And this should already hint at something to you. If a language has a dedicated syntax to express the sentence "\<value\> has type \<type\>", it means that this language probably treats types fairly seriously. 

As we will soon see, types are at the very heart of programming in Haskell. As a matter of fact, sometimes when coding in Haskell you will be thinking about types *more* than about actual values!

And while we are here, note that the name of the type - `Bool` - is also written starting with a big letter in Haskell, just like the names of values. This will be important later.

Let's now start writing some actual code. We will still use `ghci` to run it, but we need to write it in an actual file.

Create a file called `lesson_1.hs` (in REPL I linked, the file is already created for you and is called `main.hs`). Note the `.hs` suffix, which represents Haskell source code files.

You can create that file anywhere you want. You can also create and edit it with any text editor you desire. I would recommend using [Visual Studio Code](https://code.visualstudio.com), which has many handy plugins for working with Haskell.

After you've created the file, make sure to be - using the terminal - in the same directory where the file is located. To do that, you can leave `ghci` by running `:q`. Then switch directories to a proper one and run the `ghci` command once again. 

In `ghci` try loading the file, by running:

```
:l lesson_1.hs
```

Even though your file doesn't have any code in it just yet, you should see a success message like this:

```
[1 of 1] Compiling Main ( lesson_1.hs, interpreted )
Ok, one module loaded.
```

If you don't see that, you've likely run `ghci` in a different directory than your file is located.

But if you see the message, you are ready to begin coding!

So we have types (`Bool`) and values (`True` and `False`). What can we do with them? The most basic thing, known from other languages, would be to assign a value to a variable.

Write the following line in `lesson_1.hs`:

```hs
x = True
```

Now load it again in `ghci` with the same command as before - `:l lesson_1.hs` (remember to save the file beforehand).

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
[1 of 1] Compiling Main ( lesson_1.hs, interpreted )

test.hs:2:1: error:
 Multiple declarations of ‘x’
 Declared at: lesson_1.hs:1:1
 lesson_2.hs:2:1
 |
2 | x = False
 | ^
```

The most important part of that error message says that there are *Multiple declarations of ‘x’*.

It turns out that in Haskell, once you've assigned a value to a variable, you can't overwrite it or change it in any way. Ever.

If it's a Bool, you can't change it from True to False. If it's a number (which we will cover in future articles), you can't change its value. For example, you can't even increase the value of a numeric variable by one!

This sounds incredibly radical to someone used to traditional, imperative programming. Idioms like:

```
i++;
```

or

```
someBoolean = !someBoolean;
```

etc. are so prevalent in those languages that thought of only assigning a value to a variable once sounds... well... frankly just crazy!

Is it even possible to write actual, real-world programs with a language like this? 

The answer is absolutely, and we will see that quite soon. But for now, you just have to accept that - once assigned a value - you can't ever change that variable anymore.

You've likely heard about immutability at this point. I already wrote about [immutability in JavaScript](https://dev.to/mpodlasin/functional-programming-in-js-part-ii-immutability-vanilla-js-immutable-js-and-immer-2ccm) for example.

That's the thing though. In those other, imperative languages immutability has to be introduced via some library or specific programming approach. 

It's exactly the reverse in Haskell. Here immutability is the default and you have to use libraries or certain methods to achieve mutable variables/state.

That might sound cumbersome, but it's not an accident that the principle of immutability became so popular even in the mainstream, "mutable by default" languages. It really makes your code less buggy, safer, and more predictable.

Ok, enough of talky talk. So we know that once created, we can't alter that variable. But it is by no means useless. We can now call some functions using it.

Remove the `x = False` line from your file, so that loading the file in `ghci` works again and `x` has the value True.

Then run the following in `ghci`:

```hs
not x
```

As an answer you will see:

```
False
```

Now, if you've coded in Python or a language with similar syntax, you might think that `not` is some special, reserved keyword for negating booleans.

No. In Haskell, `not` is just a regular function.

In a typical language, a function call would look something like that:

```
not(x)
```

But this is not the case in Haskell. In Haskell, you write the function name, and then - instead of parenthesis - you provide arguments by separating them with a single space.

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

Let's go back to our `not` function. We called it on a variable, but nothing is preventing us from calling it on values directly.

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

Now, just as values, functions have types as well. We can investigate the type of `not` function in the same way we investigated the types of True and False - using the `:t` command in `ghci`.

Type:

```
:t not
```

and you will see the following answer:

```
not :: Bool -> Bool
```

We again see the `::` symbol, which means "has type". We see the Bool type mentioned twice. 

The only new symbol here is `->`. As you probably expect, `<something> -> <something else>` reads as "function from \<something\> to \<something else\>".

So the output that we got from `ghci` can be read as "`not` has the type of function from Bool to Bool". Or, more naturally, "`not` *is* a function from Bool to Bool".

This shouldn't be surprising. When we call `not` on a Bool value, we expect to see the Bool value as a result - the "opposite" of what we've passed. If we called `not True` and got `15` as an answer, we would be extremely confused, wouldn't we?

#### Writing Functions

At this point, I would like to prove to you that there is nothing magical about `not`. If it's just a regular function, you should be able to write it by yourself, right?

Yup, and that's exactly what we will do right now. We will write our first Haskell function!

We will do that in our `lesson_1.hs` file.

Under the `x` definition, write the following line:

```hs
myNot x = if x then False else True
```

Let's break down what is happening here a little bit. 

First, we have something that looks exactly like a call of a function - beginning with the name (`myNot`), and later the parameters of the function, separated by spaces. In this particular case, we have only one parameter, which we named `x`.

Next, we have an assignment (`=` character), after which we write the actual function - the part which we call "function body". In this case, the function body is just a simple `if then else` statement. Let's break it down.

Right after the `if` keyword we have to provide a condition. Our condition is really `x == True`. You probably recognize `==` from other languages. In Haskell it means the same thing - it's an equality operator. 

But `x == True` is equivalent to simply writing `x`. After all, if `x == True` evaluates to True, this means that `x` itself has the value of True. So we can just write `x` as our condition, for brevity.

If the condition in `if then else` (our `x`) evaluates to `True`, the function will return the value after the `then` keyword. If it evaluates to `False`, the function will return the value after the `else` keyword. Quite simple.

So in the end we are getting a function that returns `False` if called with `True` and returns `True` if called with `False`.

And I will admit that I've used `x` as a parameter name here just to confuse you a little bit. For a second you might think that there is a naming conflict between `x` that we defined earlier and the `x` from the function.

You can however convince yourself that that's not true, by loading the file again in `ghci`. It loads properly, without any errors. On top of that, our newly defined function `myNot` actually works.

Calling in `ghci`:

```hs
myNot True
```

returns 

```
False
```

and vice versa.

We can even use the function on our `x` variable defined above it.

Running:

```
myNot x
```

results in:

```
False
```

That is correct because in the file we assigned `x` to `True`.

So there is no naming conflict, but *it is* true that we are "shadowing" the `x` variable. If we now wanted to use it in the function body, we couldn't, because we decided to give the same name to the function parameter.

So, just for clarity, let's change the name of the function parameter to `b` (as in "boolean").

The whole file looks now like this:

```hs
x = True

myNot b = if b then False else True
```

This will help us not get confused.

Perhaps the function definition that we came up with is not at all what you expected. We moaned for so long about the importance of types, but now we've written something that borderline looks like untyped Python. What's going on? Where are those scary types?

It turns out that Haskell's type system is so powerful, that most of the time it can *infer* what should be the type of a function - or of a value - you've written. Save the file, load it in `ghci` and write:

```
t: myNot
```

You will see:

```
myNot :: Bool -> Bool
```

So indeed your custom `myNot` function has the same type as the original `not`. But how Haskell came to that conclusion?

It's quite straightforward.

Since you wrote `if x then ...`, using `x` as a condition, Haskell knew that parameter `x` had to be a Bool. That's because Haskell is (again!) quite strict here and only the value of type Bool can be used as a condition in the `if then else` construct. (Note that we've written *"as a condition"* here! It's completely fine to provide values of other types after `then` and `else` keywords - we will see that in future articles.)

And at the same time, you wrote `then False else True`. Here, in both cases ("then" case and "else" case) you are returning a Bool. Therefore the output of your function has type Bool as well.

Those two facts combined bring us to a conclusion that the type of `myNot` has to be `Bool -> Bool`.

Haskell inference is extremely good and the compiler may only have problems if you write something that is inherently vague.

And yet it is still recommended to put the type signature of the function in the code. You will see that in the vast majority of Haskell codebases the types are always written explicitly.

You can do it by writing the type of the function above its definition:

```hs
myNot :: Bool -> Bool
myNot x = if x then False else True 
```

Writing down the type in the code has some major advantages.

First of all, it increases the readability of the code. Types are incredibly useful as documentation of what your function does. In Haskell, you will often be able to find out what a given function does simply by looking at its name and type signature. No need to read the implementation!

Function called `not` that has type `Bool -> Bool`? It surely must be a function negating the booleans!

Second of all, it's valuable to write the type of the function before writing the function definition itself. If you do that, Haskell's type system will "guide you" and help validate that your code works as expected.

After all, inferred type of a function may differ from what you have intended. 

Writing the type beforehand is almost like sketching or designing a function, before actually writing it. Personally, I find that writing down the type first often gives me a better idea on how to implement the function.

This is an example of a skill that Haskell teaches you, that you can easily transfer to other languages. Even when I'm writing untyped JavaScript, I still always start by thinking about what kind of type signature my function will have. This helps me to write code faster and make fewer bugs, even though I have to be my own type-checker in that case.

So we have successfully replicated the `not` function - `myNot` has the same type *and* behaves in the same way. Running `myNot True` evaluates to `False`, running `myNot False` evaluates to `True`.

But let's stay on this topic a bit longer and try to write the same function in a completely different manner.

Let's write:

```hs
myNot :: Bool -> Bool
myNot True = False
myNot False = True
```

You can check for yourself that this loads properly in the `ghci`. You can also test that `myNot` still behaves the same as before.

What is happening here?

We used what is known as pattern matching.

Instead of declaring the parameter of the function as a variable named `b`, we can avoid naming it entirely and simply subsitute it with a value that will be provided to the function once it's called.

When we make a call `myNot True`, Haskell looks for a definition that "fits" such a call. In this case, it's the first line (not counting the type signature). If we make a call `myNot False`, then it's the second line that *matches* that call. Hence the name "pattern matching".

Hopefully, it's clear that if you call `myNot` with a variable, not an actual value, pattern matching will still work just fine. In that case, Haskell simply evaluates the value of the variable and performs pattern matching then.

So with this new definition, calling:

```hs
myNot x
```

Still properly returns:

```
False
```

So we have two versions of the same function:

```hs
myNot :: Bool -> Bool
myNot b = if b then False else True
```
```hs
myNot :: Bool -> Bool
myNot True = False
myNot False = True
```

For all intents and purposes, these two functions behave in the same way (and have the same type). Which one you prefer depends entirely on you.

Do you want to see yet another way to write the same function? Here you go:

```hs
myNot :: Bool -> Bool
myNot b
    | b = False
    | otherwise = True
```

Arguably this way of writing the function looks the most exotic.

It uses what is known as "guards". A guard is basically a condition, which is placed between `|` and `=` characters. When the condition is satisfied, a function body that is defined after `=` gets executed.

In our case, the first guard is `b == True`. But - just as before - we can write the same condition as simply `b`. If `b` is True, this condition is satisfied and the function body that returns False will be executed.

Otherwise (so when `b` is not True), the function body that returns True will be executed.

Interestingly, there is nothing magical about the keyword `otherwise`. (Are you noticing a pattern here, where some "feature" of the language is not really a feature, but simply something coded in that language?)

You can convince yourself that this is true by writing `otherwise` in the `ghci` console. As a response you will see:

```
True
```

Yup. `otherwise` is nothing more than a regular variable, holding the value True! Just as our `x` is!

So, without the `otherwise` our "guarded" version of the function would look like this:

```hs
myNot :: Bool -> Bool
myNot b
    | b = False
    | True = True
```

Just as in `if then else`, a condition *has to* be a Bool value. If the last condition is set to True, like it's the case here, it will always hold and therefore it will act as a catchall case if the guards above it fail. Calling it `otherwise` is just done to make this a bit more readable.

One more thing to mention here is that we used indentation. You see that lines startin with `|` characters are moved a bit to the right. If we didn't do it, and wrote the code like this:

```hs
myNot :: Bool -> Bool
myNot b
| b = False
| True = True
```

we would get an error while loading that file in `ghci`:

```
test.hs:3:1: error: parse error on input ‘|’
  |
3 | | b = False
  | ^
```

Indenting code makes it more readable for humans and - as you can see - also helps the compiler understand that a given line is still a part of the definition that began in the previous line.

How much you indent the code is not actually important to the compiler - it has to be at least one space. But adding a few more spaces is better to keep the code nicely formatted for humans.

So we have written `myNot` in 3 different ways. Which one you prefer depends on you. Nevertheless, it's extremely valuable to get to know all 3 constructs that we've used - if then else, pattern matching and guards - because they appear almost all the time in Haskell code.

We used them in separation here, but in the future, you will see that you can mix those constructs in various ways, especially when writing more complex code.

#### Creating Types and Values

So far we have written a custom `not` function for the `Bool` type. But what if we could recreate the `Bool` type itself, as well as its values? Is it even possible?

Indeed, it's possible and even simple. Let's create a `MyBool` type. It will have two values - `MyTrue` and `MyFalse`. It might seem that we are getting a bit possessive here (wink, wink), but that's only to avoid conflicts with already existing names.

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

Unfortunately I lied to you *a bit*. If you type this in `ghci`:

```
MyTrue
```

You will see a mysterious message:

```
<interactive>:68:1: error:
    • No instance for (Show MyBool) arising from a use of ‘print’
    • In a stmt of an interactive GHCi command: print it
```

It happens because `ghci` tries to simply print the value, but... It doesn't know how!

This is part of the language that will cover in the future articles. Luckily we don't have to worry about it for now. Haskell can create sane default for printing, you just have to command it to do that, by adding the following line to type defintion:

```hs
data MyBool = MyTrue | MyFalse
     deriving (Show)
```

If you now call `ghci`:

```
MyTrue
```

It will simply print back:

```
MyTrue
```

As I said - a sane default. In the future we will learn how to customize that printing capability, but for now it's perfectly fine.

You can now write functions that operate on this brand new type, just as we wrote a function for the built-in `Bool` type.

So if we wanted `myNot` to work on that custom `MyBool` type, we would do it like that:

```hs
myNot :: MyBool -> MyBool
myNot MyTrue = MyFalse
myNot MyFalse = MyTrue
```

We simply replaced all occurrences of `Bool` with `MyBool`, all occurrences of `True` with `MyTrue`, and all occurrences of `False` with `MyFalse`.

We now have both a built-in version (`Bool`) and a custom version (`MyBool`) of a boolean type. Wouldn't it be convenient to write functions to switch between them?

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

We used two different ways to write a function on purpose here. Note that we wouldn't be able to use `if then else` with `MyBool` type as a conditional, because it works only on the built-in `Bool` type.

But on the other hand, we can use pattern matching in both, because pattern matching works with custom-defined values without any problems.

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

You will see `True` as the response. 

What happened here is that we converted `True` to `MyTrue` using the `boolToMyBool` function (inside the parenthesis), and then we took that result and converted it back to `True` using the `myBoolToBool` function, all in a single expression.

Is it a bit nonsensical example? Perhaps, but it shows us how we can chain multiple function calls.

In fact, the brackets around the first function call are important.

Try to run the following in `ghci`:

```hs
myBoolToBool boolToMyBool True
```

The compiler will show a fairly elaborate error message, but if you read it carefully, you will find the following sentence:

```
The function ‘myBoolToBool’ is applied to two arguments,
 but its type ‘MyBool -> Bool’ has only one
```

Ha, so we found what is the problem. Indeed, our code looks as if we are trying to apply the `myBoolToBool` function to two parameters - `boolToMyBool` and `True`. Remember how `f x y` was representing calling a function `f` on two parameters? That's exactly what we are doing here! In that case, `f` is `myBoolToBool`, `x` is `boolToMyBool` and `y` is `True`.

We have to show the compiler that we want to apply the `myBoolToBool` function to a *single* parameter. And that parameter is a result of calling `boolToMyBool` on `True`. So we wrap that call in parenthesis to make that clearer (both to the compiler and us):

```hs
myBoolToBool (boolToMyBool True)
```

Can we use those conversion functions for something more practical than needlessly translating booleans back and forth? Absolutely - we can use them to rewrite our `myNot` implementation once again.

We can use the fact that the `Bool` type has already the `not` function defined. It works exactly how we want, it just operates on different types. So let's take a `MyBool` value, convert it to `Bool`, use `not` on it, and then convert it back to `MyBool`:

```hs
myNot :: MyBool -> MyBool
myNot mb = boolToMyBool (not (myBoolToBool mb))
```

Let's review step by step how that function works.

Since it's a function of type `MyBool -> MyBool`, its argument is a `MyBool` - that's why we called it `mb`. We pass that variable to a function - `myBoolToBool mb` - and as a result, we are getting something of type `Bool`. Then we are applying `not` on it, by writing `not (myBoolToBool x)`. Note that at this step the type doesn't change - we are feeding `not` a `Bool` and getting a `Bool` again, since `not` is of type `Bool -> Bool`. At the end we convert back to `MyBool`, by writing `boolToMyBool (not (myBoolToBool x))` - which is the return value of our function.

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

This technique of tracking which value has which type is extremely valuable, especially when just starting with Haskell. Whenever you feel lost about how a certain function works, I would encourage you to analyze all the types of all the values in that function. You will discover that when you know all the types well, it's much easier to understand how the code works and what it does.

This is the second example of a skill that Haskell teaches you, which is immediately transferable to programming in other languages. Even if your day-to-day language is loosely typed and doesn't have types in its actual syntax, you can still use this way of thinking to better understand functions while reading code.

In time you will discover that this allows you to understand code much faster, especially the code that you haven't written yourself.

#### Conclusion

So we played with Bools in Haskell, serving as our introductory lesson in that language.

We've learned the basics of Haskell's syntax, we've seen how to create and use functions, and even how to create some simple datatypes.

In future articles, we will elaborate on those ideas quite a bit, so if you are hooked on Haskell by now (as I hope you are!), I would recommend to follow me on [Twitter](https://twitter.com/m_podlasin). I don't run any kind of newsletter email or anything like that, so that's the best way to get notified when a new article drops.

If you have any questions or comments regarding the article, you can reach me there as well. I would like to keep improving this article so that it serves others as best as possible.

Thanks for reading and see you soon!