import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/instructor/getInstructorInfo?instructor_id=${userId}`,
        { withCredentials: true }
      );
      setInstructorData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  if (loading) return <div className="text-center p-8 text-lg">Loading instructor profile...</div>;

  if (!instructorData) return <div className="text-center p-8 text-red-600 text-lg">Unable to fetch instructor data.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Section (30%) */}
      <div className="w-full md:w-1/3 bg-white p-6 flex flex-col items-center border-r">
        <button
          onClick={() => navigate(-1)}
          className="self-start mb-8 text-blue-600 hover:underline text-lg"
        >
          ← Back
        </button>

            {
              instructorData.profile_url ? <>
                <img src={instructorData.profile_url} className='w-[250px] h-[250px]'/>
              </> 
              : 
              <div className="w-[250px] h-[250px] rounded-full bg-blue-600 text-white text-9xl flex items-center justify-center font-bold">
                {instructorData.name?.[0] || "?"}
            </div>
            }

        <h2 className="text-2xl font-bold text-center text-gray-800">{instructorData.name}</h2>
      </div>

      {/* Right Section (70%) */}
      <div className="w-full md:w-2/3 p-8 flex flex-col gap-10 mt-8">
        <div>
          <h3 className="text-3xl font-semibold mb-3 text-gray-700">Instructor Details</h3>
          <p className="text-gray-600 font-medium text-lg">{instructorData.email}</p>
        </div>

        <div>
          <h4 className="text-2xl font-semibold text-gray-700 mb-2">Work Experience</h4>
          <p className="text-lg text-gray-800">
            {instructorData.work_experience && instructorData.work_experience.trim() !== ""
              ? instructorData.work_experience
              : "No experience information provided."}
          </p>
        </div>

        <div>
          <h4 className="text-2xl font-semibold text-gray-700 mb-2">Qualification Document</h4>
          <a
            href={instructorData.qualification_doc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-lg hover:underline"
          >
            View Document
          </a>
        </div>
      </div>
    </div>
  );
};
