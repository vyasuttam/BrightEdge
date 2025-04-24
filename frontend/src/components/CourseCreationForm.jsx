import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import CourseCategoryDropdown from "./mini/CourseCategoryDropdown";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CourseCreationForm = () => {

  const [isClosed, setIsClosed] = useState(false);

  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [courseData, setCourseData] = useState({
    course_title: "",
    course_desc: "",
    course_thumbnail: "",
    course_intro:"",
    price:0,
  });

  const [loading, setLoading] = useState(false);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({ ...courseData, course_thumbnail: file });
    }
    console.log(file);
  };

  const handleIntroductionVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({ ...courseData, course_intro: file });
    
    }

  };

  


  const handleCreate = async () => {

    console.log(courseData);

    setLoading(true);

    try
    { 
        const formData = new FormData();

        // Append text fields
        formData.append("course_title", courseData.course_title);
        formData.append("course_desc", courseData.course_desc);
        formData.append("price", Number(courseData.price));        
        // Append selected categories array as JSON
        formData.append("categories", JSON.stringify(selectedCategories));
    
        // Append files
        if (courseData.course_thumbnail) {
          formData.append("course_thumbnail", courseData.course_thumbnail);
        }
        if (courseData.course_intro) {
          formData.append("course_intro", courseData.course_intro);
        }

        const res = await axios.post("http://localhost:8080/api/instructor/addCourse", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        toast.success("Course Created Successfully");

        console.log(res.data);
    }
    catch(error)
    {
      toast.warning(error.response.data.message || "something went wrong")
      console.log(error);
    }
    finally {
      setLoading(false);
    }

  };

  const handleClose = () => {
    setIsClosed(true);
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-2 text-sm font-semibold text-blue-600">Creating...</p>
          </div>
        )}
      <div className="flex-1 p-8 bg-white w-full relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>

          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">Course Details</h3>
            <Input placeholder="Course Title" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, course_title: e.target.value })} className="w-full" />
            <Textarea placeholder="Course Description" value={courseData.description} onChange={(e) => setCourseData({ ...courseData, course_desc: e.target.value })} className="w-full" />
            
            <Input placeholder="₹ Price" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, price: e.target.value })} className="w-50" />

            <CourseCategoryDropdown selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>
            <div className="space-y-2">
              <label className="block text-gray-700">Course Thumbnail</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="border p-2 w-full" />
              {courseData.thumbnail && <img src={courseData.course_thumbnail} alt="Thumbnail Preview" className="w-32 h-32 object-cover mt-2" />}
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Course Introduction Video</label>
              <input type="file" accept="video/" onChange={handleIntroductionVideo} className="border p-2 w-full" />
              {courseData.thumbnail && <img src={courseData.course_intro} alt="Thumbnail Preview" className="w-32 h-32 object-cover mt-2" />}
            </div>
            <Button onClick={handleCreate} className="bg-blue-600">Create</Button>
          </div>
      </div>
    </div>
  );
};

export default CourseCreationForm;
