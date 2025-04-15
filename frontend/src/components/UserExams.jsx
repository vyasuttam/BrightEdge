// UserExams.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExamCard } from '../components/ExamCard';
import { MdAssignment } from 'react-icons/md';

export const UserExams = () => {
  const [exams, setExams] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/exam/get-enrolled-exam', {
          withCredentials: true,
        });
        const tempExams = response.data.enrolledExams.map((exam) => exam.exam_id);
        setExams(tempExams || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExams();
    const interval = setInterval(fetchExams, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatus = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    if (now < start - 2 * 60 * 1000) return 'pending';
    if (now >= start - 2 * 60 * 1000 && now < start) return 'login';
    if (now >= start && now <= end) return 'started';
    return 'completed';
  };

  const filteredExams = exams
    .map((exam) => {
      const status = getStatus(exam.exam_start_time, exam.exam_duration);
      return { ...exam, computedStatus: status };
    })
    .filter((exam) => {
      if (activeTab === 'upcoming') {
        return exam.computedStatus !== 'completed';
      } else {
        return exam.computedStatus === 'completed';
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <MdAssignment className="text-4xl text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Enrolled Exams</h1>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 rounded-l-full font-medium ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Ongoing / Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2 rounded-r-full font-medium ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Completed
          </button>
        </div>

        {filteredExams.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-10">No exams to show in this tab.</p>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam._id}
                user={exam.user_id}
                exam={exam}
                status={exam.computedStatus}
                formatDateTime={formatDateTime}
                location="dashboard"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
