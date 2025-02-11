import React, { useEffect, useState } from "react";
import axios from "axios";

export const MyProfile = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    username: "gene.rodrig",
    firstName: "Gene",
    lastName: "Rodriguez",
    nickname: "Gene.r",
    role: "Subscriber",
    displayName: "Gene",
    email: "gene.rodrig@gmail.com",
    website: "gene-rodrig.webflow.io",
    whatsapp: "@gene-rod",
    telegram: "@gene-rod",
    bio: "Albert Einstein was a German mathematician and physicist who developed the special and general theories of relativity. In 1921, he won the Nobel Prize for physics for his explanation of the photoelectric effect.",
  });

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

  useEffect(() => {
    getUserDetails();
  }, []);

  return ( 
    <div className="flex h-full p-8 bg-gray-100 overflow-hidden">
      {/* Left Panel - Account Management */}
      <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg w-1/3 h-full">
        <div className="relative w-40 h-40">
          <img
            src="/default-avatar.png"
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg w-full text-lg">
          Upload Photo
        </button>

        {/* Password Change Fields */}
        {/* <div className="w-full mt-6">
          <label className="text-gray-600 block mb-2 text-lg">Old Password</label>
          <input type="password" className="w-full border px-4 py-3 rounded-lg text-lg" />
        </div>

        <div className="w-full mt-4">
          <label className="text-gray-600 block mb-2 text-lg">New Password</label>
          <input type="password" className="w-full border px-4 py-3 rounded-lg text-lg" />
        </div>

        <button className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg w-full text-lg">
          Change Password
        </button> */}
      </div>

      {/* Right Panel - Profile Information */}
      <div className="flex flex-col bg-white p-8 rounded-xl shadow-lg w-2/3 h-full ml-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <button
            className="text-blue-500 font-semibold text-lg"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
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

      </div>
    </div>
  );
};
