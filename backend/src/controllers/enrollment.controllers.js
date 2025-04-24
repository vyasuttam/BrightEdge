import { courses } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";

export const studentEnrollment = async (req, res) => {

    try {
        
        const { course_id } = req.query;

        if(!course_id){
            throw new Error("please provide course id");
        }
    
        const isCourse = await courses.findById(course_id);
    
        if(!isCourse) {
            throw new Error("Course doesn't exist")
        }
    
        await Enrollment.create({
            course_id : course_id,
            student_id : req.user_id
        });
    
        return res.status(200).json({
            status : true,
            message : "Enrolled successfully"
        });
    


    } catch (error) {
    
        return res.status(400).json({
            status : true,
            message : error.message
        });

    }    

}

export const getEnrolledCourses = async (req, res) => {
    try {
        const userEnrolledCourses = await Enrollment.find({
            student_id: req.user_id
        });

        // console.log(userEnrolledCourses);

        // Use Promise.all with map for async handling
        let enrolledCourses = await Promise.all(
            userEnrolledCourses.map(async (enrolledCourse) => {
                return await courses.findOne({ _id: enrolledCourse.course_id }).populate("instructor_id"); // Use `findOne` instead of `find`
            })
        );

        // console.log(enrolledCourses);
 
        if(enrolledCourses[0] == null) {
            enrolledCourses = [];
        }

        return res.status(200).json({
            status: true,
            message: "Fetched successfully",
            data: enrolledCourses
        });

    } catch (error) {
        return res.status(500).json({ // Use 500 for internal errors
            status: false,
            message: error.message
        });
    }
};

// export const getEnrollmentDate = async (req, res) => {

//     try
//     {
//         const { course_id } = req.query;

//         const coursesEnrollementInfo = await Enrollment.findOne({
//             course_id: course_id,
//         });

//         return res.status(200).json({
//             message: "course status data",
//             data: coursesEnrollementInfo.createdAt
//         });

//     }
//     catch(error){
//         return res.status(400).json(error);
//     }


// }