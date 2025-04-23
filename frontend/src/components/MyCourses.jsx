import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import CourseCard from './mini/CourseCard';
import { Link } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';

export const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const roleData = useContext(RoleContext);

  const getMyCourses = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/instructor/getInstructorCourses',
        { withCredentials: true }
      );
      setCourses(response.data.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getMyCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">📚 My Courses</h2>
          {roleData.role === 'instructor' && (
            <Link to="/dashboard/course-create">
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                + Create New Course
              </button>
            </Link>
          )}
        </div>

        {courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                type="instructor"
                course={course}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-gray-600 text-lg">You haven’t created any courses yet.</p>
            {roleData.role === 'instructor' && (
              <p className="text-blue-600 mt-2">Start building your first course now!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
