import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Edit, Trash2, BarChart2 } from 'lucide-react';

export const InstructorExamCard = ({ exam, currentUserId, onDelete }) => {
  const {
    _id,
    exam_name,
    exam_description,
    exam_start_time,
    exam_duration,
    total_questions,
    passing_marks,
    user_id,
  } = exam;

  const isCreator = currentUserId === user_id;

  const getStatus = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    if (now < start) return 'pending';
    if (now >= start && now <= end) return 'started';
    return 'completed';
  };

  const status = getStatus(exam_start_time, exam_duration);

  return (
    <div className="relative bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300 border border-gray-100">

      {isCreator && (
        <button
          onClick={() => onDelete(_id)}
          className="absolute top-3 right-3 text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-2 py-1 rounded transition"
          title="Delete Exam"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="mb-2">
        <h2 className="text-xl font-semibold text-blue-600">{exam_name}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exam_description}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{new Date(exam_start_time).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{exam_duration} mins</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t mt-3 text-gray-600">
          <span>Questions: <strong>{total_questions}</strong></span>
          <span>Pass Marks: <strong>{passing_marks}</strong></span>
        </div>
      </div>

      {isCreator && (
        <div className="mt-4 flex flex-wrap gap-2">
          {
            status === 'completed' ? (<>

              <Link to={`/exams/${_id}/performance`}>
                <button className="flex items-center gap-2 text-green-600 hover:text-white hover:bg-green-600 border border-green-600 px-3 py-1 rounded transition">
                  <BarChart2 size={16} />
                  Show Performance
                </button>
              </Link>

            </>) : (<>

              <Link to={`/exams/${_id}/examUpdation`}>
                <button className="flex items-center gap-2 text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500 px-3 py-1 rounded transition">
                  <Edit size={16} />
                  Edit Exam
                </button>
              </Link>

              <Link to={`/exams/${_id}/manage-questions`}>
                <button className="flex items-center gap-2 text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500 px-3 py-1 rounded transition">
                  <Edit size={16} />
                  Manage Questions
                </button>
              </Link>

            </>)
          }
        </div>
      )}
    </div>
  );
};
