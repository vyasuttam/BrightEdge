import { section } from "../models/section.model.js";

export async function addSection(req, res) {

    try 
    {
        
        const { course_id, section_name } = req.body;
        
        if(!course_id){
            throw new Error("course id is required");
        }

        if(!section_name){
            throw new Error("section name is required");
        }

        await section.create({
            course_id: course_id,
            section_name: section_name
        });

        return res.status(201).json({
            message: "section created successfully"
        });

    } catch (error) {
        return res.status(400).json({
            error,
            message: "this is errorr"
        });
    }

};

export async function getSections(req, res) {

    try 
    {
        
        const { course_id } = req.body;

        if(!course_id){
            throw new Error("course id is required");
        }

        const courseData = await section.aggregate([
            {
                $match:{
                    course_id: course_id
                },
            },
            {
                $lookup:{
                    from:"section_contents", // section content join
                    localfeild:"_id", // section id
                    foreignField:"section_id",
                    as:"course_content"
                }
            },
            {
                $sort: {
                    "course_content.position": 1
                }
            }
          ]);

        if(!courseData){
            throw new Error("no sections found");
        }

        return res.status(200).json({
            message: "sections list",
            data: courseData
        });


    } catch (error) {
        return res.status(400).json(error);
    }

}