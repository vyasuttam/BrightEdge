import { FaGraduationCap, FaClock, FaRedo } from "react-icons/fa";

export default function CourseProgress() {
  const progress = 4; // Percentage complete
  const totalLessons = 23;
  const completedLessons = Math.round((progress / 100) * totalLessons);

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Course Progress */}
      <h2 className="text-lg font-bold mb-2">Course Progress</h2>
      <p className="text-gray-600 text-sm">{completedLessons} / {totalLessons} <span className="float-right">{progress}% Complete</span></p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Buttons */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
        Continue Learning
      </button>
      <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg mt-2 hover:bg-blue-50 transition">
        Complete Course
      </button>

      {/* Enrollment Info */}
      <p className="text-gray-600 text-sm mt-3">
        📅 You enrolled in this course on <span className="text-green-600 font-semibold">January 14, 2023</span>
      </p>

      {/* Course Details */}
      <div className="mt-4 text-gray-700 text-sm space-y-2">
        <p className="flex items-center gap-2"><FaGraduationCap /> <span>Expert</span></p>
        <p className="flex items-center gap-2"><FaGraduationCap /> <span>2 Total Enrolled</span></p>
        <p className="flex items-center gap-2"><FaClock /> <span>4 hours Duration</span></p>
        <p className="flex items-center gap-2"><FaRedo /> <span>January 13, 2023 Last Updated</span></p>
      </div>

      {/* Instructor Info */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-600">A course by</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
            F
          </div>
          <p className="font-semibold">fehemmmedia</p>
        </div>
      </div>
    </div>
  );
}
