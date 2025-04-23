import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";  // imported icons here
import { toast } from "react-toastify";
import { AdminContext } from "../../../context/AdminContext";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);

  const { getTokenFromLocal } = useContext(AdminContext);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/getCourses", { 
        headers : {
          Authorization : `Bearer ${getTokenFromLocal()}`
        },
        withCredentials: true
      });
      setCourses(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

    const handleDelete = async (course_id) => {
      try {
          const res = await axios.get(`http://localhost:8080/api/admin/deleteCourse?course_id=${course_id}`, {
            headers : {
              Authorization : `Bearer ${getTokenFromLocal()}`
          },
            withCredentials: true
          });

          let tempCourses = courses.filter((course) => {
            return course_id != course._id
          });

          setCourses(tempCourses);

          toast.success("Deleted Succesfully");
        } catch (error) {
          console.error("Error fetching stats:", error.message);
          toast.error("Error in Deletion");
        }
    }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex-1 p-6 min-h-screen overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📚 Courses Management</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white w-full">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="p-4">Thumbnail</th>
              <th className="p-4">Name</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Email</th>
              <th className="p-4">Price</th>
              <th className="p-4">Categories</th>
              <th className="p-4 text-center">Content Count</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length > 0 ? courses.map((course) => (
              <tr key={course._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={course.thumbnail} alt="thumbnail" className="w-20 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-semibold text-gray-800">{course.course_name}</td>
                <td className="p-4">{course.instructor_name}</td>
                <td className="p-4">{course.instructor_email}</td>
                <td className="p-4 font-medium text-green-600">₹{course.price}</td>
                <td className="p-4">{course.categories.join(", ")}</td>
                <td className="p-4 text-center">{course.content_count}</td>
                <td className="p-4">{new Date(course.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-center space-x-2">
                {/*  <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Eye size={16} />
                  </button>
                */}
                  <button onClick={() => handleDelete(course._id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
