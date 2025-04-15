import React from 'react';
import { Link } from 'react-router-dom';

export const Banner = () => {
  return (
    <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] xl:h-[600px]">
      <img 
        src="/BrightEdge_Banner1.jpg" 
        alt="Banner" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Text Content */}
      <div className="absolute left-24 top-5 inset-0 flex items-center justify-start px-6 sm:px-12">
        <div className="text-gray-900 space-y-4 bg-opacity-80 p-4">
          <h1 className="text-2xl sm:text-5xl font-bold leading-tight">
            Online<br />
            <span className="text-blue-600">Learning and Examination</span><br />
            Platform
          </h1>
          <p className="text-sm sm:text-lg">
            "Master new skills, take proctored exams, and earn credentials — all in one seamless platform."
          </p>
          <Link
            to="/courses"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow text-sm sm:text-base"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};
