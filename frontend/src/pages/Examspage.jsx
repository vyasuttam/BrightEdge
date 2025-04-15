import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExamCard } from '../components/ExamCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Examspage = () => {
  const [exams, setExams] = useState([]);
  const [enrolledExamIds, setEnrolledExamIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, enrolledRes] = await Promise.all([
          axios.get('http://localhost:8080/api/exam/get-exams', { withCredentials: true }),
          axios.get('http://localhost:8080/api/exam/get-enrolled-exam', { withCredentials: true }),
        ]);

        setExams(examsRes.data.exams);
        console.log(examsRes);
        console.log(enrolledRes);
        const tempEnrolled = enrolledRes.data.enrolledExams.map(e => e.exam_id);
        setEnrolledExamIds(new Set(tempEnrolled.map(e => e._id)));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
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
    if (now < start) return 'pending';
    if (now >= start && now <= end) return 'started';
    return 'completed';
  };

  const handleEnroll = async (examId) => {
    try {
      await axios.post(
        'http://localhost:8080/api/exam/enroll-exam',
        { exam_id: examId },
        { withCredentials: true }
      );
      setEnrolledExamIds((prev) => new Set(prev).add(examId));
      toast.success("Enrolled Success! Mail is sent to your inbox");
    } catch (err) {
      console.error('Enrollment failed', err);
    }
  };

  const filteredExams = exams.filter((exam) => {
    const status = getStatus(exam.exam_start_time, exam.exam_duration);
    const matchesTab =
      (activeTab === 'upcoming' && status === 'pending') ||
      (activeTab === 'completed' && status === 'completed');

    const matchesSearch = exam.exam_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex mb-4">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded shadow"
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Available Exams</h1>

        {/* Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search exams..."
              className="border border-gray-300 rounded-md px-3 py-2 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-l-md ${activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-r-md ${activeTab === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Completed
              </button>
            </div>
        </div>

        {/* Exam Cards */}
        {filteredExams.length === 0 ? (
          <p className="text-center text-gray-500">No exams to show in this tab.</p>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const status = getStatus(exam.exam_start_time, exam.exam_duration);
              return (
                <ExamCard
                  key={exam._id}
                  user={exam.user_id}
                  exam={exam}
                  status={status}
                  formatDateTime={formatDateTime}
                  showAction={activeTab === 'upcoming'}
                  isEnrolled={enrolledExamIds.has(exam._id)}
                  handleEnroll={handleEnroll}
                  location="examsPage"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
