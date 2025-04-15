import { useEffect, useState } from "react";
import { FaVideo, FaEye } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BsQuestionCircle } from "react-icons/bs";
import { MdDescription } from "react-icons/md";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useCourseData } from "../store/CourseDataState";


// const courseContent = [
//   {
//     title: "Meal Planning Basics",
//     lessons: [
//       { type: "video", title: "Meal Planning Explained", duration: "17:24" },
//       { type: "video", title: "Macronutrients Explained", duration: "05:12" },
//       { type: "video", title: "How Much Protein Should You Consume Per Day?", duration: "15:00" },
//       { type: "video", title: "How Much Fat Should You Consume Per Day", duration: "07:35" },
//       { type: "doc", title: "Meal Timing Introduction" },
//       { type: "quiz", title: "This is a Demo Quiz" }
//     ]
//   },
//   { title: "Supplements", lessons: [] },
//   { title: "Setting Up Your Diet", lessons: [] },
//   { title: "Adjusting Your Diet For Weight Loss & Muscle Gains", lessons: [] }
// ];

export default function CourseContent({ courseData }) {
  
  const [openSections, setOpenSections] = useState([0]); // Default open first section

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const { course_id } = useParams();

  console.log(courseData, "from courseContent compooennt")

  return (
    <div className="w-full">
      {/* <h2 className="text-2xl font-bold mb-4">
        <span className="bg-black text-white px-3 py-1 rounded">Course Content</span>
      </h2> */}

      {courseData?.sections && courseData.sections.map((section, index) => (
        <div key={index} className="mb-3">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg font-semibold text-lg"
            onClick={() => toggleSection(index)}
          >
            {section.section_name}
            {openSections.includes(index) ? <IoIosArrowDown /> : <IoIosArrowForward />}
          </button>

          {openSections.includes(index) && section.contents && section.contents.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border mt-2">
              {section.contents.map((content, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-none">
                  <div className="flex items-center gap-3">
                    {content.content_media_type === "video" && <FaVideo className="text-gray-500" />}
                    {content.content_media_type === "document" && <MdDescription className="text-gray-500" />}
                    {
                      courseData.isEnrolled ? <Link to={`courseContent`}><span>{content.content_name}</span></Link> : <div>{content.content_name}</div>
                    }  
                  </div>
                  {/* {content.duration ? <span className="text-gray-600">{content.duration}</span> : <FaEye className="text-gray-500" />} */}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
