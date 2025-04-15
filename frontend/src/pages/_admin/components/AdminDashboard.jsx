import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Users, UserCheck, User2, BookOpen, PenLine } from "lucide-react";
import { AdminContext } from "../../../context/AdminContext";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalExams: 0,
  });

  const { getTokenFromLocal } = useContext(AdminContext);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/stats", { 
        headers : {
          Authorization : `Bearer ${getTokenFromLocal()}`
        },
        withCredentials: true
       });
      console.log(res);
      setStats(res.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <DashboardCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users size={28} />} 
          color="bg-blue-500"
        />
        
        <DashboardCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<User2 size={28} />} 
          color="bg-green-500"
        />
        
        <DashboardCard 
          title="Total Instructors" 
          value={stats.totalInstructors} 
          icon={<UserCheck size={28} />} 
          color="bg-purple-500"
        />
        
        <DashboardCard 
          title="Total Courses" 
          value={stats.totalCourses} 
          icon={<BookOpen size={28} />} 
          color="bg-yellow-500"
        />
        
        <DashboardCard 
          title="Total Exams" 
          value={stats.totalExams} 
          icon={<PenLine size={28} />} 
          color="bg-red-500"
        />

      </div>
    </div>
  );
}

// Reusable Dashboard Card Component
function DashboardCard({ title, value, icon, color }) {
  return (
    <div className={`p-6 rounded-xl text-white shadow-lg flex items-center gap-4 ${color}`}>
      <div className="p-3 bg-white bg-opacity-20 rounded-full">
        {icon}
      </div>
      <div>
        <h2 className="text-lg">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
