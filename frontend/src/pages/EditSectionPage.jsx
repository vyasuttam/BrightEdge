import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const EditSectionPage = () => {
  const { courseId } = useParams();

  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");

  // Add new section
  const addSection = () => {
    if (newSectionName.trim() === "") return;
    setSections([...sections, { section_number: Date.now(), section_name: newSectionName }]);
    setNewSectionName("");
  };

  // Remove section
  const removeSection = async (sectionId) => {

    try
    {
      const res = await axios.get(`http://localhost:8080/api/instructor/deleteSection/${sectionId}`, {
        withCredentials: true,
      });

      if(res.data.success) {
        setSections(sections.filter((section) => section._id !== sectionId));
        toast.success("section deletion success");
      }
      
    }
    catch(error) {
      toast.error(error.response.data.message || error.message || "something went wrong")
      console.log(error);
    }

  };

  const getSections = async () => {
    
    try {
      
      const res = await axios.post(`http://localhost:8080/api/instructor/getSections`, {
        course_id: courseId,
      }, {
        withCredentials: true,
      });

      console.log(res.data);

      setSections(res.data.data);
      
      console.log("data set in array");

    } catch (error) { 

      console.error(error);
    }
  
  }

  const handleCreateSection = async () => {

    try {
      
      const res = await axios.post(`http://localhost:8080/api/instructor/addSection`, {
        section_name: newSectionName,
        course_id: courseId,
        section_number: sections.length + 1,
      }, {
        withCredentials: true,
      });

      console.log(res.data);

      toast.success("Section added successfully!");

      getSections();

    } catch (error) {
      toast.error("Failed to add section");
      console.error(error);
    }

  };

  useEffect(() => {
    getSections();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Manage Sections</h2>

        {/* Input for Adding a New Section */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter Section Name"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <Button
            className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded"
            onClick={handleCreateSection}
          >
            <FaPlus /> Add Section
          </Button>
        </div>

        {/* List of Sections */}
        <ul className="space-y-3">
          { sections && sections.length > 0 ? (
            sections.map((section) => (
              <li key={section.section_number} className="flex justify-between items-center border p-3 rounded shadow-sm bg-gray-50">
                <span className="truncate w-3/4">{section.section_name}</span>
                <div className="flex gap-2">
                  {/* Edit Button - Navigates to Edit Content Page */}
                  <Link to={`/courses/${courseId}/${section._id}/editContent`}>
                    <Button className="bg-green-500 text-white px-3 py-1 rounded">Edit</Button>
                  </Link>
                  {/* Delete Button */}
                  <Button onClick={() => removeSection(section._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    <FaTrash />
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No sections added yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EditSectionPage;
