import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({

    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

    otpNumber:{
        type:String,
        required:true
    },
    expires:{
        type:Date,
        required:true
    }
}, {
    timestamps:true
});

export const otpModel = mongoose.model("otp", otpSchema);