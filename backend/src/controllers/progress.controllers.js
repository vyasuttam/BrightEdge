import { courses } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { UserProgress } from "../models/progress.model.js";
import { Section_content } from "../models/section.model.js";
import mongoose from "mongoose";

export const updateCourseProgress = async (req, res) => {
    try {
        
      const { course_id, content_id } = req.body;
      const user_id = req.user_id;

      console.log("contewnt" ,content_id);
      
      if (!mongoose.Types.ObjectId.isValid(content_id)) {
        return res.status(400).json({ success: false, message: "Invalid content ID" });
      }
  
      const content = await Section_content.findOne({
        _id : content_id
      });

      if (!content) {
        return res.status(404).json({ success: false, message: 'Content not found' });
      }

      const alreadyExist = await UserProgress.findOne({
        course_id:course_id,
        content_id:content_id,
        user_id: user_id
      });

      if(alreadyExist){
        return res.status(200).json({
            messgae:"already progressed"
        })
      } 

      const progressObj = await UserProgress.create({
            course_id : course_id,
            content_id : content_id,
            user_id: user_id,
            is_completed : false,
        });
  
      res.status(200).json({ success: true, progressObj });
    } catch (error) {
      console.error('Error updating course progress:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getUserProgress = async (req, res) => {
    
    try {
      
      const { course_id } = req.body;
      const user_id = req.user_id;
        
      const courseObj = await courses.findOne({
        _id:course_id
      });
      
      const coursesEnrollementInfo = await Enrollment.findOne({
          student_id: user_id,
          course_id: course_id
      });

      console.log("enrollment :", coursesEnrollementInfo);

      const userProgress = await UserProgress.find({ user_id, course_id });
  
      res.status(200).json({ success: true, userProgress, courseObj, enrolledOn : coursesEnrollementInfo.createdAt });

    } catch (error) {
      console.error('Error getting user progress:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
  