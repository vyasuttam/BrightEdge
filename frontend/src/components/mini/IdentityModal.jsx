import axios from "axios";
import { useContext, useState } from "react";
import { RoleContext } from "../../context/RoleContext";
import { toast } from "react-toastify";

export default function IdentityModal({ aadharNumber, setAadharNumber, setIsOpen }) {
  const { setRole } = useContext(RoleContext);

  const [error, setError] = useState("");
  const [qualificationFile, setQualificationFile] = useState(null);
  const [workExperience, setWorkExperience] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!/^\d{12}$/.test(aadharNumber)) {
      setError("Invalid Aadhar number. It should be a 12-digit numeric value.");
      return;
    }

    if (!qualificationFile) {
      setError("Please upload your qualification proof.");
      return;
    }

    const formData = new FormData();
    formData.append("aadharNumber", aadharNumber);
    formData.append("qualification_doc", qualificationFile);
    formData.append("work_experience", workExperience);

    try {

      const res = await axios.post("http://localhost:8080/api/user/upgradeRole", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.status === 200) {
        setRole("instructor");
        setIsOpen(false);
        toast.success("Role upgraded to instructor successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upgrade role.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-[600px] relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Upgrade to Instructor
          </h2>

          {/* Aadhar Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              maxLength={12}
              placeholder="Enter 12-digit Aadhar number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Work Experience Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Experience (optional)</label>
            <input
              type="text"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              placeholder="e.g. 2 years as Java Developer"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Qualification Upload - Modern UI */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Qualification Proof
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              {qualificationFile ? (
                <p className="text-sm text-gray-700 font-medium">{qualificationFile.name}</p>
              ) : (
                <p className="text-sm text-gray-500">Click to upload your file here</p>
              )}
              <input
                id="fileUpload"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setQualificationFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Confirm & Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
