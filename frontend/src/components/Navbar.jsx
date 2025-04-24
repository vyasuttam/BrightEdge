import React, { useContext, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCourseData } from '../store/CourseDataState.js';
import { toast } from 'react-toastify';
import { useCourseCardData } from '../hooks/useCoursecardData.js';
import { AuthContext } from '../context/AuthContext.jsx';

export const Navbar = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { setCourseData } = useCourseData();
  const [getCourses] = useCourseCardData();
  const [searchParams, setSearchParams] = useSearchParams();

  const changeSearchParam = (key, value) => {
    searchParams.set(key.trim(), value.trim());
    setSearchParams(searchParams);
  };

  const { user, loading } = useContext(AuthContext);

  const courses = [
    'React Basics',
    'Advanced JavaScript',
    'Node.js Mastery',
    'Python for Beginners',
    'Data Structures & Algorithms',
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = courses.filter(course =>
        course.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const getCourseData = async (query) => {
    getCourses(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getCourseData(searchQuery.trim());
      setSuggestions([]);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    getCourseData(suggestion);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/logout', { withCredentials: true });
      if (response.data.status === 200) {
        navigate('/login');
      }
      toast.success("Logged out successfully");
      setIsMenuOpen(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="bg-black shadow-md text-white z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-200 transition">
            <img src="/BrightEdge.png" alt="Logo" className="h-5" />
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/courses" className="hover:text-blue-200">Courses</Link>
          <Link to="/exams" className="hover:text-blue-200">Exams</Link>

          {/* Search Box */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <IoSearch className="text-blue-500 mr-2" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-48 md:w-64 focus:outline-none text-gray-700"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            {suggestions.length > 0 && (
              <div className="absolute mt-2 w-full bg-white border border-blue-100 rounded-lg shadow-lg z-10 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          {
            !loading && user ? (
            <div className="relative">
              <div className="cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {user && user.profile_url ? (
                  <img src={user.profile_url} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-gray-600" />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-white" />
                )}
              </div>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg text-gray-800 z-20">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div
                    className="block px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
          </div>
            ) : (
              <div>
                <Link to={'/login'}>
                  <button className='p-2 bg-blue-600 text-white rounded-full px-6 py-2'>Login</button>
                </Link>
              </div>
            )
          }

          
          
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="flex flex-col gap-4">
            <Link to="/courses" className="hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
            <Link to="/exams" className="hover:text-blue-200" onClick={() => setIsMobileMenuOpen(false)}>Exams</Link>

            {/* Mobile Search */}
            <div className="relative">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md mt-2">
                <IoSearch className="text-blue-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full focus:outline-none text-gray-700"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {suggestions.length > 0 && (
                <div className="absolute mt-2 w-full bg-white border border-blue-100 rounded-lg shadow-lg z-10 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/dashboard"
              className="hover:text-blue-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-left text-red-100 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
