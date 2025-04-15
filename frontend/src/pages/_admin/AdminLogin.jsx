import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { setAdmin } = useContext(AdminContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try
    {
        const res = await axios.post("http://localhost:8080/api/admin/admin-login", {
            email : email,
            password : password
        }); 
        
        setAdmin(res.data.data);

        localStorage.setItem("adminAccessToken", res.data.data.token);

        navigate("/admin");

        console.log(res.data);

        toast.success("admin loggin success");
        console.log(res);
    }
    catch(error)
    {
        console.log(error);
        toast.error(error.response.data.message || error.message);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
