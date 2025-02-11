import React from 'react'

export const Dashboard = () => {

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
            + Create a New Course
          </button>
        </div>
    </div>
  )
}
