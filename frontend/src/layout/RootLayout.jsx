import React from 'react'
import { Navbar } from '../components/Navbar'
import Footer from '../components/Footer'

export const RootLayout = ({ children }) => {

    return (
        <div className=''>
            <Navbar />
            {children}
        </div>
  )
}
