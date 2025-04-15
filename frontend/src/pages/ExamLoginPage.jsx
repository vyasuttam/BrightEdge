import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export const ExamLoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exam, setExam] = useState(null);
  const [status, setStatus] = useState('pending');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const { examId } = useParams();
  const navigate = useNavigate();

  const getStatus = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    if (now < start - 2 * 60 * 1000) return 'pending';
    if (now >= start - 2 * 60 * 1000 && now < start) return 'login';
    if (now >= start && now <= end) return 'started';
    return 'completed';
  };

  const fetchExam = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/exam/get-exam/${examId}`, {
        withCredentials: true,
      });
      setExam(response.data.examObj);
    } catch (err) {
      console.error('Failed to fetch exam:', err);
    }
  };

  useEffect(() => {
    fetchExam();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (exam) {
        const newStatus = getStatus(exam.exam_start_time, exam.exam_duration);
        setStatus(newStatus);

        if (newStatus === 'login') {
          const now = new Date();
          const start = new Date(exam.exam_start_time);
          const diffSeconds = Math.max(0, Math.floor((start - now) / 1000));
          setRemainingTime(diffSeconds);
        } else {
          setRemainingTime(0);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/exam/get-enrolled-exam-login`,
        {
          exam_id: examId,
          examUsername: userId,
          examPassword: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsLoggedIn(true);
        setError('');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error');
    }
  };

  const handleStartExam = () => {
    navigate(`/exams/${examId}/examQuestions`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Login to "{exam?.exam_name}"</h1>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        </form>
      ) : (
        <>
          {status === 'started' && (
            <button
              onClick={handleStartExam}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded text-lg"
            >
              Start Exam
            </button>
          )}

          {status === 'login' && (
            <div className="mt-6 text-lg text-yellow-600 font-medium flex flex-col items-center">
              <p>You are logged in! Exam starting in:</p>
              <div className="text-3xl font-bold mt-2">{formatTime(remainingTime)}</div>
              <button
                onClick={handleStartExam}
                disabled={remainingTime > 0}
                className={`mt-4 px-6 py-3 rounded text-lg ${
                  remainingTime > 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-green-600 text-white'
                }`}
              >
                Start Exam
              </button>
            </div>
          )}

          {status === 'pending' && (
            <div className="mt-6 text-gray-600">You’re too early — please come back closer to the exam time.</div>
          )}

          {status === 'completed' && (
            <div className="mt-6 text-red-600">The exam is already over.</div>
          )}
        </>
      )}
    </div>
  );
};
