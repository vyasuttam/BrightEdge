import { useContext } from "react";
import { useCourseData } from "../store/CourseDataState";
import axios from "axios";
import { RoleContext } from "../context/RoleContext";

export function useCourseCardData() {

  const { setCourseData } = useCourseData();

  const role = useContext(RoleContext);

  const getCourses = async (search_query) => {
    try {
      // Fetch all courses
      const randomCourseRes = await axios.post(
        "http://localhost:8080/api/course/getCourses",
        { search_query },
        { withCredentials: true }
      );

      const randomCourses = randomCourseRes.data.data;

      // Fetch instructor's own courses
      let instructorCourses = [];
      let instructorCourseIds = new Set();

      if(role == "instructor") {
        const instructorCoursesResponse = await axios.get(
          "http://localhost:8080/api/instructor/getInstructorCourses",
          { withCredentials: true }
        );

        
        console.log("inside instructor")
        instructorCourses = instructorCoursesResponse.data.data;        

        instructorCourseIds = new Set(instructorCourses.map(c => c._id));
      }

      // Fetch enrolled courses
      const enrolledCourseRes = await axios.get(
        "http://localhost:8080/api/course/getEnrolledCourses",
        { withCredentials: true }
      );

      console.log(enrolledCourseRes.data);

        const enrolledCourses = enrolledCourseRes.data.data;
        const enrolledCourseIds = new Set(enrolledCourses.map(c => c._id));

      // Merge & flag courses accordingly
      const finalCourses = randomCourses.map(course => {
        const isInstructorCourse = instructorCourseIds.has(course._id);
        const isEnrolled = enrolledCourseIds.has(course._id);

        return {
          ...course,
          type: isInstructorCourse ? "instructor" : "student",
          isEnrolled,
        };
      });

      // Update state
      setCourseData(finalCourses);

    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return [getCourses];
}
