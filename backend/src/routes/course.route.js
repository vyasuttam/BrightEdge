import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { getCourseCertificateData, getCourseData, getCourses, getCourseStatus, getSearchedCourses, handleCategorySend } from "../controllers/course.controllers.js";
import { getUserProgress, updateCourseProgress } from "../controllers/progress.controllers.js";
import { getEnrolledCourses, studentEnrollment } from "../controllers/enrollment.controllers.js";

export const courseRouter = Router();

courseRouter.get('/getCourseData', verifyJWT, getCourseData);

courseRouter.post('/updateProgress', verifyJWT, updateCourseProgress);
courseRouter.post('/getUserProgress', verifyJWT, getUserProgress);

courseRouter.post("/getCourses", getCourses);

courseRouter.get('/enrollment', verifyJWT, studentEnrollment);
courseRouter.get('/getEnrolledCourses', verifyJWT, getEnrolledCourses);

courseRouter.get("/getCourseStatus", verifyJWT, getCourseStatus);

courseRouter.get('/', getSearchedCourses);

courseRouter.get('/course-certificate-data', verifyJWT, getCourseCertificateData);

courseRouter.get('/loadCategory', verifyJWT, handleCategorySend);
