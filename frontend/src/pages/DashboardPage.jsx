import React, { useState, useContext, useEffect } from "react";
import { RoleContext } from "../context/RoleContext";
import { Dashboard } from "../components/Dashboard.jsx";
import { EnrolledCourse } from "../components/EnrolledCourse.jsx";
import { MyProfile } from "../components/MyProfile.jsx";
import { UserExams } from "../components/UserExams.jsx";
import { MyCourses } from "../components/MyCourses.jsx";
import { MyExams } from "../components/MyExams.jsx";
import { useNavigate } from "react-router-dom";
import IdentityModal from "../components/mini/IdentityModal.jsx";
import { FaTachometerAlt, FaUser, FaBookOpen, FaClipboardList, FaChalkboardTeacher, FaBook, FaClipboardCheck, FaUserGraduate, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [option, setOption] = useState(localStorage.getItem('lastSelectedTab') || "dashboard");
  const { role } = useContext(RoleContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aadharNumber, setAadharNumber] = useState("");

  const handleLogout = async () => {

    try {
      
      const res = await axios.get("http://localhost:8080/api/user/logout", {
        withCredentials : true
      });

      if(res.data.status == 200) {
        toast.success("logout successfull");
        navigate("/login")
      }

    } catch (error) {
      console.log(error);
      toast.error("error while logging out");
    }

  }

  // Persist last selected tab in localStorage
  useEffect(() => {
    localStorage.setItem('lastSelectedTab', option);
  }, [option]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-700 font-bold text-lg text-white flex px-14">
        <img src="/BrightEdge.png" alt="Logo" className="h-5" />
        </div>
        <ul className="flex-1 p-4 space-y-2">
          <li
            className={`p-3 rounded-lg cursor-pointer ${
              option === "dashboard" ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800"
            }`}
            onClick={() => setOption("dashboard")}
          >
            <FaTachometerAlt className="mr-3 inline-block" /> Dashboard
          </li>

          <li
            className={`p-3 rounded-lg cursor-pointer ${
              option === "myprofile" ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800"
            }`}
            onClick={() => setOption("myprofile")}
          >
            <FaUser className="mr-3 inline-block" /> My Profile
          </li>

          <li
            className={`p-3 rounded-lg cursor-pointer ${
              option === "enrolled_courses" ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800"
            }`}
            onClick={() => setOption("enrolled_courses")}
          >
            <FaBookOpen className="mr-3 inline-block" /> Enrolled Courses
          </li>

          <li
            className={`p-3 rounded-lg cursor-pointer ${
              option === "user_exams" ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800"
            }`}
            onClick={() => setOption("user_exams")}
          >
            <FaClipboardList className="mr-3 inline-block" /> User Exams
          </li>

          <li className="mt-6 text-xs text-gray-500 uppercase tracking-wider">Instructor</li>

          {role === "instructor" ? (
            <>
              <li
                className={`p-3 rounded-lg cursor-pointer ${
                  option === "my_courses" ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800"
                }`}
                onClick={() => setOption("my_courses")}
              >
                <FaChalkboardTeacher className="mr-3 inline-block" /> My Courses
              </li>
              <li
                className={`p-3 rounded-lg cursor-pointer ${
                  option === "my_exams" ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800"
                }`}
                onClick={() => setOption("my_exams")}
              >
                <FaClipboardList className="mr-3 inline-block" /> My Exams
              </li>
            </>
          ) : (
            <>
              <li
                className="p-3 rounded-lg bg-gray-800 text-gray-500 flex items-center gap-2 cursor-not-allowed"
                title="Upgrade to Instructor to access"
              >
                <MdLock size={16} /> My Courses
              </li>
              <li
                className="p-3 rounded-lg bg-gray-800 text-gray-500 flex items-center gap-2 cursor-not-allowed"
                title="Upgrade to Instructor to access"
              >
                <MdLock size={16} /> My Exams
              </li>

              {/* Upgrade button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-4 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
              >
                Upgrade Account
              </button>
            </>
          )}
        </ul>

        {/* Action buttons */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition"
          >
            Home
          </button>

          <button
            onClick={() => handleLogout()}
            className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div>
          {option === "dashboard" && <Dashboard />}
          {option === "myprofile" && <MyProfile />}
          {option === "enrolled_courses" && <EnrolledCourse />}
          {option === "user_exams" && <UserExams />}
          {option === "my_courses" && role === "instructor" && <MyCourses />}
          {option === "my_exams" && role === "instructor" && <MyExams />}
        </div>
      </main>

      {/* Upgrade Modal */}
      {isModalOpen && (
        <IdentityModal
          aadharNumber={aadharNumber}
          setAadharNumber={setAadharNumber}
          setIsOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default DashboardPage;
