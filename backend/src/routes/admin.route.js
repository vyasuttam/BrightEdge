import { Router } from "express";
import { adminAuth, adminlogin, deleteExamAdmin, deleteUser, getAdminCourses, getAdminStats, getUsers } from "../controllers/admin.controllers.js";
import { verifyAdmin, verifyJWT } from "../middleware/verifyJWT.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { admin } from "../models/admin.model.js";
import { deleteCourse } from "../controllers/course.controllers.js";
import { deleteExam, getAllExams } from "../controllers/exam.controllers.js";

export const adminRouter = Router();

adminRouter.post("/admin-login", adminlogin);

adminRouter.get('/checkAuth', adminAuth);
// adminRouter.post("/admin", adminLogin);

adminRouter.get('/stats', verifyAdmin, getAdminStats);
adminRouter.get('/getCourses',verifyAdmin, getAdminCourses);

adminRouter.get('/getExams', verifyAdmin, getAllExams);

adminRouter.get('/deleteCourse', verifyAdmin, deleteCourse);
adminRouter.get('/deleteExam/:examId', verifyAdmin, deleteExamAdmin);

adminRouter.get('/getUsers', verifyAdmin, getUsers);
adminRouter.get('/deleteUser', verifyAdmin, deleteUser);