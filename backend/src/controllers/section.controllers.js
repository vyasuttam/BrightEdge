import { Section, Section_content } from "../models/section.model.js";

export async function addSection(req, res) {

    try 
    {   
        const { course_id, section_name, section_number } = req.body;

        console.log(req.body);
        
        if(!course_id){
            throw new Error("course id is required");
        }

        if(!section_name){
            throw new Error("section name is required");
        }

        await Section.create({
            course_id: course_id,
            section_name: section_name,
            section_number: section_number
        });

        return res.status(201).json({
            message: "section created successfully"
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message,
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

        const courseData = await Section.aggregate([
            {
                $match:{
                    course_id: course_id
                },
            },
            {
                $lookup:{
                    from:"section_contents", // section content join
                    localfield:"_id", // section id
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
        return res.status(400).json(error.message);
    }

}

export const getSectionData = async (req, res) => {

    try 
    {
        
        const { course_id } = req.body;

        if(!course_id){
            throw new Error("course id is required");
        }

        const sectionData = await Section.find({
            course_id: course_id
        });

        if(!sectionData){
            throw new Error("no section found");
        }

        return res.status(200).json({
            message: "section data",
            data: sectionData
        });
    }
    catch(error)
    {
        return res.status(400).json(error.message);
    }

}

export const deleteSection = async (req, res) => {

    try {
        
        const { sectionId } = req.params;

        console.log(sectionId);

        if(!sectionId) {
            return res.status(400).json({
                message : "invalid section selected"
            })
        }

        await Section_content.deleteMany({
            section_id : sectionId
        });

        await Section.deleteOne({
            _id : sectionId
        });

        return res.status(200).json({
            success : true,
            message: "section deleted success"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "something went wrong from backend"
        })
    }

}