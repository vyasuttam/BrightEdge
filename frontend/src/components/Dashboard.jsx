import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { RoleContext } from '../context/RoleContext';
import { FaUserGraduate, FaUsers, FaChalkboardTeacher, FaMoneyBillWave, FaBook, FaClipboardList } from "react-icons/fa";

export const Dashboard = () => {
  const { role } = useContext(RoleContext);
  const [stats, setStats] = useState(null);

  const getCourseStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/get-user-stats", {
        withCredentials: true
      });
      setStats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  useEffect(() => {
    getCourseStats();
  }, []);

  if (!stats) {
    return <p>Loading your dashboard...</p>;
  }

  // Define cards dynamically based on fetched data
  const studentStats = [
    { label: "Enrolled Courses", count: stats.enrolledCourseCount, icon: <FaBook size={28} /> },
    { label: "Enrolled Exams", count: stats.enrolledExamsCount, icon: <FaUserGraduate size={28} /> },
  ];

  const instructorStats = [
    { label: "Conducted Exams", count: stats.totalExamCount, icon: <FaClipboardList size={28} /> },
    { label: "Total Courses", count: stats.totalCourseCount, icon: <FaChalkboardTeacher size={28} /> },
    { label: "Total Earnings", count: `₹${stats.totalEarnings}`, icon: <FaMoneyBillWave size={28} /> },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Stats */}
        {studentStats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <span className="text-3xl mr-4">{item.icon}</span>
            <div>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-gray-600">{item.label}</p>
            </div>
          </div>
        ))}

        {/* If instructor, also show instructor stats */}
        {role === "instructor" && instructorStats.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <span className="text-3xl mr-4">{item.icon}</span>
            <div>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-gray-600">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
