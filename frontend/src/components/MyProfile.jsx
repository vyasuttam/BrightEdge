import React, { useEffect, useState } from "react";
import axios from "axios";
import { AvatarSidebar } from "./mini/AvatarSidebar";
import ChangePasswordModal from "./mini/ChangePasswordModal";

export const MyProfile = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const [isChangePassword, setIsChangePassword] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const getUserDetails = async () => {
    try 
    {
        const response = await axios.get("http://localhost:8080/api/user/getProfileInfo", {
            withCredentials: true,
        });
    
        console.log(response);
    
        if (response.data?.userData)
        {
            setUser(response.data.userData);
        } 
        else 
        {
            setUser(null)
        }

    } catch (err) {
      console.log(err);
    }
  }

  const updateProfile = async () => {
  
    try {
      
      const response = await axios.post("http://localhost:8080/api/user/updateProfile", user, {
        withCredentials: true,
      });

      setIsEditing(false);

    } catch (error) {
      
      console.log(error);

    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return ( 
    <div className="flex h-full p-8 bg-gray-100 overflow-hidden">
      {/* Left Panel */}
      <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg w-1/3 h-full">
        <div className="relative h-64 w-64 rounded-full overflow-hidden">
            <img
            src={user.profile_url}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover"
            />
        </div>
        <AvatarSidebar image_url={user.profile_url}/>
      </div>
    
      {/* Right Panel - Profile Information */}
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-lg w-2/3 h-full ml-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          {
            !isEditing && <button
              className="text-blue-500 font-semibold text-lg"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          }
          {

            isEditing && <button
                className="text-blue-500 font-semibold text-lg"
                onClick={() => updateProfile()}
              >
              save
            </button>
          }
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {[
            { label: "Full Name", name: "full_name" },
            { label: "Role", name: "role" },
            { label: "Email", name: "email" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="text-gray-600 block mb-2 text-lg">{label}</label>
              {isEditing ? (
                <input
                  type="text"
                  name={name}
                  value={user[name]}
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg text-lg"
                />
              ) : (
                <>
                    <p className="text-lg">{user[name]}</p>
                    <hr className="my-2" />
                </>
              )}
            </div>
          ))}
        </div>
        <button 
          className="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsChangePassword(true)}
          >
          Change Password
        </button>
        {
          isChangePassword && <ChangePasswordModal setIsChangePassword={setIsChangePassword}/>
        }
      </div>
    </div>
  );
};


