import React from 'react'
import { Navbar } from '../components/Navbar'
import { Banner } from '../components/Banner'
import { Courses } from '../components/Courses'
import Footer from '../components/Footer'

export const Home = () => {



  return (
    <div className='home h-full'>
      <Banner />
      <div className='text-center mt-6'>
        <h1 className='text-3xl font-semibold'>Featured Courses</h1>
        <p className='text-lg mt-4'>Learning often happens in classrooms but it doesn’t have to. Use Eduflow to facilitate learning experiences no matter the context.</p>
      </div>
      <Courses />
      <Footer />
    </div>
  )
}
