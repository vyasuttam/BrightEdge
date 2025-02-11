import { z } from 'zod';
import { section } from '../models/section.model.js';
import { courses } from '../models/course.model.js';

const courseSchema = z.object({
    course_name: z.string().min(5, "course name must be of length 5").max(50, "course name must be of length 50"),
    course_desc: z.string().min(5, "course description must be of length 5").max(500, "course description must be of length 500"),
    course_thumbnail: z.string().url("course thumbnail must be a valid url"),
    course_intro: z.string().url("course intro must be a valid url"),
    category_id: z.string().uuid("category id must be a valid uuid"),
    price: z.number().int().positive("price must be a positive number"),
    intructor_id: z.string().uuid("instructor id must be a valid uuid")
});

export async function addCouse(req, res) {

    try{

        const { course_name, course_desc, category_id, price, instructor_id } = req.body;

        const { course_thumbnail, course_intro } = req.files;

        console.log(course_thumbnail, course_intro);

        console.log('data got')

        // const courseData = courseSchema.safeParse({
        //     course_name,
        //     course_desc,
        //     course_thumbnail:course_thumbnail[0].path,
        //     course_intro:course_intro[0].path,
        //     category_id,
        //     price,
        //     intructor_id
        // });

        // if(!courseData.success){
        //     throw new Error(courseData.error.issues[0].message);
        // }

        console.log('data parsed');

        const new_course = await courses.create({
            course_name: course_name,
            course_description: course_desc,
            thumbnail: course_thumbnail[0].path,
            introductry_video: course_intro[0].path,
            price: price,
            category_id: category_id,
            instructor_id: instructor_id
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
            error,
            message: "this is errorr"
        });
    }

}

export async function getCourses(req, res) {

    try
    {

        const { search_query } = req.body;

        let coursesList;

        if(search_query == "")
        {
            coursesList = await courses.find({});
        }
        else
        {
            coursesList = await courses.find({
                course_name: {
                    $regex: search_query,
                    $options: 'i'
                }
            });
        }

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

export async function getCourseInfo(req, res) {

    try {
        
        const { course_id } = req.body;

        if(!course_id){
            throw new Error("course id is required");
        }

        const courseInfo = await courses.findOne({
            course_id: course_id
        });

        const sections = await section.aggregate([
            {
                $lookup:{

                }
            }
        ])

        if(!courseInfo){
            throw new Error("no course found");
        }

        return res.status(200).json({
            message: "course info",
            data: courseInfo
        });

    } catch (error) {
        
        return res.status(400).json(error);

    }

}