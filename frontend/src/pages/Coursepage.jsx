import React, { useEffect } from "react";
import CourseFilter from "../components/CourseFilter";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/mini/CourseCard";
import Footer from "../components/Footer";
import { useCourseData } from "../store/CourseDataState";
import { useCourseCardData } from "../hooks/useCoursecardData";

export const Coursepage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { courseData, setCourseData } = useCourseData();
  const [getCourses] = useCourseCardData();

  const selectedFilters = Object.fromEntries(searchParams.entries());
  const parsedFilters = {};
  let isAnyFilterApplied = false;

  for (const key in selectedFilters) {
    const values = selectedFilters[key].split(",").filter((v) => v);
    if (values.length > 0) {
      parsedFilters[key] = values;
      isAnyFilterApplied = true;
    }
  }

  const filteredCourses = courseData.filter((course) => {
    let matches = true;

    if (parsedFilters.Topic?.length) {
      const selectedTopics = parsedFilters.Topic.map((t) => t.toLowerCase());
      const courseCategories = course.categories
        ? course.categories.map((c) => c.toLowerCase())
        : [];

      const topicMatch = selectedTopics.some((topic) =>
        courseCategories.includes(topic)
      );

      matches = matches && topicMatch;
    }

    if (parsedFilters.Price?.length) {
      const coursePrice = course.price > 0 ? "Paid" : "Free";
      matches = matches && parsedFilters.Price.includes(coursePrice);
    }

    return matches;
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (query = "") => {
    getCourses(query);
  };

  console.log(courseData);

  return (
    <>
      <div className="w-full flex justify-center bg-gray-50 min-h-screen">
        <div className="w-11/12 max-w-7xl py-8">
          <h1 className="text-3xl font-semibold mb-6 px-4 md:px-0">
            {searchQuery ? `Search Results for: ${searchQuery}` : "Explore Courses"}
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="lg:w-1/4 w-full px-4 md:px-0">
              <div className="sticky top-4">
                <CourseFilter />
              </div>
            </div>

            {/* Course Grid */}
            <div className="flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {(isAnyFilterApplied ? filteredCourses : courseData).length > 0 ? (
                (isAnyFilterApplied ? filteredCourses : courseData).map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    type={course.type}
                    isEnrolled={course.isEnrolled}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  No courses found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
