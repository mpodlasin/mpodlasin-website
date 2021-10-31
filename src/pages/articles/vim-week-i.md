---
slug: "/articles/vim-week-i"
date: "2021-10-31"
title: "1 Month Vim Only Challenge - Week 1"
---

It's currently Saturday. 

Exactly one week ago I have started my [#1MonthVimOnlyChallenge](https://twitter.com/search?q=%231MonthVimOnlyChallenge). I removed all other editors/IDEs from my computer and I forced myself to use vim for exactly 1 month, documenting my journey on the way. I plan to write short  weekly articles and I am posting regular updates on my [Twitter](https://twitter.com/m_podlasin).

Let's answer the big questions first.

Did I give up? Nope.

Am I still writing this article in vim? Absolutely!:w

Am I enjoying myself? 100 percent!!!

In the article, I will summarize my various observations regarding using vim on a daily basis. This is not a tutorial, not a guide, just some random thoughts and feelings, in more or less random order.

## The Setup

Probably the most surprising thing for me is that my setup is still fairly simple. I do plan to complicate it in the following week, to challenge myself a bit, but what I currently have already allowed me to be productive, even at my day job.

This is probably the moment where everyone expects me to show off my vim config. And I could to that, but there isn't really a point. The config is literally just a few lines. It just enables a few basic options, like syntax highlighting, showing line numbers, etc. Nothing beyond your standard "Write Your Own Vim Config" articles, that you can find hundreds of online.

Plugins are, I feel, more interesting. Without the plugins, vim is really just a basic text editor, even though it does have some built-in handling for languages like C, Java, and even JavaScript. However, my first attempts to open a TypeScript file without any plugins, literally hanged the vim window, presumably because syntax highlighting got very, very confused.

This immediately went away after I've installed [typescript-vim](https://github.com/leafgarland/typescript-vim), which provides syntax highlighting and other basic handling of TypeScript files. This immediately made vim work great with my TypeScript projects.

The installation of plugins is extremely easy. Essentially you just have to do a `git clone` into a proper directory and you are done! This seems to be a new-ish thing, introduced in vim 8. You can see that plugins still support various "vim plugin managers", which tells me that back in the day installing and managing those plugins was a huge pain in the ass. Now it's luckily trivial.

Finding the plugins is also easy. I just googled "vim typescript" and immediately saw links to GitHub repos.

typescript-vim plugin only gives you basic capabilities - it doesn't include autocompletion, type-checking inside the file, etc. That's where [tsuquyomi](https://github.com/Quramy/tsuquyomi) comes in. It promises that it will "make your vim a TypeScript IDE". I am not sure if I would go *that* far, but it does give you many capabilities that you expect in a modern TS editor - autocomplete, navigation to type definitions, compilation errors that appear in the file, etc.

Functionally this stuff allows you to do the same things you would do in VSCode, but bear in mind that the UI/UX is... well... not as streamlined.

I don't know who decided that triggering autocomplete menu should be done by pressing `Ctrl+X` *and then* `Ctrl+O`. It's the least friendly and effective keyboard shortcut I could think of. Once you get used to it, it's not horrible, but next week I will almost for sure look into remapping that.

On the other hand, I love how "go to definition" functionality is handled, where `Ctrl+]` immediately takes you to the definition of an expression you are currently pointing at with your cursor. And then `Ctrl+t` immediately takes you back to the exact place where you pressed `Ctrl+]`. This makes navigating TS files fast, pleasant, and efficient.

There is also some stuff that is lacking, or at the very least I still don't know how to do it yet.

I still don't know how to see the inferred type of expression I am hovering over. I tried googling that, but I've seen some intimidating answers, mentioning stuff like `coc.nvim` etc. So I gave up back then but I plan to go back to it soon.

Also, I don't know how to do autoimports. Autoimport is a feature that frankly changed my life a few years ago. I could just type in the name of the value/class/interface/whatever and proper import would automagically appear at the top of the file. I want that, I need that, so this week I will attempt to research that as well.

## Limitation Is A Blessing

Apart from what I've mentioned above, I have also installed [NERDTree](https://github.com/preservim/nerdtree), which is a plugin for navigating directories and files. 

And I also started experimenting with some Haskell/PureScript stuff, but this is at an earlier stage because I am doing that only in my free time, outside of work.

Oh, and I also have [iceberg](https://github.com/cocopon/iceberg.vim) color scheme installed, because the default syntax highlighting colors are a bit too flamboyant for my taste.

But other than that - this is it! I have nothing more so far. And this simple setup - a few lines of vim config, 3 plugins (in my day job), and 1 color scheme - already get me like 80% to where I would like to be. I am kind of expecting that getting from 80% to 90% will be more difficult than getting from 0% to 80%, but we will see next week.

And quite frankly, limitations can be sometimes good. I still remember my CS professor, who used to discourage us from using syntax highlighting. He claimed that it made us dumber, and stopped us from actively thinking about the syntax. I don't know how much truth was in that in the end, but I did notice, that certain limitations of vim forced me to think more during coding. This especially relates to navigating large projects, working concurrently on multiple files, and writing imports by hand. 

1 week is not a long time and I do plan to improve those aspects of my vimming in the following days. However, if I didn't, I wouldn't be surprised if, over a longer period of time, those limitations would give me a better understanding of the layout of my projects. Where certain files and modules are stored, how they relate to each other, how the dependency tree looks like etc.

It's kind of like using Grammarly for writing, which is helping me on a daily basis, but also tanking my actual writing skills, because I am using my brain less.

## This Hurts!

After the first 2 days of the vim challenge, I started having pronounced wrist pains. This scared the sh\*\* out of me.

I was having similar pains before, but using vim seemed to aggravate it. Not surprising really, when you think about it. Vim forces you to stay in the home row more and reach for the mouse less.

I am quite confused at this point because the mantra of touch-typing is "stay in the home row". But the issues I had made apparent that reaching for the mouse, or changing hands position from time to time is actually a good thing - it allows you to relax your muscles for a bit, instead of constantly staying in the same, a bit strenuous, position. 

Contrargument here would be of course that the home row position shouldn't be strenuous at all. You either have to change your technique or setup in order to make sure that's the case.

Now, this of course is not an issue with the vim itself. Quite the opposite, vim helped me identify that the ergonomics of my writing are still suboptimal.

Luckily the pains didn't really appear after those first two days. If they do, however, I am planning on trying out a split keyboard. I wanted to do that for the longest time now, and perhaps vim will push me to finally do it.

And I want to see people's faces in a cafe, where I take out this bizarre keyboard and turn on a program that looks like a hacker's console. I am half expecting them to turn on VPNs at this point or something.

## Vimming In Vim 

Let's talk a bit about using vim itself. So far I was mostly touching on tangential topics like setup etc.

But how does it feel, to use vim, with its bizarre user interface, daily, including work?

Not bad actually. Bear in mind, I've already used vim during my university days, so the learning curve was much, *much* lower for me this time.

I just did some basic tutorials on the weekend, which they are plenty of out there. Many of them are interactive and/or involve some gamification aspect, which made the whole "relearning" process engaging and fun.

Vim has two basic modes - regular and insert. And I've noticed that, when using vim, my brain also works in two different modes, depending on the situation.

In a "regular" mode, I am simply working, not thinking much about the fact that I am currently using vim. Reaching this stage is actually much, much easier than you would expect. I think that people really overblow how complex basic vimming is. If you can wrap your head around using "WASD" for playing video games, you will equally easily switch to "HJKL" for navigating a text file.

The second mode is what I call a "golf" mode. Those are moments, where I actually slow down and attempt to do something in a smarter, more terse way. Those are fun little challenges throughout the day, that can break you out from the monotony of constant, mindless coding. 

And the best thing about this is that slowly, over time, golf mode skills are bleeding over to a regular mode. You start using certain techniques and shortcuts more and more often until they become second nature and a part of your regular mode arsenal.

It really works just amazing and it gives you a real promise of becoming, over time, more and more efficient in coding.

I guess the only problem here for me is that - especially in my day job - I find myself not going into the golf mode nearly enough. When there is a pressure of finishing tasks, fixing bugs, and delivering sprints it can be hard to allow yourself for a relaxing golfing break. But this is, again, a me problem rather than a vim problem.

Apart from that, I believe that working in those two modes really can make you faster and more efficient over time.

## Vim Anxiety

During this week I've posted a joke on Twitter. I have written: 

"If you want to get a promotion, using vim is the best way. It discourages you from writing code, so you start doing more managerial and executive tasks."

And although I wrote this as a joke, it wasn't by accident. There is a (quite substantial) grain of truth in that.

I really did notice myself doing much more code reviews, research, and general "managerial" tasks. And I quickly realized that this is simply due to "vim anxiety". Even though on a logical level I know I can use vim and perform basically any task in it, I still have this thought at the back of my head, telling me that it will be unpleasant, awkward, and more difficult, compared to if I was using the good old VSCode.

I've also noticed that I am scared of doing pair programming where I show people my editor. You know this effect - when people are looking at your hands, suddenly your brain starts working at 5% of usual capacity. So imagine using vim *and* having people look at your monitor. This would be probably the most challenging thing imaginable.

And funnily enough, I will probably *have to* do it this week, because I pledged to my coworkers that I will prepare some kind of tutorial for them...

So... wish me luck! Next week I will tell you how it all went.


