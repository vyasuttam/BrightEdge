import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema({

    section_name:{
        type:String,
        required:true
    },
    course_id:{
        type:Schema.Types.ObjectId,
        ref:'course',
        required:true
    },
    section_number: {
        type: Number,  // Determines the order of sections
        required: true
    }

}, {
    timestamps:true
});

const sectionContentSchema = new Schema({

    content_name:{
        type:String,
        required:true
    },
    content_media_type:{
        type:String,
        required:true
    },
    content_url:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
    },
    duration:{
        type:Number,
    },
    section_id:{
        type:Schema.Types.ObjectId,
        ref:'section',
        required:true
    }

}, {
    timestamps:true
});

export const Section = mongoose.model('section', sectionSchema);
export const Section_content = mongoose.model('section_content', sectionContentSchema);
