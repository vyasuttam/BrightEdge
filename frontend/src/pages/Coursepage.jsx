import React from 'react'
import CourseFilter from '../components/CourseFilter'
import { Courses } from '../components/Courses'
import Footer from '../components/Footer'

export const Coursepage = () => {

  return (
    <>
        <div className='w-full flex justify-center'>
            <div className='w-10/12 flex flex-col items-center'>
                <div className='w-full mt-2'>
                    <h1 className='pl-10 text-2xl'>Search Query : </h1>
                </div>
                <div className='flex my-6'>
                    <CourseFilter />
                    <div className='flex-1'>
                        <Courses />
                    </div>
                </div>

            </div>
        </div>
        <Footer />
    </>
  )
}
