import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AdminContext } from "../../../context/AdminContext";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("student");

  const { getTokenFromLocal } = useContext(AdminContext);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/getUsers", { 
        headers : {
          Authorization : `Bearer ${getTokenFromLocal()}`
        },
        withCredentials: true
       });
    
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (user_id) => {

    try
    {
        const res = await axios.get(`http://localhost:8080/api/admin/deleteUser?user_id=${user_id}`, { 
          headers : {
            Authorization : `Bearer ${getTokenFromLocal()}`
          },
          withCredentials: true
         });
        
        toast.success("User deleted successfully");

        let tempUsers = users.filter((user) => {
            return user._id != user_id
        });

        setUsers(tempUsers);
    }
    catch(error)
    {
        toast.error(error.message);
        console.error(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const students = users.filter((user) => user.role === "student");
  const instructors = users.filter((user) => user.role === "instructor");

  const renderStudentTable = (studentList) => (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="p-4">Profile</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentList.length > 0 ? studentList.map((user) => (
            <tr id={user._id} key={user._id} className="border-t hover:bg-gray-50 transition">
              <td className="p-4">
                <img src={user.profile_pic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              </td>
              <td className="p-4 font-semibold text-gray-800">{user.full_name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4 text-center space-x-2">
                <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center p-6 text-gray-500">No students found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderInstructorTable = (instructorList) => (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="p-4">Profile</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Qualification</th>
            <th className="p-4">Identity No.</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructorList.length > 0 ? instructorList.map((user) => (
            <tr key={user._id} className="border-t hover:bg-gray-50 transition">
              <td className="p-4">
                <img src={user.profile_pic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              </td>
              <td className="p-4 font-semibold text-gray-800">{user.full_name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                {
                    user.qualification_doc ? (<Link to={user.qualification_doc} target={ user.qualification_doc ? "_blank" : "" }>
                        <button className="bg-blue-500 text-white p-2 rounded-lg">View Document</button>
                    </Link>) : (
                        <button className="bg-slate-700 text-white p-2 rounded-lg">No Document</button>
                    )
                }
              </td>
              <td className="p-4">{user.identityNumber}</td>
              <td className="p-4 text-center space-x-2">
                <button onClick={() => handleDelete(user._id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="text-center p-6 text-gray-500">No instructors found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 User Management</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("student")}
          className={`px-6 py-2 rounded-lg font-medium ${activeTab === "student" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"}`}
        >
          Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("instructor")}
          className={`px-6 py-2 rounded-lg font-medium ${activeTab === "instructor" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"}`}
        >
          Instructors ({instructors.length})
        </button>
      </div>

      {/* Tables */}
      {activeTab === "student" && renderStudentTable(students)}
      {activeTab === "instructor" && renderInstructorTable(instructors)}
    </div>
  );
}
