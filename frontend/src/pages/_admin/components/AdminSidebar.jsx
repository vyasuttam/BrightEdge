import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Book, PenLine, Users, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../../context/AdminContext";
import { useContext } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { getTokenFromLocal } = useContext(AdminContext);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Courses", path: "/admin/courses", icon: <Book size={20} /> },
    { name: "Exams", path: "/admin/exams", icon: <PenLine size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
  ];

  const handleLogout = async () => {
    // try {
    //   const res = await axios.get("http://localhost:8080/api/admin/logout", {
    //     headers : {
    //       Authorization : `Bearer ${getTokenFromLocal()}`
    //     },
    //     withCredentials : true
    //   });
      
    //   if(res.data.status == 200) {

    //   }
    //   else {
    //     toast.error("Admin logout failed");
    //   }
    // } catch (error) {
    //   console.error("Logout failed:", error);
    //   toast.error(error.message || "Admin logout error");
    // }

    localStorage.removeItem("adminAccessToken");
    toast.success("Admin logout success");
    navigate("/admin-login");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col p-6 shadow-lg h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
      
      <nav className="space-y-3 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              location.pathname === item.path
                ? "bg-blue-600 font-semibold shadow"
                : "hover:bg-blue-800"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg bg-orange-200 hover:bg-orange-200 transition-all mt-6 text-black"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      <div className="text-sm text-center text-blue-200 mt-8">
        &copy; 2025 MyExamSite
      </div>
    </aside>
  );
}
