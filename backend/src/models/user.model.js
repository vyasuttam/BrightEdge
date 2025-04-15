import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    
    full_name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    profile_url:{
        type:String
    },

    verified:{
        type:Boolean,
        default:false
    },

}, {
    timestamps:true
});

const userRolesSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:'user',
    },
    role_name:{
        type:String,
        enum:["student", "instructor"],
        default:"student",
    },
    identityNumber : {
        type:String,
        default:""
    },
    work_experience : {
        type:String,
        default:""
    },
    qualification_doc : {
        type:String,
        default:""
    }
}, {
    timestamps:true
});

export const user = mongoose.model('user', UserSchema);
export const userRoles = mongoose.model('user_roles', userRolesSchema);