import React from 'react'
import { IoSearch } from "react-icons/io5";

export const Navbar = () => {

  return (
    <nav className='p-4 flex justify-center box-border z-10 shadow-gray-400'>
      <div className='container flex items-center lg:w-9/12'>
        <div className='logo mx-4'>
            <h1>Logo</h1>
        </div>
        <div className='flex-grow px-4 relative flex items-center border border-gray-30'>
          <div>
            <IoSearch className=''/>
          </div>
          <input
              type="text"
              placeholder="Search for courses, exams..."
              className="w-full px-4 py-2 rounded-md 0 focus:outline-none"
            />
        </div>
        <div className='mx-4 flex justify-between items-center gap-4'>
            <div>Courses</div>
            <div>Exams</div>
            <div>Profile</div>
        </div>
      </div>
    </nav>
  )
}
