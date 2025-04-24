import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { requireInstructorRole } from "../middleware/instructorRole.js";
import { createExam, getAllExams, addQuestion, getAllQuestions, getExamResult, submitAnswers, getConductorExams, updateQuestion, getExamData, isExamStarted, enrollInExam, getEnrolledExams, deleteExam, updateExam, submissionInfo, handleEnrolledExamLogin, deleteExamQuestion } from "../controllers/exam.controllers.js";

export const examRouter = Router();

examRouter.post("/create-exam", verifyJWT, requireInstructorRole, createExam);
examRouter.get("/get-exams", verifyJWT, getAllExams);
examRouter.get("/get-exam/:examId", verifyJWT, getExamData);
examRouter.get("/get-my-exams", verifyJWT, getConductorExams);
examRouter.post("/add-question", verifyJWT, requireInstructorRole, addQuestion);
examRouter.post("/get-questions", verifyJWT, getAllQuestions);
examRouter.put("/update-exam-question", verifyJWT, updateQuestion);
examRouter.get("/deleteQuestion/:questionId", verifyJWT, deleteExamQuestion)

// examRouter.get("/get-upcoming-exams", verifyJWT, getUpcomingExams);
// examRouter.get("/get-completed-exams", verifyJWT, getPastExams);

examRouter.get("/user-exam-status/:examId", verifyJWT, isExamStarted);

examRouter.post("/enroll-exam", verifyJWT, enrollInExam);
examRouter.get("/get-enrolled-exam", verifyJWT, getEnrolledExams);
examRouter.post("/get-enrolled-exam-login", verifyJWT, handleEnrolledExamLogin); // when user login into exam

examRouter.get("/get-user-completed-exams", verifyJWT, getExamResult); //temp
examRouter.get("/get-user-pending-exams", verifyJWT, getExamResult); //temp

examRouter.post("/submit-exam", verifyJWT, submitAnswers);
examRouter.post("/get-exam-result", verifyJWT, getExamResult);

examRouter.get("/get-exam-submissions/:examId", verifyJWT, submissionInfo);

examRouter.put("/update-exam/:examId", verifyJWT, requireInstructorRole, updateExam);
examRouter.get("/delete-exam/:examId", verifyJWT, requireInstructorRole, deleteExam);