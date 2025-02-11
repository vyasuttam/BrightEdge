import React from 'react'
import { Navbar } from '../components/Navbar'

export const RootLayout = ({ children }) => {

    return (
        <div className=''>
            <Navbar />
            {children}
        </div>
  )
}
