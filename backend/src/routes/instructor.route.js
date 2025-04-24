import { Router } from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { addCouse, deleteCourse, getCourseEnrollmentInfo, getInstructorCourses, updateCourse } from '../controllers/course.controllers.js';
import { addSection, deleteSection, getSectionData } from '../controllers/section.controllers.js';
import { addSectionContent, deleteContent, getSectionContent } from '../controllers/sec_content.controllers.js';
import { upload } from '../middleware/multer.js';
import { requireInstructorRole } from '../middleware/instructorRole.js';
import { getInstructorInfo } from '../controllers/user.controllers.js';

export const instructorRouter = Router();

instructorRouter.post('/addCourse', verifyJWT, requireInstructorRole, upload.fields([
    { name: 'course_thumbnail', maxCount: 1 },
    { name: 'course_intro', maxCount: 1 },
    // { name: "content_files", maxCount: 50 }
]) ,addCouse);

instructorRouter.put("/updateCourse", verifyJWT, requireInstructorRole, upload.fields([
    { name: 'course_thumbnail', maxCount: 1 },
    { name: 'course_intro', maxCount: 1 },
]), updateCourse);

instructorRouter.get("/deleteCourse", verifyJWT, requireInstructorRole, deleteCourse);

instructorRouter.get("/getInstructorCourses", verifyJWT, requireInstructorRole, getInstructorCourses);

instructorRouter.post('/addSection', verifyJWT, requireInstructorRole, addSection);
instructorRouter.post('/getSections', verifyJWT, requireInstructorRole, getSectionData);

instructorRouter.post('/addSectionContent', verifyJWT, requireInstructorRole, upload.single('content_asset'), addSectionContent);
instructorRouter.post('/getSectionContent', verifyJWT, requireInstructorRole, getSectionContent);

instructorRouter.get('/deleteSection/:sectionId', verifyJWT, requireInstructorRole, deleteSection)

instructorRouter.get("/deleteSectionContent/:content_id", verifyJWT, requireInstructorRole, deleteContent);

instructorRouter.get('/getCourseEnrollments', verifyJWT, requireInstructorRole, getCourseEnrollmentInfo);

instructorRouter.get('/getInstructorInfo', verifyJWT, getInstructorInfo);