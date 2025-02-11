import React, { useState } from "react";
import { Dashboard } from "../components/Dashboard.jsx";
import { EnrolledCourse } from "../components/EnrolledCourse.jsx";
import { MyProfile } from "../components/MyProfile.jsx";
import { OrderHistory } from "../components/OrderHistory.jsx";

const DashboardPage = () => {

    const [option, setOption] = useState("dashboard");

  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <ul className="space-y-3">
            <li 
                className={`p-2 rounded cursor-pointer ${option === "dashboard" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                onClick={() => setOption("dashboard")}>Dashboard</li>
            <li 
                className={`p-2 rounded cursor-pointer ${option === "myprofile" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                onClick={() => setOption("myprofile")}>My Profile</li>
            <li 
                className={`p-2 rounded cursor-pointer ${option === "enrolled_courses" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                onClick={() => setOption("enrolled_courses")}>Enrolled Courses</li>
            <li 
                className={`p-2 rounded cursor-pointer ${option === "order_history" ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                onClick={() => setOption("order_history")}>Order History</li>
          <li className="mt-4 font-bold">Instructor</li>
          <li className="p-2 hover:bg-gray-200 rounded">My Courses</li>
        </ul>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div>
            {
                option == "dashboard" && <Dashboard />
            }
            {
                option == "myprofile" && <MyProfile />
            }
            {
                option == "enrolled_courses" && <EnrolledCourse />
            }
            {
                option == "order_history" && <OrderHistory />
            }
        </div>

        {/* Stats Grid */}

      </main>
    </div>
  );
};

export default DashboardPage;


{/* <div className="grid grid-cols-3 gap-6">
{[
  { label: "Enrolled Courses", count: 1, icon: "📖" },
  { label: "Active Courses", count: 1, icon: "🎓" },
  { label: "Completed Courses", count: 0, icon: "🏆" },
  { label: "Total Students", count: 2, icon: "👨‍🎓" },
  { label: "Total Courses", count: 11, icon: "📦" },
  { label: "Total Earnings", count: "$0.00", icon: "💰" }
].map((item, index) => (
  <div key={index} className="bg-white p-6 rounded-lg shadow-lg flex items-center">
    <span className="text-3xl mr-4">{item.icon}</span>
    <div>
      <p className="text-2xl font-bold">{item.count}</p>
      <p className="text-gray-600">{item.label}</p>
    </div>
  </div>
))}
</div> */}