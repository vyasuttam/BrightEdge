import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AvatarSidebar = ({ profile_url }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
  
    console.log(profile_url);

    const handleFileChange = (event) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };

    const uploadImageToServer = async () => {
    
        try 
        {
            const formData = new FormData();
            formData.append("profile_image", file);
           
            const response = await axios.post('http://localhost:8080/api/user/uploadProfilePicture', formData, {
                withCredentials: true,
            });

            console.log(response);
            
            if (response.status === 200) {
                toast.success("Profile Uploaded success");

                setIsOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    


  return (
    <>
        <button 
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg w-full h-10 flex items-center justify-center text-lg"
            onClick={() => setIsOpen(true)}
            >
            Upload Photo
        </button>

        {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload File</h2>

            {/* File Upload Area */}
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 border-gray-300 hover:border-blue-500 transition"
            >
              <svg
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V12a5 5 0 0110 0v4M5 16h14a2 2 0 002-2V9a2 2 0 00-2-2h-4.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-1.414 0L8.293 6.707A1 1 0 017.586 7H5a2 2 0 00-2 2v5a2 2 0 002 2z"
                ></path>
              </svg>
              <p className="text-gray-500">Click to upload</p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Display selected file name */}
            {file && (
              <p className="mt-3 text-gray-700 text-sm">Selected: {file.name}</p>
            )}

            {/* Upload Button */}
            <button
              onClick={() => uploadImageToServer()}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  )
}
