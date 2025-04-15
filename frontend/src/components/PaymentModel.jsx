import { FaGraduationCap, FaRedo } from 'react-icons/fa';
import { PaymentButton } from './mini/PaymentButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PaymentComponent({ course, setIsEnrolled }) {
  const instructorInitial = course?.instructor_name?.charAt(0).toUpperCase() || 'U';

  const [enrollmentCount, setEnrollmentCount] = useState(0);
  
  const getCourseStatusData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/course/getCourseStatus?course_id=${course._id}`, {
        withCredentials: true,
      });
      setEnrollmentCount(res?.data?.data || 0);
    } catch (error) {
      console.error("Error fetching enrollment count:", error.message);
    }
  };

  // Format the last updated date if available
  const formattedLastUpdated = course?.lastUpdated
    ? new Date(course.lastUpdated).toDateString()
    : 'N/A';

  useEffect(() => {
    getCourseStatusData()
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Course Info */}
      <h2 className="text-lg font-bold mb-2">{course?.course_name || 'Untitled Course'}</h2>
      <p className="text-gray-600 text-sm mb-4">
        Unlock the full course and start learning today!
      </p>

      {/* Price Section */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-600">Price</p>
        <p className="text-xl font-semibold text-blue-600">
          {course?.price && course.price > 0 ? `₹${course.price}` : 'Free'}
        </p>
      </div>

      {/* Payment Button */}
      <PaymentButton setIsEnrolled={setIsEnrolled} />

      {/* Course Details */}
      <div className="mt-4 text-gray-700 text-sm space-y-2">
        <p className="flex items-center gap-2">
          <FaGraduationCap /> <span>{enrollmentCount} Total Enrolled</span>
        </p>
        <p className="flex items-center gap-2">
          <FaRedo /> <span>Last Updated {formattedLastUpdated}</span>
        </p>
      </div>

      {/* Instructor Info */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-600">A course by</p>
        <div className="flex items-center gap-3 mt-2">
          <Link to={`/profile/${course.instructor_id}`}>
          {
              course.instructor_profile ? <>
                <img src={course.instructor_profile} className="w-16"/>
              </> 
              : 
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
              {course?.instructor_name?.[0] || "?"}
            </div>
            }
          </Link>
          <p className="font-semibold">{course?.instructor_name || 'Unknown Instructor'}</p>
        </div>
      </div>
    </div>
  );
}
