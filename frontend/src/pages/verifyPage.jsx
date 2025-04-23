import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyPage() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Retrieve email from state
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Handle OTP input
  const handleChange = (value, index) => {

    if (isNaN(value)) return; // Only allow numbers
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Ensure only the last digit is used
    setOtp(updatedOtp);

    // Move focus to the next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace to focus the previous box
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {

    e.preventDefault();
    const otpValue = otp.join(""); // Combine all digits into a single string
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/user/verifyOtp", { email, userOtp: otpValue });
        console.log(response);

        if(location.state?.origin == "signup"){
            navigate('/login');
        }
        else{
            navigate('/');
        }


      alert('verification successfull');
    //   navigate("/dashboard"); // On success, redirect to dashboard
    } catch (err) {
        console.log(err);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/user/resendOtp", { email });
      alert("OTP resent successfully! Please check your email.");
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter the OTP sent to <span className="font-semibold">{email}</span>.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Verify OTP
          </button>
        </form>

        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className={`w-full mt-4 py-2 rounded-lg ${
            isResending
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 transition-colors"
          }`}
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyPage;
