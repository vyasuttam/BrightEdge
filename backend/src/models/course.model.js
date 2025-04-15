import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    
    course_name:{
        type:String,
        required:true
    },
    course_description:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    introductry_video:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    categories:{
        type:Array,
        required:true
    },
    instructor_id:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    content_count : {
        type:Number,
        default:0
    }

}, {
    timestamps:true
});

const course_category = new Schema({

    category_name:{
        type:String,
        required:true
    },

}, {
    timestamps:true
});

export const courses = mongoose.model('course', courseSchema);
export const course_categories = mongoose.model('course_category', course_category);