import React, { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { toast } from 'react-toastify';

// Signup form component

const signupSchema = z.object({
    full_name: z.string().min(5, 'Full name is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['student', 'instructor']),
});
  
export const SignupPage = () => {

  const router = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const [errors, setErrors] = useState({
    full_name: '',
    email: '',
    password: '',
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {

    const { name, value } = e.target;
    
    setFormData((prevData) => 
        ({
            ...prevData,
            [name]: value
        })
    );

    console.log(formData);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
        
        const response = await axios.post('http://localhost:8080/api/user/signup', formData);

        if(response.data.status == 201){
          toast.success("signed up successfully")
          router('/verifyPage', { state : { email : formData.email, origin:'signup' }  });
        }
        
        console.log(response);

    } catch (error) {
        
        console.log(error);

    }

  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        {message && <div className="text-green-500 mb-4 text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-600"
            />
            {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className='relative'>
              {
                passwordVisibility ? <FaRegEyeSlash 
                 className='absolute right-3 top-3'
                 onClick={() => setPasswordVisibility(!passwordVisibility)}
                /> :
                <IoMdEye 
                  className='absolute right-3 top-3'
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                />
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

          {/* <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div> */}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className='m-2 text-center'>Already have an Account?<span className='text-blue-600'><Link to="/login"> Login</Link></span></p>
      </div>
    </div>
  );
};
