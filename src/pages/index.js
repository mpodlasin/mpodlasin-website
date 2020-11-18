import React from "react"
import './index.css'
import 'typeface-tajawal';
import me from '../images/me.jpg';

const indexToC = [
  {
    name: 'Frontend & Functional Programming',
    children: [
      {
        name: 'twitter',
        link: 'https://twitter.com/m_podlasin'
      },
      {
        name: 'articles',
        link: '/articles'
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
  <div className="flex justify-center items-center h-screen">
    <div className="border border-indigo-900 p-3 main-borders">
      <div className="flex items-center mb-3">
        <img className="w-20 h-20 rounded-full mr-3" src={me} />
        <h1 className="text-5xl font-extralight text-indigo-900 flex items-center justify-center flex-grow transform translate-y-2">Mateusz Podlasin</h1>
      </div>
      <div className="text-center flex flex-col items-center">
        {indexToC.map(element => (
          <div className="border-b m-2">
            <h2 className="text-2xl font-light">{element.name}</h2>
            <ul className="flex justify-evenly m-2">
              {element.children.map(subelement => (
                <li className="font-medium text-indigo-900 text-xl"><a href={subelement.link}>{subelement.name}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="text-indigo-900 text-lg mt-2 transform translate-y-1.5">hi@mpodlasin.com</div>
    </div>
  </div>
)

export default IndexPage
