import axios from "axios";
import { useState } from "react";

export default function ChangePasswordModal({ setIsChangePassword }) {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setError("Both fields are required!");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    
    try {

        const response = await axios.post("http://localhost:8080/api/user/changePassword", {
            oldPassword,
            newPassword,
        }, {
            withCredentials: true,
        });

        if(response.data.status == 200){
            setIsChangePassword(false);
            setOldPassword("");
            setNewPassword("");
            setError("");
        }
  
        console.log(response);
        
    } catch (error) {
        
        console.log(error);

    }


    // Handle password change logic here (API call, etc.)

  };

  return (
    <div className="flex items-center justify-center min-h-screen">


        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsChangePassword(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h2>

            {/* Old Password Input */}
            <div className="mb-3">
              <label className="block text-sm text-gray-600">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter old password"
              />
            </div>

            {/* New Password Input */}
            <div className="mb-3">
              <label className="block text-sm text-gray-600">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {/* Confirm Button */}
            <button
              onClick={handleChangePassword}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Confirm
            </button>
          </div>
        </div>
    </div>
  );
}
