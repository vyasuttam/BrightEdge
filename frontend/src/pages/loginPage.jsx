import React, { useContext, useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long').min(1, 'Password is required'),
  role: z.enum(['student', 'instructor']),
});

export const LoginPage = () => {
  const router = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', formData, {
        withCredentials: true
      });

      if (response.data?.isVerified === false) {
        router('/verifyPage', { state: { email: formData.email } });
        return;
      }

      toast.success("Logged in Successfully");
      setUser(response.data.userData);
      router('/');
    } catch (error) {
      toast.warning(error.response.data.error.message || error.message);
      console.log(error);
    }
  };

  const handleSendMail = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/user/forget-password-request', { email: formData.email });
      toast.success("Email is sent successfully");
      setMessage(response.data.message);
    } catch (error) {
      toast.warning(error.message);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Image Section */}
      <div className="w-full md:w-2/3 flex items-center justify-center">
        <img src="/Elearning_platform.jpg" alt="E-learning platform" className="object-cover h-64 md:h-full w-full" />
      </div>

      {/* Right Login Form Section */}
      <div className="w-full md:w-1/3 flex justify-center items-center p-8">
        <div className="w-full max-w-sm p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          {message && <div className="text-green-500 mb-4 text-center">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                {passwordVisibility
                  ? <FaRegEyeSlash className="absolute right-3 top-3 cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)} />
                  : <IoMdEye className="absolute right-3 top-3 cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)} />
                }
                <input
                  type={passwordVisibility ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="text-right mb-4">
              <p onClick={handleSendMail} className="text-sm text-blue-600 hover:underline cursor-pointer">
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Don’t have an Account? <span className="text-blue-600"><Link to="/signup">Sign Up</Link></span>
          </p>
        </div>
      </div>
    </div>
  );
};
