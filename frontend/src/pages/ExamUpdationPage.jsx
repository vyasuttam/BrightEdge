import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const ExamUpdatePage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    exam_name: "",
    exam_description: "",
    exam_start_time: "",
    exam_duration: "",
    total_questions: "",
    passing_marks: "",
  });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/exam/get-exam/${examId}`,
          { withCredentials: true }
        );

        console.log("Exam Data:", res);

        const exam = res.data.examObj;

        const date = new Date(exam.exam_start_time);
        const offset = date.getTimezoneOffset(); // in minutes
        const localDate = new Date(date.getTime() - offset * 60 * 1000); // convert to local time
        
        const formattedDateTime = localDate.toISOString().slice(0, 16); // ✅ Local time format for input        

        setFormData({
          exam_name: exam.exam_name,
          exam_description: exam.exam_description,
          exam_start_time: formattedDateTime,
          exam_duration: exam.exam_duration,
          total_questions: exam.total_questions,
          passing_marks: exam.passing_marks,
        });
      } catch (err) {
        toast.error("Failed to fetch exam data");
        console.error(err);
      }
    };

    fetchExam();
  }, [examId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(name, value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8080/api/exam/update-exam/${examId}`,
        formData,
        { withCredentials: true }
      );

      console.log(response);
      toast.success("Exam updated successfully");
    //   navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to update exam");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Exam</h2>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Exam Name</label>
            <input
              type="text"
              name="exam_name"
              value={formData.exam_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Exam Description</label>
            <textarea
              name="exam_description"
              value={formData.exam_description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="exam_start_time"
              value={formData.exam_start_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="exam_duration"
                value={formData.exam_duration}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Total Questions</label>
              <input
                type="number"
                name="total_questions"
                value={formData.total_questions}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Passing Marks</label>
            <input
              type="number"
              name="passing_marks"
              value={formData.passing_marks}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg w-full transition"
            >
              Update Exam
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 font-semibold px-6 py-2 rounded-lg w-full transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
