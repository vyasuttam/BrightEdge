import React, { useContext, useEffect, useState } from 'react';
import { RoleContext } from '../context/RoleContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { InstructorExamCard } from './mini/InstructorExamCard';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const MyExams = () => {
  const { role } = useContext(RoleContext);
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);

  const getExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/exam/get-my-exams`,
        { withCredentials: true }
      );
      setExams(response.data.exams);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  const onDelete = async (examId) => {
    try {
      await axios.get(
        `http://localhost:8080/api/exam/delete-exam/${examId}`,
        { withCredentials: true }
      );
      toast.success("Exam deleted successfully");
      setExams((prev) => prev.filter((exam) => exam._id !== examId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete exam");
      console.error("Failed to delete exam:", error);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">📝 My Exams</h2>
          {role === "instructor" && (
            <Link to="/exams/exam-create">
              <button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition">
                + Conduct New Exam
              </button>
            </Link>
          )}
        </div>

        {exams.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <InstructorExamCard
                key={exam._id}
                exam={exam}
                currentUserId={user?._id}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-600">
            <p className="text-lg">No exams found.</p>
            {role === "instructor" && (
              <p className="text-blue-600 mt-2">
                Start by conducting your first exam today!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
