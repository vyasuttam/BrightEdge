import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function CourseCard({
  course = {},
  type,
  isEnrolled = false,
  isLoggedIn = true,
  onDelete = () => {},
}) {
  const [latestEnrolled, setLatestEnrolled] = useState(isEnrolled);

  
  console.log(course);
  console.log(course.instructor_name, course.instructor_id.full_name);

  const handleDelete = async (courseId) => {

    try {
      
      const res = await axios.get(`http://localhost:8080/api/instructor/deleteCourse?course_id=${courseId}`, {
        withCredentials : true
      });

      toast.success("course deleted successfully");

    } catch (error) {
      console.log(error);
      toast.error("error while deleting! please try again");
    }

  };

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] relative">
      
      {/* Edit/Delete Buttons (Instructor Only) */}
      {type === "instructor" && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <Link to={`/courses/${course._id}/updateCourse`}>
            <button
              className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:text-indigo-600 hover:shadow-md transition"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
          </Link>
          <button
            onClick={() => handleDelete(course._id)}
            className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:text-red-600 hover:shadow-md transition"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail || "https://via.placeholder.com/300"}
          alt="Course Thumbnail"
          className="w-full h-48 object-cover"
        />
        <div
          className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm shadow 
            ${
              course.price === 0
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {course.price === 0 ? "🆓 Free" : `₹${course.price}`}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 hover:text-indigo-600 transition">
          {course.course_name}
        </h2>

        <p className="text-sm text-gray-600">
          By{" "}
          <span className="font-medium text-gray-800">
            {course.instructor_id.full_name || course.instructor_name || "" }
          </span>
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {course.categories?.length ? (
            course.categories.map((category, idx) => (
              <span
                key={idx}
                className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium"
              >
                {category}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No categories</span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col gap-2">
          {isLoggedIn ? (
            <>
              <Link to={`/courses/${course._id}`}>
                <button
                  className={`w-full py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 ${
                    latestEnrolled
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                      : type === "instructor"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white"
                  }`}
                >
                  {latestEnrolled
                    ? "Continue Learning"
                    : type === "instructor"
                    ? "Review Course"
                    : "Enroll Now"}
                </button>
              </Link>

              {type === "instructor" && (
                <Link to={`/courses/${course._id}/enrollments`}>
                  <button
                    className="w-full py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Show Enrollments
                  </button>
                </Link>
              )}
            </>
          ) : (
            <Link to="/login">
              <button
                className="w-full py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Enroll Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
