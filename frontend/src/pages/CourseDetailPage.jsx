import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CourseProgress from '../components/CourseProgress';
import CourseContent from '../components/CourseContent';
import PaymentComponent from '../components/PaymentModel';

export const CourseDetailPage = () => {
  const [courseData, setCourseData] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { course_id } = useParams();
  const [categories, setCategories] = useState("");

  const getCourseData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/course/getCourseData?course_id=${course_id}`, {
        withCredentials: true,
      });

      const data = response.data.data[0];

      console.log(response);

      setCourseData(data);
      setIsEnrolled(data.isEnrolled);
      setCategories(data.categories.join(", "));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col lg:flex-row gap-10 transition-all duration-300">
        
        {/* Left: Course Details */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">
              {courseData.course_name || "Course Title"}
            </h1>
            <p className="text-sm text-gray-500 font-medium">Categories: {categories}</p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-md">
            <ReactPlayer
              url={courseData.introductry_video || "https://youtu.be/bSDprg24pEA?si=khrGR5AtdfkHOUgd"}
              width="100%"
              height="400px"
              controls
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Course Info</h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {courseData.course_description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Course Content</h2>
            <CourseContent courseData={courseData} />
          </div>
        </div>

        {/* Right: Enrollment or Progress */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md sticky top-10">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : isEnrolled ? (
              <CourseProgress course={courseData} />
            ) : (
              <PaymentComponent course={courseData} setIsEnrolled={setIsEnrolled} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
