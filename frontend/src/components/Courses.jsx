import React, { useEffect } from 'react'
import CourseCard from './mini/CourseCard'
import { useCourseData } from '../store/CourseDataState'
import { useCourseCardData } from '../hooks/useCoursecardData'

export const Courses = () => {
  const { courseData } = useCourseData()
  const [getCourses] = useCourseCardData()

  useEffect(() => {
    getCourses("")
  }, []);

  return (
    <div className="mt-16 w-full flex justify-center">
      <div className="flex justify-center flex-wrap gap-6 w-11/12 max-w-7xl">
        {courseData && courseData.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            type={course.type}
            isEnrolled={course.isEnrolled}
          />
        ))}
      </div>
    </div>
  )
}
