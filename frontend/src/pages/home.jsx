import React, { useState, useEffect, useContext } from 'react'
import { Banner } from '../components/Banner'
import Footer from '../components/Footer'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Courses } from '../components/Courses';
import CourseCard from '../components/mini/CourseCard';

export const Home = () => {

  const [courses, setCourses] = useState([]);

  const { user } = useContext(AuthContext);

  const getCourses = async () => {

    try {

      const res = await axios.post('http://localhost:8080/api/course/getCourses', {
        search_query : ""
      });

      console.log(res);

      setCourses(res.data.data);

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="home">
      <Banner />
      <div className="text-center mt-16">
        <h1 className="text-4xl font-bold text-gray-900">✨ Featured Courses</h1>
        <p className="text-lg mt-4 text-gray-600 max-w-2xl mx-auto">
          Learning often happens in classrooms but it doesn’t have to. Use BrightEdge to facilitate learning experiences no matter the context.
        </p>
      </div>
      <div>
        {
          user && <Courses />
        }
        {
          !user && <div className="mt-16 w-full flex justify-center">
              <div className="flex justify-center flex-wrap gap-6 w-11/12 max-w-7xl">
                {courses && courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    type="student"
                    isLoggedIn={false}
                    isEnrolled={course.isEnrolled}
                  />
                ))}
              </div>
            </div>
        }

      </div>
      <Footer />
    </div>
  )
}
