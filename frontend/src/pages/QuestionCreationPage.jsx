import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const QuestionCreationPage = () => {
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
  });

  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(null);

  const { examId } = useParams();
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { question, options, answer } = questionData;
  
    if (!examId) {
      toast.error("Exam ID is invalid.");
      return;
    }
  
    if (!question || !answer || options.some(opt => !opt)) {
      toast.error("Please fill out all fields.");
      return;
    }
  
    // Check for duplicate options
    const uniqueOptions = new Set(options.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== options.length) {
      toast.error("Options must be unique.");
      return;
    }
  
    // Check if answer matches one of the options (case-insensitive)
    const normalizedAnswer = answer.trim().toLowerCase();
    if (!uniqueOptions.has(normalizedAnswer)) {
      toast.error("Correct answer must exactly match one of the options.");
      return;
    }
  
    try {
      if (isEditing !== null) {
        await axios.put(
          `http://localhost:8080/api/exam/update-exam-question`,
          { question_id: isEditing, question, options, answer },
          { withCredentials: true }
        );
        toast.success("Question updated successfully!");
      } else {
        await axios.post(
          'http://localhost:8080/api/exam/add-question',
          { ...questionData, exam_id: examId },
          { withCredentials: true }
        );
        toast.success("Question added successfully!");
      }
  
      fetchQuestions();
      setQuestionData({ question: '', options: ['', '', '', ''], answer: '' });
      setIsEditing(null);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while submitting the question.");
    }
  };
  

  const fetchQuestions = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/exam/get-questions`,
        { exam_id: examId },
        { withCredentials: true }
      );
      setQuestions(response.data.questions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load questions.");
    }
  };

  const handleEdit = (q) => {
    setQuestionData({
      question: q.question,
      options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
      answer: q.answer,
    });
    setIsEditing(q._id);
  };

  const handleDelete = async (id) => {

    try {
      await axios.get(`http://localhost:8080/api/exam/deleteQuestion/${id}`, {
        withCredentials : true
      });
      toast.success("Question deleted.");
      fetchQuestions();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting question.");
    }
  };

  useEffect(() => {
    if (examId) fetchQuestions();
  }, [examId]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gray-100 relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 right-14 flex items-center gap-2 text-blue-600 font-semibold hover:underline"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">{isEditing !== null ? "Edit Question" : "Create Question"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Question</label>
            <textarea
              className="w-full border rounded p-2 mt-1"
              rows="3"
              value={questionData.question}
              onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })}
              required
            />
          </div>

          {questionData.options.map((opt, idx) => (
            <div key={idx}>
              <label className="block font-medium">Option {idx + 1}</label>
              <input
                type="text"
                className="w-full border rounded p-2 mt-1"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                required
              />
            </div>
          ))}

          <div>
            <label className="block font-medium">Correct Answer</label>
            <input
              type="text"
              className="w-full border rounded p-2 mt-1"
              value={questionData.answer}
              onChange={(e) => setQuestionData({ ...questionData, answer: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isEditing !== null ? "Update Question" : "Add Question"}
          </button>
        </form>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow-md overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Created Questions</h2>
        {questions && questions.length === 0 ? (
          <p className="text-gray-500">No questions created yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions && questions.map((q, index) => (
              <li key={q._id} className="border p-4 rounded relative group hover:bg-gray-50">
                <div className="font-medium">{index + 1}. {q.question}</div>
                <ul className="pl-4 list-disc text-sm text-gray-600 mt-1">
                  {q.options.map((opt, idx) => {
                    const isCorrect = opt.trim().toLowerCase() === q.answer.trim().toLowerCase();
                    return (
                      <li
                        key={idx}
                        className={`text-sm mt-1 ${isCorrect ? "font-bold text-green-700" : "text-gray-600"}`}
                      >
                        {opt} {isCorrect && "✅"}
                      </li>
                    );
                  })}
                </ul>
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(q)} className="text-blue-500 hover:text-blue-700">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(q._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
