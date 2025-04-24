import { z } from 'zod';
import { course_categories, courses } from '../models/course.model.js';
import mongoose from 'mongoose';
import { deletefromCloudinary, uploadToCloudinary } from '../config/cloudinary.js';
import { Enrollment } from '../models/enrollment.model.js';
import { user } from '../models/user.model.js';
import { Section, Section_content } from '../models/section.model.js';

const courseSchema = z.object({
    course_title: z.string().min(5, "course name must be of length 5").max(50, "course name must be of length 50"),
    course_desc: z.string().min(5, "course description must be of length 5").max(500, "course description must be of length 500"),
    course_thumbnail: z.string("please provide thumbnail"),
    course_intro: z.string("please provide intro video"),
    categories: z.array(z.string()).min(1, "atleast one category is required"),
    price: z.number().nonnegative("price must be a positive number"),
});

export async function addCouse(req, res) {

    try{

        const { course_title, course_desc, categories, price } = req.body;

        const { course_thumbnail, course_intro } = req.files;

        console.log(course_thumbnail, course_intro);
        console.log(req.body);

        console.log('data got');

        if(!course_thumbnail || !course_intro) {
            return res.status(400).json({
                message : "please provide all details(name, thumbnail & intro video, etc)"
            });
        }

        const courseData = courseSchema.safeParse({
            course_title,
            course_desc,
            course_thumbnail:course_thumbnail[0].path,
            course_intro:course_intro[0].path,
            categories:JSON.parse(categories),
            price:Number(price),
            instructor_id: req.user_id,
        });

        if(!courseData.success){
            throw new Error(courseData.error.issues[0].message);
        }

        console.log('data parsed');

        const cloudinaryThumbnail = await uploadToCloudinary(course_thumbnail[0].path, "Thumbnails", "image");
        const cloudinaryIntro = await uploadToCloudinary(course_intro[0].path, "Introduction_video");

        console.log("uploaded to cloud");

        const new_course = await courses.create({
            course_name: course_title,
            course_description: course_desc,
            thumbnail: cloudinaryThumbnail,
            introductry_video: cloudinaryIntro,
            price: Number(price),
            categories: JSON.parse(categories),
            instructor_id: req.user_id
        });

        if(!new_course){
            throw new Error("course creation failed");
        }

        console.log('data stored');

        return res.status(201).json({
            message: "course created successfully",
            data: new_course
        });

    }
    catch(error){
        return res.status(400).json({
            message: error.message
        });
    }

}

export const updateCourse = async (req, res) => {

    try
    {
        let { course_id, course_title, course_desc, categories, price, course_thumbnail_link, course_intro_link} = req.body;
        const { course_thumbnail, course_intro } = req.files || [];

        if (course_thumbnail && course_thumbnail.length > 0) {
            await deletefromCloudinary(course_thumbnail_link);
            console.log("after deletion of thumbnail")
            const cloudinaryThumbnail = await uploadToCloudinary(course_thumbnail[0].path, "Thumbnails", "image");
            console.log("after upload on cloud")
            course_thumbnail_link = cloudinaryThumbnail;
        }

        console.log("after image before intro")

        if (course_intro && course_intro.length > 0) {
            await deletefromCloudinary(course_intro_link);
            
            const cloudinaryIntro = await uploadToCloudinary(course_intro[0].path, "Introduction_video");
            course_intro_link = cloudinaryIntro;
        }

        console.log("before update");

        const updatedData = await courses.findOneAndUpdate({
            _id : course_id
        }, {
            course_name : course_title,
            course_description : course_desc,
            categories : JSON.parse(categories),
            price : price,
            thumbnail : course_thumbnail_link,
            introductry_video : course_intro_link,
        }); 

        console.log("after update");

        return res.status(200).json({
            success : true,
            message : "data updated successfully"
        })
    }
    catch(error)
    {
        return res.status(400).json({
            success : false,
            message : "not updated success"
        })
    }

}

