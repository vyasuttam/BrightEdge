import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export const CourseEnrollmentInfoPage = () => {
  const { course_id } = useParams();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/instructor/getCourseEnrollments?course_id=${course_id}`, {
        withCredentials: true,
      });
      setEnrollments(res.data.enrolledUsers);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch enrollment data.");
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [course_id]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">📋 Enrolled Students</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Joined On</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.length > 0 ? (
              enrollments.map((student) => (
                <tr key={student._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-semibold text-gray-800">{student.full_name}</td>
                  <td className="p-4">{student.email}</td>
                  <td className="p-4">{new Date(student.joined_on).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">No enrollments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
