import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ExamQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [examDuration, setExamDuration] = useState(0); // in minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(new Map());
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [submitted, setSubmitted] = useState(false);

  const { examId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await axios.post(
          'http://localhost:8080/api/exam/get-questions',
          { exam_id: examId },
          { withCredentials: true }
        );
  
        console.log('Exam Data:', res.data);
  
        setQuestions(res.data.questions);
        setExamDuration(res.data.examObj.exam_duration);
  
        const examStart = new Date(res.data.examObj.exam_start_time);
        const now = new Date();
        const elapsedMs = now - examStart;
  
        const totalDurationMs = res.data.examObj.exam_duration * 60 * 1000;
        const remainingMs = totalDurationMs - elapsedMs;
  
        const remainingSeconds = Math.max(Math.floor(remainingMs / 1000), 0);
        setTimeLeft(remainingSeconds);

      } catch (err) {
        console.error('Failed to fetch exam data:', err);
      }
    };
  
    fetchExamData();
  }, [examId]);
  

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!submitted) handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleOptionSelect = (questionId, selectedOption) => {
    setSelectedOptions(prev => new Map(prev.set(questionId, selectedOption)));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const answersObject = Object.fromEntries(selectedOptions);

    console.log('Answers Object:', answersObject);

    try {

      const res = await axios.post("http://localhost:8080/api/exam/submit-exam", {
        exam_id: examId,
        answers: answersObject,
      }, { withCredentials: true });

      console.log('Submission Response:', res);

      navigate(`/exams/${examId}/examResult`);

    } catch (error) {

      console.error('Submission Error:', error.response.data.message || error.message);
      toast.error(error.response.data.message || error.message); 
    }

    console.log('Submitted Answers:', answersObject);

    // TODO: send answersObject to backend
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f4f4f4', padding: '20px', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3>Questions</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {questions.map((q, index) => {
              const isCurrent = currentQuestionIndex === index;
              const isAnswered = selectedOptions.has(q._id);

              return (
                <button
                  key={index}
                  onClick={() => handleJumpToQuestion(index)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    backgroundColor: isCurrent
                      ? '#007bff'
                      : isAnswered
                      ? '#c3e6cb'
                      : '#fff',
                    color: isCurrent ? '#fff' : '#000',
                    border: '1px solid #ccc',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button at the bottom */}
        {!submitted && (
          <div style={{ marginTop: '30px' }}>
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '12px 0',
                backgroundColor: 'green',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        {currentQuestion && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Question {currentQuestionIndex + 1}</h2>
              <div style={{ fontSize: '18px', color: timeLeft < 60 ? 'red' : 'black' }}>
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>

            <p style={{ fontSize: '18px' }}>{currentQuestion.question}</p>

            <div style={{ marginBottom: '30px' }}>
              {currentQuestion.options.map((opt, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '16px' }}>
                    <input
                      type="radio"
                      name={currentQuestion._id}
                      value={opt}
                      checked={selectedOptions.get(currentQuestion._id) === opt}
                      onChange={() => handleOptionSelect(currentQuestion._id, opt)}
                      style={{ marginRight: '8px' }}
                      disabled={submitted}
                    />
                    {opt}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        {!submitted && (
          <div>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              style={{
                marginLeft: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* After Submission */}
        {submitted && (
          <div style={{ marginTop: '30px' }}>
            <h3>✅ Exam Submitted</h3>
            <pre style={{ background: '#f8f9fa', padding: '15px' }}>
              {JSON.stringify(Object.fromEntries(selectedOptions), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