export async function getCourses(req, res) {

    try
    {

        const { search_query } = req.body;

        const aggregationPipeline = [];

        if (search_query && search_query.trim() !== "") {
          aggregationPipeline.push({
            $match: {
              course_name: { $regex: search_query, $options: "i" },
            },
          });
        }
      
        aggregationPipeline.push(
          {
            $lookup: {
              from: "users",
              localField: "instructor_id",
              foreignField: "_id",
              as: "instructor_details",
            },
          },
          {
            $unwind: "$instructor_details",
          },
          {
            $project: {
              course_name: 1,
              categories: 1,
              price: 1,
              instructor_id: "$instructor_details._id",
              instructor_name: "$instructor_details.full_name",
              instructor_email: "$instructor_details.email",
              thumbnail: 1,
              course_description: 1,
            },
          }
        );
      
        const coursesList = await courses.aggregate(aggregationPipeline);

        if(!coursesList){
            throw new Error("no courses found");
        }

        return res.status(200).json({
            message: "courses list",
            data: coursesList
        });       

    }
    catch(error){
        return res.status(400).json(error);
    }
    
}

export async function getCourseData(req, res) {

    try {
        
        const { course_id } = req.query;

        console.log("Received Course ID:", course_id);

        if (!course_id) {
            return res.status(400).json({ error: "Course ID is required" });
        }

        // Convert course_id to ObjectId
        const objectId = new mongoose.Types.ObjectId(course_id);

        // Fetch Instructor Data Separately
        const userData = await courses.findOne({ _id: course_id }).populate("instructor_id", "full_name email profile_url");

        if (!userData) {
            return res.status(404).json({ error: "Course not found" });
        }

        const courseData = await courses.aggregate([
            { $match: { _id: objectId } },
            
            {
                $lookup: {
                    from: 'sections',
                    localField: '_id',
                    foreignField: 'course_id',
                    as: 'sections'
                }
            },
            { $unwind: { path: '$sections', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'section_contents',
                    let: { sectionId: '$sections._id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$section_id', { $toObjectId: '$$sectionId' }] } } }
                    ],
                    as: 'sections.contents'
                }
            },

            {
                $group: {
                    _id: '$_id',
                    course_name: { $first: '$course_name' },
                    course_description: { $first: '$course_description' },
                    thumbnail: { $first: '$thumbnail' },
                    introductry_video: { $first: '$introductry_video' },
                    price: { $first: '$price' },
                    categories: { $first: '$categories' },
                    instructor_id: { $first: '$instructor_id' },
                    sections: {
                        $push: {
                            _id: '$sections._id',
                            section_name: '$sections.section_name',
                            section_number: '$sections.section_number',
                            contents: '$sections.contents'
                        }
                    }
                }
            }
        ]);

        // Ensure data exists before modifying it
        if (!courseData || courseData.length === 0) {
            return res.status(404).json({ error: "Course not found in aggregation" });
        }

        const isUserEnrolled = await Enrollment.findOne({
            student_id: req.user_id,
            course_id: course_id
        });

        if(isUserEnrolled) {
            courseData[0].isEnrolled = true;
        }
        else {
            courseData[0].isEnrolled = false;
        }

        courseData[0].instructor_name = userData.instructor_id.full_name;
        courseData[0].instructor_email = userData.instructor_id.email;
        courseData[0].instructor_profile = userData.instructor_id.profile_url;

        // console.log(userData);

          console.log("done aggregation");

        if(!courseData){
            throw new Error("no course found");
        }

        return res.status(200).json({
            message: "course Data",
            data: courseData
        });

    } catch (error) {
        
        return res.status(400).json({
            error: error.message
        });

    }

}

export const getCourseStatus = async (req, res) => {
    
    try
    {
        const { course_id } = req.query;

        const coursesEnrolledCount = await Enrollment.find({
            course_id: course_id,
        }).countDocuments();

        return res.status(200).json({
            message: "course status data",
            data: coursesEnrolledCount
        });

    }
    catch(error){
        return res.status(400).json(error);
    }

}

export const getInstructorCourses = async (req, res) => {

    try
    {
        const coursesList = await courses.find({
            instructor_id: req.user_id
        }).populate('instructor_id');

        if(!coursesList){
            throw new Error("no courses found");
        }

        return res.status(200).json({
            message: "courses list",
            data: coursesList
        });

    }
    catch(error){
        return res.status(400).json(error);
    }

}

