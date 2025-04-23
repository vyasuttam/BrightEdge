import React, { useEffect, useState } from "react";
import axios from "axios";
import { AvatarSidebar } from "./mini/AvatarSidebar";
import ChangePasswordModal from "./mini/ChangePasswordModal";
import { toast } from "react-toastify";

export const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUser({ ...user, [name]: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/getProfileInfo", {
        withCredentials: true,
      });
      if (response.data?.userData) {
        setUser(response.data.userData);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("full_name", user.full_name);
      formData.append("work_experience", user.work_experience);
      if (user.qualification_doc instanceof File) {
        formData.append("qualification_doc", user.qualification_doc);
      }

      await axios.post("http://localhost:8080/api/user/updateProfile", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      getUserDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setProfilePreview(preview);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
            <img
              src={profilePreview || user.profile_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/3">
            <AvatarSidebar image_url={user.profile_url} />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
            {!isEditing ? (
              <button
                className="text-blue-600 hover:underline font-semibold"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                onClick={updateProfile}
              >
                Save
              </button>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={user.full_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-700 text-lg">
                {user.full_name}
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Role</label>
            <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-700 text-lg">
              {user.role}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-700 text-lg">
              {user.email}
            </div>
          </div>

          {/* Conditional Instructor-only fields */}
          {user.role === "instructor" && (
            <>
              {/* Work Experience */}
              <div>
                <label className="text-sm text-gray-500 block mb-1">Work Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="work_experience"
                    value={user.work_experience || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-700 text-lg">
                    {user.work_experience}
                  </div>
                )}
              </div>

              {/* Qualification Document */}
              <div>
                <label className="text-sm text-gray-500 block mb-1">Qualification Document</label>
                {isEditing ? (
                  <input
                    type="file"
                    name="qualification_doc"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  user.qualification_doc ? (
                    <a
                      href={user.qualification_doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <div className="text-gray-500">No document uploaded</div>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-300" />

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-5">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
              onClick={() => setIsChangePassword(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {isChangePassword && (
          <ChangePasswordModal setIsChangePassword={setIsChangePassword} />
        )}
      </div>
    </div>
  );
};
