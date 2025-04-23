import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { FaTimes } from "react-icons/fa";
import CourseCategoryDropdown from "../components/mini/CourseCategoryDropdown";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CourseUpdateForm = () => {
  const [isClosed, setIsClosed] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [courseData, setCourseData] = useState({
    course_title: "",
    course_desc: "",
    course_thumbnail: "",
    course_intro: "",
    price: 0,
    course_thumbnail_link: "",
    course_intro_link: "",
  });

    const loadCategory = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/course/loadCategory", {
          withCredentials: true,
        });
        
        console.log(res.data);

        if (res.data.categories) {
          const categoryNames = res.data.categories.map((cat) => cat.category_name);
          setSelectedCategories(categoryNames);
        } else {
          console.error("No categories found");
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/course/getCourseData?course_id=${courseId}`, {
          withCredentials: true,
        });
        
        const course = res.data.data[0];

        setCourseData((prev) => ({
          ...prev,
          course_title: course.course_name,
          course_desc: course.course_description,
          price: course.price,
          course_thumbnail_link: course.thumbnail,
          course_intro_link: course.introductry_video,
        }));

       setSelectedCategories(course.categories)

      } catch (err) {
        toast.error("Failed to load course details");
      }
    };

    fetchData();
    loadCategory();
  }, [courseId]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({ ...courseData, course_thumbnail: file });
    }
  };

  const handleIntroductionVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData({ ...courseData, course_intro: file });
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("course_title", courseData.course_title);
      formData.append("course_desc", courseData.course_desc);
      formData.append("price", Number(courseData.price));
      formData.append("categories", JSON.stringify(selectedCategories));
      formData.append("course_thumbnail_link", courseData.course_thumbnail_link);
      formData.append("course_intro_link", courseData.course_intro_link);

      if (courseData.course_thumbnail) {
        formData.append("course_thumbnail", courseData.course_thumbnail);
      }
      if (courseData.course_intro) {
        formData.append("course_intro", courseData.course_intro);
      }

      await axios.put("http://localhost:8080/api/instructor/updateCourse", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Course Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update course");
    }
  };

  const handleClose = () => {
    setIsClosed(true);
    navigate("/dashboard");
  };

  const handleUpdateSections = () => {
    navigate(`/courses/${courseId}/editSections`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8 bg-white w-full relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">Update Course Details</h3>
          <Input
            placeholder="Course Title"
            value={courseData.course_title}
            onChange={(e) => setCourseData({ ...courseData, course_title: e.target.value })}
            className="w-full"
          />
          <Textarea
            placeholder="Course Description"
            value={courseData.course_desc}
            onChange={(e) => setCourseData({ ...courseData, course_desc: e.target.value })}
            className="w-full"
          />

          <Input
            placeholder="₹ Price"
            value={courseData.price}
            onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
            className="w-50"
          />

          <CourseCategoryDropdown selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />

          <div className="space-y-2">
            <label className="block text-gray-700">Course Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="border p-2 w-full" />
            {courseData.course_thumbnail_link && (
              <img src={courseData.course_thumbnail_link} alt="Thumbnail Preview" className="w-32 h-32 object-cover mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Course Introduction Video</label>
            <input type="file" accept="video/*" onChange={handleIntroductionVideo} className="border p-2 w-full" />
            {courseData.course_intro_link && (
              <video controls className="w-64 mt-2 rounded border">
                <source src={courseData.course_intro_link} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleUpdate} className="bg-blue-600">Update</Button>
            <Button onClick={handleUpdateSections} className="bg-green-600">Update Sections</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseUpdateForm;
