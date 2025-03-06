import React from 'react';
import ReactPlayer from 'react-player';
import CourseContent from '../components/CourseContent';
import CourseProgress from '../components/CourseProgress';

export const CourseDetailPage = () => {
  return (
    <div className="w-full flex justify-center py-6 bg-gray-100">
      <div className="w-11/12 border-2 border-black p-6 flex gap-6 bg-white shadow-lg rounded-lg">
        {/* Left Section - Course Details */}
        <div className="w-2/3">
          {/* Course Title & Categories */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Course Title: Machine Learning And AI</h1>
            <h3 className="text-lg text-gray-600">Categories: Data Science, AI, ML</h3>
          </div>

          {/* Video Section */}
          <div className="w-full">
            <ReactPlayer 
              url="https://youtu.be/bSDprg24pEA?si=khrGR5AtdfkHOUgd"
              width="100%" 
              height="400px" 
              controls
            />
          </div>

          {/* Course Info */}
          <div className="mt-6 px-4">
            <h1 className="text-2xl font-bold mb-2">Course Info</h1>
            <p className="text-lg text-gray-700">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptatem blanditiis dolor fuga quaerat eaque eum provident ratione. Cum quidem voluptas numquam provident nihil voluptatibus voluptates reiciendis iusto quam, omnis reprehenderit, vel eos corrupti id. Est earum vel cupiditate aliquid dolorum neque culpa? Voluptates accusamus voluptatibus amet perferendis repellat ab veritatis iusto ipsum quae iure.
            </p>
          </div>

          {/* Course Content */}
          <div className="mt-6">
            <CourseContent />
          </div>
        </div>

        {/* Right Section - User Progress */}
        <div className="w-1/3">
          <CourseProgress />
        </div>
      </div>
    </div>
  );
};
