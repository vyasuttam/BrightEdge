import mongoose,{ Schema } from "mongoose";

const EnrollmentSchema = new Schema({

    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "courses"
    },

    student_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    payment_id : {
        type : String,
        ref : "Payment",
        required : true
    }

}, {
    timestamps : true
});

export const Enrollment = mongoose.model("enrollment", EnrollmentSchema);