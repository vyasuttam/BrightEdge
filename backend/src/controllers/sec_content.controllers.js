import { z } from 'zod';
import { Section, Section_content } from '../models/section.model.js';
import { deletefromCloudinary, uploadToCloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import { courses } from '../models/course.model.js';
import { uploadToAppWrite } from '../config/Appwrite.js';

const sectionContentSchema = z.object({
    section_id: z.string(),
    content_name: z.string().min(5, "content name must be of length 5").max(50, "content name must be of length 50"),
    content_media_type: z.string(),
    content_url: z.string(),
    position: z.number().int().positive("position must be a positive number"),
    duration: z.number().int().positive("duration must be a positive number")
});

export async function addSectionContent(req, res) {

    try {
        
        const { section_id, content_name, content_media_type, position, duration, content_url } = req.body;

        console.log(req.body);

        const sectionObj = await Section.findOne({
            _id : section_id
        });

        if(content_url){

            console.log("content url", content_url);
            
            await Section_content.create({
                section_id: section_id,
                content_name: content_name,
                content_media_type: content_media_type,
                content_url: content_url,
                position: Number(position),
            });
            
            await courses.updateOne({
                _id : sectionObj.course_id
            }, {
                $inc : {
                    content_count : 1
                }
            });

            return res.status(201).json({
                message: "content created successfully"
            });

        }
        
        
        const content_asset = req.file;
        
        let url = "";

        if(content_media_type == "document"){
            url = await uploadToAppWrite(content_asset);
        }
        else if(content_media_type == "video"){
            url = await uploadToCloudinary(content_asset.path, "Contents");
        }

        if(!url){
            console.log("not uploaded to cloudinary", url);
            fs.unlinkSync(content_asset.path);
            console.log("file removed from local pc");
        }

        const sectionData = sectionContentSchema.safeParse({
            section_id,
            content_name,
            content_media_type:content_media_type,
            content_url: url,
            position:Number(position),
            duration: Number(duration)
        });

        console.log(sectionData.error);

        if(!sectionData.success){
            throw new Error(sectionData.error.issues[0].message);
        }

        await Section_content.create({
            section_id: section_id,
            content_name: content_name,
            content_media_type: content_media_type,
            content_url: url,
            position: Number(position),
            duration: Number(duration)
        });

        await courses.updateOne({
            _id : sectionObj.course_id
        }, {
            $inc : {
                content_count : 1
            }
        });

        return res.status(201).json({
            message: "content created successfully"
        });

    } catch (error) {
        
        return res.status(400).json({
            error:error.message,
            message: "this is errorr"
        });

    }

}

export async function getSectionContent(req, res) {

    try {
        
        const { section_id } = req.body;

        if(!section_id){
            throw new Error("section id is required");
        }

        let contentList = await Section_content.find({
            section_id: section_id
        });

        contentList = contentList.sort((content1, content2) => content1.position - content2.position);

        return res.status(200).json({
            message: "content list",
            data: contentList
        });

    } catch (error) {
        
        return res.status(400).json(error.message);

    }

}

export const deleteContent = async (req, res) => {

    try {
        
        const { content_id } = req.params;

        if(!content_id){
            throw new Error("content id is required");
        }

        const contentObj = await Section_content.findOne({
            _id : content_id
        });

        if(!contentObj){
            throw new Error("content not found");
        }

        await Section_content.deleteOne({
            _id : content_id
        });

        const SectionObj = await Section.findOne({
            _id : contentObj.section_id
        });

        await courses.updateOne({
            _id : SectionObj.course_id
        }, {
            $inc : {
                content_count : -1
            }
        });

        await deletefromCloudinary(contentObj.content_url);

        return res.status(200).json({
            message: "content deleted successfully"
        });

    } catch (error) {
        
        return res.status(400).json(error.message);

    }

}