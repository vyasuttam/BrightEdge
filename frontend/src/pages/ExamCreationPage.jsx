import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const ExamCreationPage = () => {
  const [formData, setFormData] = useState({
    exam_name: "",
    exam_description: "",
    exam_start_time: "",
    exam_duration: "",
    total_questions: "",
    passing_marks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    try {
        
        const response = await axios.post('http://localhost:8080/api/exam/create-exam', formData, {
          withCredentials: true
        });

        console.log(response.data);
        
        toast.success("Exam Created Successfully");

    } catch (error) {
        toast.warning(error.message);
    }

    // Send formData to backend here
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Exam</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium text-gray-700 mb-1">Exam Name</label>
            <input
              type="text"
              name="exam_name"
              value={formData.exam_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg w-full transition"
            >
              Create Exam
            </button>
            <Link to="/dashboard">
                <button className="border border-gray-300 font-semibold px-6 py-2 rounded-lg w-full transition">
                    Cancle
                </button>
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};
