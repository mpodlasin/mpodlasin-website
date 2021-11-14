---
slug: "/articles/vim-weeks-ii-and-iii"
date: "2021-10-31"
title: "1 Month Vim Only Challenge - Weeks 2 and 3"
---

This article is part of my series "1 Month Vim Only Challenge", where I force myself to use vim for 1 month and, at the same time, create articles talking about my progress, challenges, and frustrations.

You can read the two previous articles [here](https://mpodlasin.com/articles/vim-challenge-kickoff) and [here](https://mpodlasin.com/articles/vim-week-i).

Note that this article is not a tutorial or anything like that. It's just a collection of my purely subjective experiences while doing the challenge.

### Crisis in Vim City

The two previous articles in the series were very optimistic. I was motivated to do the challenge and the first week went surprisingly smooth.

However, it's probably not a surprise that in the second and third weeks the things started becoming more challenging. Energy and attitude from the first week slowly disappeared. I lost my rose-colored glasses and started noticing more and more problems with my workflow and setup.

The thing is, the two past weeks were extremely busy for me, both at work as well as in private life. At work, we are getting close to finishing an important project, so I had to stay focused on that. And on top of that, I decided to travel to Turkey for one week, in order to meet my coworkers.

Lack of free time, combined with pressures of delivering the project, made using vim very difficult for me. In fact, I was close to giving up multiple times. The only thing that stopped me was the fact that I framed this whole thing as a "challenge".

I didn't do that by accident when I was starting this series. I knew that there will be moments when using vim will become difficult, especially at work. So I decided to do it as a challenge, in order to literally force myself to go through the toughest times.

And it worked. As of now, I still haven't reinstalled VSCode and haven't used it even once. Yes, I am still writing this article in vim.:w

So what exactly were the problems? Let's mention some stuff, in no particular order.

### Working On Multiple Files

For the longest time, I didn't know that vim has tabs functionality. I just used windows, which splits your view into multiple subwindows, effectively giving each file less and less space on the screen.

For some time, using windows was good enough for me. However, even this simple setup was awkward, because default keyboard shortcuts to navigate between windows are very, very uncomfortable. Pressing `Ctrl+W` while staying in the home row gives a solid stretch to your fingers...

Currently, I am trying to force myself to use tabs more, but, again, navigation seems... weird. `Ctrl+T` is no less uncomfortable than `Ctrl+W`. Especially when you have multiple tabs open, it can get tricky to navigate between them without giving it much thought.

Perhaps it's just a matter of getting used to, or perhaps I should remap which keys are used for navigation. Or perhaps there is a "better" tabs plugin somewhere.

I will try to research that, but "out of the box" behavior is not the best, honestly.

### Navigating Large Projects

NERDTree, which I am using as my filesystem tree, is very pleasant to work with and well documented. However, I still find it awkward to use the keyboard for navigating large directory structures. I believe I was much faster with a mouse.

To give you some context, the repositories I am currently working in can be massive. Those are often monorepos, containing multiple separate packages.

Perhaps this is just a matter of time, but for now, I feel that this way of navigating files inhibits me, *especially* when I have to find a file fast.

What would help me would be also some kind of global file search. Vim has some built-in stuff for that, like `:grep` command, but... I never really got it to work. 

And even if I did, the UX of that command is frankly horrible, requiring you to type the command with a searched phrase *and then* type a second command, which shows you the search results. Why? Just give me a command where I can write something like `:gs "some searched term"` and see all the results immediately, preferably with a "jump to file" functionality.

Now, I have seen some plugins doing that, which looked extremely promising, but the installation and/or setup turned out to be a bit trickier than I expected. So this is also something I would have to devote some time to if I want to increase my efficiency.

### Working With TS Tooling

In the last article, I was very positive about the TypeScript tooling that I started using.

However, I started discovering limitations fairly quickly. Those limitations led me to install another plugin - [coc.nvim](https://github.com/neoclide/coc.nvim).

This extension is very interesting because it promises to "Make your Vim/Neovim as smart as VSCode."

It's a more general plugin, that - rather than supporting a single language or functionality - allows you to extend vim in a very similar way as you would extend VSCode. As far as I understand it, underneath it uses the same tooling that VSCode uses. Because of that, support for - let's say - TypeScript is virtually the same in vim and VSCode. Autocomplete works the same way, autoimports work the same way, etc.

This is an amazing idea because it utilizes the great and battle-tested work that was already done for VSCode.

As I've said, the installation itself is very simple. But - as the authors of the extension themselves recommend - you still have to do some keybindings configuration, in order to get the most out of it.

Because of that, I still don't really know how to achieve certain results using this plugin. I don't know for example how to check the inferred type of an expression. I also have trouble with identifying if my file has any TS errors because it is presented on a per-line basis and I can't see all the lines in the file at the same time.

Funnily enough, I still have the previous TS plugin installed. Mostly because I got used to how well some stuff worked there. On the flip side, the plugin started acting crazy in some (admittedly rare) cases. Presumably, because it doesn't successfully detect which TypeScript version I am using in each package of the multirepo (?).

So even though both of those tools are very impressive and mature, even here I will have to do additional work of configuring stuff, in order to make the workflow perfect.

### Working With Eslint

There are still more things that I need to somehow solve. Because we are working on a huge multirepo, even the linting command runs very long. Of course, most of my coworkers mitigate that by using a VSCode with an extension that lints a specific file during editing.

There exist of course vim plugins that do the same thing, I just didn't put aside some time to try one out. 

And my fear - based on those TS plugins - would be that even after installation, I would have to do some additional configuration work just to make everything work seamlessly.

### Yes, It's All My Fault

At this point, I know what you are thinking. "Well, what's the problem? You just have to properly set up the plugins or add new ones and everything will work just as you would like it!".

And that's true. It's all my fault. But that's exactly the whole point of my article. If I had lots of free time, setting up the workflow with vim would be simply fun.

But when you have to balance work and private life at the same time, it's surprisingly difficult to devote even twenty minutes to set up a particular plugin.

What keeps happening is that I start setting something up - say, I install a specific plugin. But then there is still a bulk of configuration that I should do. And how to configure those plugins is often a bit poorly documented *and/or* it requires the knowledge of vim scripting language, at least the basics of it.

This makes it extremely difficult to assess how long a certain configuration will take. It might turn out to be a breeze and take ten minutes, or it might turn out that things are more complex than expected, and you might spend a whole day, trying to get some plugin to work.

And yes, *I know* that most of the time, it will just take ten to twenty minutes. Those plugins are well maintained and have solid communities behind them. But when you have tasks at work that you need to execute ASAP, it's super difficult to make a rational decision and devote some time to configure your tooling.

On top of that, this ten to twenty minutes involves only one plugin. And, as you've seen before, I have problems involving many of them. So it would take me even more time to configure *everything*.

The ultimate point here is simple - if you are going to take a deep dive into vim, make sure that you have enough free time to really learn and configure everything properly. If you reserve some time, this process will be much more enjoyable. But if you are speeding through plugin documentation, because you have work that needs to get done, using vim might become challenging.

It just isn't a "plug and play" tool. It gives you lots of freedom regarding configurability, remapping keybindings, etc. But this power comes also with a more demanding setup process.

With great power comes great responsibility.

