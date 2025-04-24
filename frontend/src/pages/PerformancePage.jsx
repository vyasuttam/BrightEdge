import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export const PerformancePage = () => {
  const { examId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/exam/get-exam-submissions/${examId}`,
          { withCredentials: true }
        );
        console.log("Submissions Data:", res.data);
        setSubmissions(res.data.submissionInfo); // assuming response contains `submissions` array
      } catch (err) {
        console.error("Failed to fetch submissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Exam Submissions</h1>

        {loading ? (
          <p>Loading...</p>
        ) : submissions && submissions.length === 0 ? (
          <p>No submissions yet for this exam.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Correct Answers</th>
                  <th className="px-4 py-2 text-left">Total Answers</th>
                  <th className="px-4 py-2 text-left">Score</th>
                  <th className="px-4 py-2 text-left">Submitted At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td className="px-4 py-2">
                      {submission.user_id?.name || submission.user_id?.email || "N/A"}
                    </td>
                    <td className="px-4 py-2">{submission.correct_answers}</td>
                    <td className="px-4 py-2">{submission.total_answers}</td>
                    <td className="px-4 py-2">{submission.score}</td>
                    <td className="px-4 py-2">
                      {new Date(submission.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
