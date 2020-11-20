import React from "react"
import Layout from '../components/layout';

const indexToC = [
  {
    name: 'Front-End & Functional Programming',
    children: [
      {
        name: 'twitter',
        link: 'https://twitter.com/m_podlasin'
      },
      {
        name: 'articles',
        link: '/articles',
        internal: true
      }
    ]
  },
  {
    name: 'Travel & Photography',
    children: [
      {
        name: 'instagram',
        link: 'https://instagram.com/mpodlasin'
      }
    ]
  }
]

const IndexPage = () => (
  <Layout>
      <div className="text-center flex flex-col mt-5">
        {indexToC.map(element => (
          <div className="border-b border-gray-200 m-2">
            <h2 className="text-xl sm:text-2xl font-light">{element.name}</h2>
            <ul className="flex justify-evenly m-2">
              {element.children.map(subelement => (
                <li className="font-medium text-indigo-900 text-xl"><a target={subelement.internal ? undefined : '_blank'} href={subelement.link}>{subelement.name}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-center text-indigo-900 text-lg mt-2 transform translate-y-1.5">hi@mpodlasin.com</div>
  </Layout>
);

export default IndexPage
