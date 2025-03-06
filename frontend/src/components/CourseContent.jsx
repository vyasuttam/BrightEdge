import { useState } from "react";
import { FaVideo, FaEye } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { MdDescription } from "react-icons/md";

const courseContent = [
  {
    title: "Meal Planning Basics",
    lessons: [
      { type: "video", title: "Meal Planning Explained", duration: "17:24" },
      { type: "video", title: "Macronutrients Explained", duration: "05:12" },
      { type: "video", title: "How Much Protein Should You Consume Per Day?", duration: "15:00" },
      { type: "video", title: "How Much Fat Should You Consume Per Day", duration: "07:35" },
      { type: "doc", title: "Meal Timing Introduction" },
      { type: "quiz", title: "This is a Demo Quiz" }
    ]
  },
  { title: "Supplements", lessons: [] },
  { title: "Setting Up Your Diet", lessons: [] },
  { title: "Adjusting Your Diet For Weight Loss & Muscle Gains", lessons: [] }
];

export default function CourseContent() {
  const [openSections, setOpenSections] = useState([0]); // Default open first section

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full p-6">
      {/* <h2 className="text-2xl font-bold mb-4">
        <span className="bg-black text-white px-3 py-1 rounded">Course Content</span>
      </h2> */}
      <h1 className="text-2xl font-bold py-2">Course Content</h1>

      {courseContent.map((section, index) => (
        <div key={index} className="mb-3">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg font-semibold text-lg"
            onClick={() => toggleSection(index)}
          >
            {section.title}
            {openSections.includes(index) ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </button>

          {openSections.includes(index) && section.lessons.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border mt-2">
              {section.lessons.map((lesson, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-none">
                  <div className="flex items-center gap-3">
                    {lesson.type === "video" && <FaVideo className="text-gray-500" />}
                    {lesson.type === "quiz" && <BsQuestionCircle className="text-gray-500" />}
                    {lesson.type === "doc" && <MdDescription className="text-gray-500" />}
                    <span>{lesson.title}</span>
                  </div>
                  {lesson.duration ? <span className="text-gray-600">{lesson.duration}</span> : <FaEye className="text-gray-500" />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
