import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ExamCertificate } from '../components/ExamCertificate';

export const ExamResultPage = () => {
  const [examResultObj, setExamResultObj] = useState(null);
  const [results, setResults] = useState([]);
  const { examId } = useParams();

  useEffect(() => {
    const fetchExamResult = async () => {
      try {
        const res = await axios.post(
          'http://localhost:8080/api/exam/get-exam-result',
          { exam_id: examId },
          { withCredentials: true }
        );

        console.log('Exam Result:', res.data);

        setExamResultObj(res.data.examResultObj);
        setResults(res.data.results || []);
      } catch (err) {
        console.error('Failed to fetch exam result:', err);
      }
    };

    if (examId) {
      fetchExamResult();
    }
  }, [examId]);

  if (!examResultObj) return <div className='text-2xl p-2 font-bold'>User doesn't given Exam</div>;

  const {
    score,
    correct_answers,
    total_answers,
    percentage,
    exam_id,
    user_id
  } = examResultObj;

  return (

    <ExamCertificate examResultObj={examResultObj}/>
  );
};
