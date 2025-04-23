import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import { AdminContext } from "../../../context/AdminContext";
import { toast } from "react-toastify";

export default function AdminExams() {
  const [exams, setExams] = useState([]);

  const { getTokenFromLocal } = useContext(AdminContext);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/getExams", { 
        headers : {
          Authorization : `Bearer ${getTokenFromLocal()}`
        },
        withCredentials: true
       });
       
      console.log(res);
      setExams(res.data.exams);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCall = async (exam_id) => {

    try
    {
      const res = await axios.get(`http://localhost:8080/api/admin/deleteExam/${exam_id}`, {
        headers : {
          Authorization : `Bearer ${getTokenFromLocal()}`
        },
        withCredentials: true
      });

      if(res.data.success) {  

        let tempExams = exams.filter((exam) => {
          return exam_id != exam._id
        });
  
        setExams(tempExams);  

        toast.success("exam deleted");
      }
    }
    catch(error)
    {
      toast.error(error.message || "something went wrong");
    } 
  }

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📝 Exams Management</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Instructor</th>
              <th className="p-4">Start Time</th>
              <th className="p-4">Duration (min)</th>
              <th className="p-4">Total Questions</th>
              <th className="p-4">Passing Marks</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {exams && exams.length > 0 ? exams.map((exam) => (
              <tr key={exam._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-semibold text-gray-800">{exam.exam_name}</td>
                <td className="p-4">{exam.exam_description}</td>
                <td className="p-4">{exam.user_id?.full_name || ""}</td>
                <td className="p-4">{new Date(exam.exam_start_time).toLocaleString()}</td>
                <td className="p-4 text-center">{exam.exam_duration}</td>
                <td className="p-4 text-center">{exam.total_questions}</td>
                <td className="p-4 text-center">{exam.passing_marks}</td>
                <td className="p-4">{new Date(exam.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-center space-x-2">
                  <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDeleteCall(exam._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="text-center p-6 text-gray-500">No exams found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
