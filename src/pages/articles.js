import React from "react"
import { Helmet } from "react-helmet";
import Layout from '../components/layout';
import MainLinks from "../components/main-links";

const articles = [
    {
        title: 'Haskell - The Most Gentle Introduction Ever',
        links: {
            here: '/articles/haskell-i',
        }
    },
    {
        title: 'I was gone from tech social media for almost half a year. Here is why. (Yes, it was burnout.)',
        links: {
            here: '/articles/burnout',
            devto: 'https://dev.to/mpodlasin/i-was-gone-from-tech-social-media-for-almost-half-a-year-here-is-why-yes-it-was-burnout-44ia',
        }
    },
    {
        title: 'Generators in JavaScript, Part III - "Advanced" Concepts',
        links: {
            here: '/articles/generators-iii',
            devto: 'https://dev.to/mpodlasin/generators-in-javascript-part-iii-advanced-concepts-ka4',
        }
    },
    {
        title: 'Generators in JavaScript, Part II - Simple use-case',
        links: {
            here: '/articles/generators-ii',
            devto: 'https://dev.to/mpodlasin/generators-in-javascript-part-ii-simple-use-case-g6f',
        }
    },
    {
        title: 'Generators in JavaScript, Part I - Basics',
        links: {
            here: '/articles/generators-i',
            devto: 'https://dev.to/mpodlasin/generators-in-javascript-part-i-basics-51kg',
        }
    },
    {
        title: 'Iterables & Iterators - An In-Depth JavaScript Tutorial',
        links: {
            here: '/articles/iterables-and-iterators',
            devto: 'https://dev.to/mpodlasin/iterables-iterators-an-in-depth-javascript-tutorial-5eh2'
        }
    },
    {
        title: '5 things I\'ve put on my resume to stand out and get a badass job ',
        links: {
            devto: 'https://dev.to/mpodlasin/5-things-i-ve-put-on-my-resume-to-stand-out-and-get-a-badass-job-2o1n',
        }
    },
    {
        title: 'Functional Programming in JS: Functor - Monad\'s little brother ',
        links: {
            devto: 'https://dev.to/mpodlasin/functional-programming-in-js-functor-monad-s-little-brother-3053',
        }
    },
    {
        title: '4 Tricks to Learn Programming MUCH Faster',
        links: {
            devto: 'https://dev.to/mpodlasin/4-tricks-to-learn-programming-much-faster-2e5d',
            medium: 'https://medium.com/@mpodlasin/4-tricks-to-learn-programming-much-faster-accb6224d164',
        }
    },
    {
        title: 'Functional Programming in JS, part II - Immutability (Vanilla JS, Immutable.js and Immer)',
        links: {
            devto: 'https://dev.to/mpodlasin/functional-programming-in-js-part-ii-immutability-vanilla-js-immutable-js-and-immer-2ccm',
        }
    },
    {
        title: ' 5 (practical) reasons why your next programming language to learn should be Haskell',
        links: {
            devto: 'https://dev.to/mpodlasin/5-practical-reasons-why-your-next-programming-language-to-learn-should-be-haskell-gc',
            medium: 'https://medium.com/@mpodlasin/5-practical-reasons-why-your-next-programming-language-to-learn-should-be-haskell-4b02422da6e',
        }
    },
    {
        title: 'Functional Programming in JS, part I - Composition (Currying, Lodash and Ramda)',
        links: {
            devto: 'https://dev.to/mpodlasin/functional-programming-in-js-part-i-composition-currying-lodash-and-ramda-1ohb',
            medium: 'https://medium.com/@mpodlasin/functional-programming-in-js-part-i-composition-currying-lodash-and-ramda-5d5015f3fdb0',
        }
    },
    {
        title: 'My thoughts on endless battle of React state management libraries (setState/useState vs Redux vs Mobx) ',
        links: {
            devto: 'https://dev.to/mpodlasin/my-thoughts-on-endless-battle-of-react-state-management-libraries-setstate-usestate-vs-redux-vs-mobx-2kal',
            medium: 'https://medium.com/@mpodlasin/my-thoughts-on-endless-battle-of-react-state-management-libraries-setstate-usestate-vs-redux-vs-2fd5869aa637',
        }
    },
    {
        title: 'Solving the mystery of Promise *catch* method - and learning more about the *then* on the way',
        links: {
            devto: 'https://dev.to/mpodlasin/solving-the-mystery-of-promise-catch-method-and-learning-more-about-the-then-on-the-way-1okl',
        }
    },
    {
        title: 'An in depth explanation of Promise.all and comparison with Promise.allSettled',
        links: {
            devto: 'https://dev.to/mpodlasin/an-in-depth-explanation-of-promise-all-and-comparison-with-promise-allsettled-2olo',
            medium: 'https://medium.com/@mpodlasin/an-in-depth-explanation-of-promise-all-and-comparison-with-promise-allsettled-769032da9d9a',
        }
    },
    {
        title: 'React.useEffect hook explained in depth on a simple example',
        links: {
            devto: 'https://dev.to/mpodlasin/react-useeffect-hook-explained-in-depth-on-a-simple-example-19ec',
            medium: 'https://medium.com/@mpodlasin/react-useeffect-hook-explained-in-depth-on-a-simple-example-ec9f898d32d3',
        }
    },
    {
        title: 'Async/await & Promise interoperability',
        links: {
            devto: 'https://dev.to/mpodlasin/async-await-promise-interoperability-7oe',
            medium: 'https://medium.com/@mpodlasin/async-await-promise-interoperability-23b8f01ea86d',
        }
    },
    {
        title: '3 most common mistakes when using Promises in JavaScript ',
        links: {
            devto: 'https://dev.to/mpodlasin/3-most-common-mistakes-when-using-promises-in-javascript-oab',
            medium: 'https://medium.com/@mpodlasin/3-most-common-mistakes-in-using-promises-in-javascript-575fc31939b6',
        }
    }
]

const ArticlesPage = () => (
    <>
        <Helmet title="Mateusz Podlasin - Front-End and Functional Programming Articles" />
        <Layout>
            <MainLinks />
            <div style={{maxWidth: 600}} className="p-5">
                <h2 className="text-2xl sm:text-3xl font-light mb-6 text-center">Front-End {'&'} Functional Programming Articles</h2>
                <ul>
                    {articles.map(article => (
                        <li className="border-b pb-4 pt-4">
                            <h3 className="text-xl mb-2 font-light">{article.title}</h3>
                            <div className="text-xl font-medium">
                                {article.links.here && <><a className="text-indigo-900 pr-8" href={article.links.here}>here</a></>}
                                {article.links.devto && <><a className="text-indigo-900 pr-8" target="_blank" href={article.links.devto}>dev.to</a></>}
                                {article.links.medium && <><a className="text-indigo-900" target="_blank" href={article.links.medium}>medium</a></>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div> 
        </Layout>
    </>
)

export default ArticlesPage
