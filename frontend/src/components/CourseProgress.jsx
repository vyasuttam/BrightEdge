import axios from "axios";
import { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

export default function CourseProgress({ course }) {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [enrollmentDate, setEnrollmentDate] = useState("");

  const { course_id } = useParams();

  console.log(course);

  const getCourseStatusData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/course/getCourseStatus?course_id=${course_id}`, {
        withCredentials: true,
      });
      setEnrollmentCount(res?.data?.data || 0);
    } catch (error) {
      console.error("Error fetching enrollment count:", error.message);
    }
  };

  const getProgress = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/course/getUserProgress",
        { course_id },
        { withCredentials: true }
      );

      const { content_count } = res.data.courseObj || {};
      const progress = res.data.userProgress || [];

      setTotal(content_count || 0);
      setCompleted(progress.length || 0);
      setEnrollmentDate(new Date(res.data.enrolledOn).toDateString());
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  useEffect(() => {
    getProgress();
    getCourseStatusData();
  }, []);

  const progressPercentage = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Course Progress */}
      <h2 className="text-lg font-bold mb-2">Course Progress</h2>
      <p className="text-gray-600 text-sm">
        {completed} / {total}
        <span className="float-right">{progressPercentage}% Complete</span>
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Action Buttons */}
      <Link to="courseContent">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
          Continue Learning
        </button>
      </Link>

      {completed === total && total !== 0 && (
        <Link to="courseCertificate">
          <button className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 hover:bg-green-700 transition">
            Get Certificate
          </button>
        </Link>
      )}

      {/* Enrollment Info */}
      <p className="text-gray-600 text-sm mt-3">
        📅 You enrolled in this course on{" "}
        <span className="text-green-600 font-semibold">{enrollmentDate}</span>
      </p>

      {/* Course Stats */}
      <div className="mt-4 text-gray-700 text-sm space-y-2">
        <p className="flex items-center gap-2">
          <FaGraduationCap /> <span>{enrollmentCount} Total Enrolled</span>
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
          <p className="font-semibold">{course?.instructor_name || "Instructor"}</p>
        </div>
      </div>
    </div>
  );
}
