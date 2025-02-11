import { z } from 'zod';
import { section_content } from '../models/section.model.js';

const sectionContentSchema = z.object({
    section_id: z.string(),
    content_name: z.string().min(5, "content name must be of length 5").max(50, "content name must be of length 50"),
    content_media_type: z.enum(['image','mp4', 'pdf']),
    content_url: z.string(),
    position: z.number().int().positive("position must be a positive number"),
    is_preview: z.boolean(),
    duration: z.number().int().positive("duration must be a positive number")
});

export async function addSectionContent(req, res) {

    try {
        
        const { section_id, content_name, position, is_preview, duration } = req.body;

        const content_asset = req.file;

        const sectionData = sectionContentSchema.safeParse({
            section_id,
            content_name,
            content_media_type:content_asset.mimetype.split('/')[0],
            content_url: content_asset.path,
            position:Number(position),
            is_preview: Boolean(is_preview),
            duration: Number(duration)
        });

        console.log(sectionData.error);

        if(!sectionData.success){
            throw new Error(sectionData.error.issues[0].message);
        }

        await section_content.create({
            section_id: section_id,
            content_name: content_name,
            content_media_type: content_asset.mimetype.split('/')[0],
            content_url: content_asset.path,
            position: position,
            is_preview: is_preview,
            duration: duration
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

        const contentList = await section_content.find({
            section_id: section_id
        });

        contentList = contentList.sort((content1, content2) => content1.position - content2.position);

        if(!contentList){
            throw new Error("no content found");
        }

        return res.status(200).json({
            message: "content list",
            data: contentList
        });

    } catch (error) {
        
        return res.status(400).json(error);

    }

}