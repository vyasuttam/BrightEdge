import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MdDescription } from 'react-icons/md';
import { FaVideo } from 'react-icons/fa';

export const CourseContentPage = () => {
  const [courseData, setCourseData] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const { course_id } = useParams();

  // Fetch course data
  const getCourseData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/course/getCourseData?course_id=${course_id}`,
        { withCredentials: true }
      );

      const fetchedData = response.data.data[0];
      setCourseData(fetchedData);

      // Initialize expanded state based on section names
      const initialExpandedState = fetchedData.sections.reduce((acc, section) => {
        acc[section.section_name] = false;
        return acc;
      }, {});
      setExpanded(initialExpandedState);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const addInUserProgress = async (content_id) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/course/updateProgress`,
        {
          course_id : course_id,
          content_id : content_id
        },
        { withCredentials: true }
      );

      console.log(response);

    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  }

  useEffect(() => {
    getCourseData();
  }, []);

  // Toggle expand/collapse for sections
  const toggleExpand = (sectionName) => {
    setExpanded((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // Handle content selection using data attributes
  const handleSelectLesson = async (e) => {
    const url = e.currentTarget.dataset.url;
    const type = e.currentTarget.dataset.type;
    const content_id = e.currentTarget.id;

    console.log(e.currentTarget);

    setSelectedLesson({ url, type });

    await addInUserProgress(content_id);
  };

  // Calculate progress based on total lessons
  const totalLessons =
    courseData?.sections?.reduce(
      (acc, section) => acc + section.contents.length,
      0
    ) || 0;
  const completedCount = completedLessons.length;
  const progressPercentage = totalLessons
    ? (completedCount / totalLessons) * 100
    : 0;

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r p-4 bg-white overflow-y-auto">
        {courseData ? (
          <>
            {/* Course Sections */}
            {courseData.sections.map((section) => (
              <div key={section._id} className="mt-4">
                {/* Section Title */}
                <div
                  className="flex items-center justify-between cursor-pointer font-semibold"
                  onClick={() => toggleExpand(section.section_name)}
                >
                  <span>{section.section_name}</span>
                  {expanded[section.section_name] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>

                {/* Section Content */}
                {expanded[section.section_name] && (
                  <ul className="mt-2 space-y-1">
                    {section.contents.map((content) => (
                      <li
                        id={content._id}
                        key={content._id}
                        data-url={content.content_url}
                        data-type={content.content_media_type} // video or document
                        className={`flex items-center space-x-2 text-sm cursor-pointer hover:text-blue-600 ${
                          selectedLesson?.url === content.content_url
                            ? 'text-blue-500 font-semibold'
                            : ''
                        }`}
                        onClick={handleSelectLesson}
                      >
                        {/* Completion Status */}
                        {/* {completedLessons.includes(content.content_name) ? (
                          <CheckCircle size={16} className="text-blue-500" />
                        ) : (
                          <Circle size={16} />
                        )} */}
                        {
                          content.content_media_type == "video" ? <FaVideo className="text-gray-500" /> : <MdDescription className="text-gray-500"/>
                        }
                        <span>{content.content_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-500">Loading course data...</p>
        )}
      </div>

      {/* Selected Lesson Content */}
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        {selectedLesson ? (
          <div className="bg-white p-6 shadow-lg rounded-lg w-full h-full">
            {selectedLesson.type === 'video' ? (
              <ReactPlayer
                url={selectedLesson.url}
                width="100%"
                height="100%"
                controls
              />
            ) : selectedLesson.type === 'document' ? (
              <iframe
                src={selectedLesson.url}
                className="w-full h-full"
                frameBorder="0"
              />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select a lesson to view its content.</p>
        )}
      </div>
    </div>
  );
};