export const getSearchedCourses = async (req, res) => {

    try {

        const { search, Topic, Price } = req.query;
        let query = {};
    
        if (search) {
          query.title = { $regex: search, $options: "i" }; // Case-insensitive search
        }
    
        if (Topic) {
          const topicsArray = Topic.split(",");
          query.category = { $in: topicsArray }; // Matches any category in the array
        }
    
        if (Price) {
          query.price = { $in: Price.split(",") };
        }
    
        const courseList = await courses.find(query);
        return res.json({ courseList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }

};

export const getCourseCertificateData = async (req, res) => {

    try {
        const { course_id } = req.query;
        const user_id = req.user_id;

        const isCourse = await courses.findById(course_id).populate("instructor_id");

        const isUserEnrolled = await Enrollment.findOne({
            student_id: user_id,
            course_id: course_id
        });

        if(!isUserEnrolled) {
            throw new Error("You are not enrolled in this course");
        }

        const userData = await user.findById(user_id);

        const certificateData = {
            course_name: isCourse.course_name,
            instructor_name: isCourse.instructor_id.full_name,
            student_name: userData.full_name,
            student_email: userData.email,
            instructor_email: isCourse.instructor_id.email,
        }

        if (!isCourse) {
            throw new Error("Course doesn't exist")
        }

        return res.status(200).json({
            status: true,
            message: "Fetched successfully",
            certificateData: certificateData
        });

    }
    catch (error) {
    
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }

}

export const getCoursesBeforeLogin = async(req, res) => {

    try
    {

        const { search_query } = req.body;

        const aggregationPipeline = [];

        if (search_query && search_query.trim() !== "") {
          aggregationPipeline.push({
            $match: {
              course_name: { $regex: search_query, $options: "i" },
            },
          });
        }
      
        aggregationPipeline.push(
          {
            $lookup: {
              from: "users",
              localField: "instructor_id",
              foreignField: "_id",
              as: "instructor_details",
            },
          },
          {
            $unwind: "$instructor_details",
          },
          {
            $project: {
              course_name: 1,
              categories: 1,
              price: 1,
              instructor_id: "$instructor_details._id",
              instructor_name: "$instructor_details.full_name",
              instructor_email: "$instructor_details.email",
              thumbnail: 1,
              course_description: 1,
            },
          }
        );
      
        const coursesList = await courses.aggregate(aggregationPipeline);

        if(!coursesList){
            throw new Error("no courses found");
        }

        return res.status(200).json({
            message: "courses list",
            data: coursesList
        });       

    }
    catch(error){
        return res.status(400).json(error);
    }

}

export const deleteCourse = async (req, res) => {

    try
    {   
        const { course_id } = req.query;

        const deletedCourse = await courses.findOne({
            _id : course_id
        });

        await deletefromCloudinary(deletedCourse.thumbnail);
        await deletefromCloudinary(deletedCourse.introductry_video);

        const sections = await Section.find({
            course_id : course_id
        });

        console.log("before content deletion");

        for(let i = 0; i < sections.length; i++){
            
            await Section_content.deleteMany({
                section_id : sections[i]._id
            });

        }

        console.log("after content deletion");

        await Section.deleteMany({
            course_id : course_id
        });

        await courses.deleteOne({
            _id : course_id
        });

        await Enrollment.deleteMany({
            course_id : course_id
        });

        return res.status(200).json({
            success : true,
            message : "course deletion success"
        });
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : "course deletion failed"
        });
    }

}

export const getCourseEnrollmentInfo = async (req, res) => {

    try {
        
        const { course_id } = req.query;

        const userEnrollmentData = await Enrollment.find({
            course_id : course_id
        }).populate("student_id");

        const formattedData = userEnrollmentData.map((userEn) => ({
            _id : userEn._id,
            full_name : userEn.student_id.full_name,
            email : userEn.student_id.email,
            joined_on : userEn.createdAt
        }));

        return res.status(200).json({
            success : true,
            enrolledUsers : formattedData
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : "enrollment fetching failed"
        });
    }

}

export const handleCategorySend = async (req, res) => {


    try
    {

        const course_category = await course_categories.find({});

        return res.status(200).json({
            success : false,
            categories : course_category
        });

    }
    catch(error)
    {
        return res.status(400).json({
            success: false,
            message : "no exist"
        })
    }

}