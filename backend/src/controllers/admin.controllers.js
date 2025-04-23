import { admin } from "../models/admin.model.js";
import bcrypt from 'bcrypt';
import { generateAccessToken } from "./user.controllers.js";
import { user, userRoles } from "../models/user.model.js";
import { courses } from "../models/course.model.js";
import { Exam, ExamEnrollment, ExamResult, Question, UserAnswers } from "../models/exam.model.js"
import jwt from "jsonwebtoken";
import { UserProgress } from "../models/progress.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Section, Section_content } from "../models/section.model.js";

export const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Field is empty",
      });
    }

    const adminData = await admin.findOne({ email });

    if (!adminData || !(await bcrypt.compare(password, adminData.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken({
      _id: adminData._id,
    },
      {
        role_name: "admin"
      }
    );

    console.log("token gener", accessToken);


    res.setHeader('Set-Cookie', `adminAccessToken=${accessToken}; Max-Age=86400; Path=/admin`);


    return res.status(200)
      .json({
        success: true,
        message: "Admin login success",
        data: {
          email: adminData.email,
          admin_id: adminData._id,
          role: "admin",
          token : accessToken
        },
      });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await user.countDocuments();

    // Total Students
    const totalStudents = await userRoles.countDocuments({ role_name: "student" });

    // Total Instructors
    const totalInstructors = await userRoles.countDocuments({ role_name: "instructor" });

    // Total Courses
    const totalCourses = await courses.countDocuments();

    // Total Exams
    const totalExams = await Exam.countDocuments();

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalExams,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const getAdminCourses = async (req, res) => {
  try {
    const courseData = await courses.find()
      .populate("instructor_id")
      .sort({ createdAt: -1 });

    // console.log(courseData);

    const formattedCourses = courseData.map(course => ({
      _id: course._id,
      course_name: course.course_name,
      thumbnail: course.thumbnail,
      price: course.price,
      categories: course.categories,
      content_count: course.content_count,
      createdAt: course.createdAt,
      instructor_name: course.instructor_id?.full_name || "Unknown",
      instructor_email: course.instructor_id?.email
    }));

    // console.log(formattedCourses);

    res.status(200).json({
      success: true,
      data: formattedCourses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUsers = async (req, res) => {

  try {

    console.log("hit route fetched");

    const tempUserRoles = await userRoles.find({}).populate("user_id");

    if(!tempUserRoles) {
      return res.status(400).json({
        message : "user not defined"
      })
    }
    // console.log(tempUserRoles);

    const formattedUsers = tempUserRoles.map((userRole) => ({
      identityNumber: userRole.identityNumber,
      qualification_doc: userRole.qualification_doc,
      role: userRole.role_name,
      work_experience: userRole.work_experience,
      profile_pic: userRole.user_id.profile_url || "",
      full_name: userRole.user_id.full_name,
      email: userRole.user_id.email,
      _id: userRole.user_id._id
    }));

    console.log("data fetched");

    return res.status(200).json({
      sucess: true,
      users: formattedUsers
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export const deleteUser = async (req, res) => {

  try {
    const { user_id } = req.query;

    await user.deleteOne({
      _id: user_id
    });

    await userRoles.deleteOne({
      user_id: user_id
    });

    const instructor_courses = await courses.find({ instructor_id: user_id });

    for (const course of instructor_courses) {
      const sections = await Section.find({ course_id: course._id });
    
      for (const section of sections) {
        // Delete section content
        await Section_content.deleteMany({ section_id: section._id });
      }
    
      // Delete sections
      await Section.deleteMany({ course_id: course._id });
    
      // Delete course
      await courses.deleteOne({ _id: course._id });
      await UserProgress.deleteMany({ course_id : course._id });

      await Enrollment.deleteMany({
        course_id : course._id
      });
    }

    await Enrollment.deleteMany({
      student_id : user_id
    });

    const instructor_exams = await Exam.find({
      user_id : user_id
    });


    for(const exam of instructor_exams) {

      await Question.deleteMany({
        exam_id: exam._id
      });

      await UserAnswers.deleteMany({
        exam_id : exam._id
      });

      await ExamResult.deleteMany({
        exam_id : exam._id
      });

      await ExamEnrollment.deleteMany({
        exam_id : exam._id
      });

      await Exam.deleteOne({
        _id : exam._id
      });
    }

    return res.status(200).json({
      sucess: true,
      message: "user deleted success"
    });

  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

}

export const adminAuth = async (req, res) => {
  try {

    const token = req.headers['authorization']; // Get token from the Authorization header
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    const tokenParts = token.split(' '); // Split to get the token part after "Bearer"
    const accessToken = tokenParts[1];

    console.log(accessToken + "from checkauth")

    const isValid = jwt.verify(accessToken , process.env.ACESSTOKEN_SECRET);

    console.log(isValid);

    if (!isValid) {
      return res.status(401).json({
        userData: null,
        status: 401
      });
    }

    console.log(isValid.user_id);

    const userData = await admin.findOne({
      _id: isValid.user_id
    }).select('-password -createdAt -updatedAt');

    console.log(userData);

    const adminObj = userData.toObject();

    let data = {
        _id :adminObj.user_id,
      emai : adminObj.email,
      role : "admin"
    }

    return res.status(200).json({
      data,
      status: 200
    });

  } catch (error) {

    console.log(error);

    res.status(400).json({
      error,
      message: "this is errorr"
    });
  }

}

export const deleteExamAdmin = async (req, res) => {

    try {
        
        const { examId : exam_id } = req.params;

      console.log(exam_id);

        console.log("called admin delete");

        // const currentTime = new Date();
        // const examStartTime = new Date(examObj.exam_start_time);
        // const duration = examObj.exam_duration * 60 * 1000; // Convert duration to milliseconds

        // if ((currentTime >= examStartTime) && (currentTime <= examStartTime + duration)) {
        //     return res.status(400).json({ success: false, message: 'Exam already started' });
        // }  
    
        await Exam.deleteOne({ _id: exam_id });
        await Question.deleteMany({ exam_id: exam_id });
        await UserAnswers.deleteMany({ exam_id: exam_id });
        await ExamResult.deleteMany({ exam_id: exam_id });
        await ExamEnrollment.deleteMany({ exam_id: exam_id });  


        return res.status(200).json({ success: true, message: 'Exam deleted successfully' });

    } catch (error) {
        console.error('Error deleting exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}