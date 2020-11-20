import React from "react"
import me from '../images/me.jpg';
import '../pages/index.css';
import 'typeface-tajawal';

const Layout = ({children}) => (
  <div className="flex flex-col items-center p-2 mt-5">
    <div>
        <div className="flex items-center">
            <img className="w-20 h-20 rounded-full flex-shrink-0" src={me} />
            <h1 className="text-center text-4xl text-base md:text-5xl font-extralight text-indigo-900 transform translate-y-2 ml-4 sm:ml-7 sm:mr-7">Mateusz Podlasin</h1>
        </div>
    </div>
    {children}
  </div>
)

export default Layout
