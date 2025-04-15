import mongoose, { Schema } from "mongoose";

const examSchema = new mongoose.Schema({
    exam_name: {
        type: String,
        required: true,
    },
    exam_description: {
        type: String,
        required: true,
    },
    exam_start_time: {
        type: Date,
        required: true,
    },
    exam_duration: {
        type: Number,
        required: true,
    },
    total_questions: {
        type: Number,
        required: true,
    },
    passing_marks: {
        type: Number,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, {
    timestamps: true,
});

const examEnrollmentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    exam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    exam_username : {
        type: String,
        required: true,
    }, 
    exam_password : {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    exam_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    }
}, {
    timestamps: true,
});

const userAnswersSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    exam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    answers: {
        type: Object,
        required: true,
    },
}, {
    timestamps: true,
});

export const ExamResultSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    exam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    correct_answers: {
        type: Number,
        required: true,
    },
    total_answers : {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export const Exam = mongoose.model("Exam", examSchema);
export const Question = mongoose.model("Question", questionSchema);
export const UserAnswers = mongoose.model("UserAnswers", userAnswersSchema);
export const ExamResult = mongoose.model("ExamResult", ExamResultSchema);
export const ExamEnrollment = mongoose.model("ExamEnrollment", examEnrollmentSchema);
