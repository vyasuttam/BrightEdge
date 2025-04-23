import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CourseCard from './mini/CourseCard';

export const EnrolledCourse = () => {
  const [courses, setCourses] = useState([]);

  const getEnrolledCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/course/getEnrolledCourses", {
        withCredentials: true,
      });
      console.log(res);
      setCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          🎓 Your Enrolled Courses
        </h2>

        {courses && courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={course._id || index}
                className="transition-transform hover:scale-[1.02]"
              >
                <CourseCard course={course} type="student" isEnrolled={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-gray-500 text-lg">You haven’t enrolled in any courses yet.</p>
            <p className="text-blue-600 mt-2">Explore courses and start learning today!</p>
          </div>
        )}
      </div>
    </div>
  );
};
