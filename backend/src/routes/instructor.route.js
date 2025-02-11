import { Router } from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { addCouse } from '../controllers/course.controllers.js';
import { addSection } from '../controllers/section.controllers.js';
import { addSectionContent } from '../controllers/sec_content.controllers.js';
import { upload } from '../middleware/multer.js';
import { requireInstructorRole } from '../middleware/instructorRole.js';

export const instructorRouter = Router();

instructorRouter.post('/addCourse', verifyJWT, requireInstructorRole, upload.fields([
    { name: 'course_thumbnail', maxCount: 1 },
    { name: 'course_intro', maxCount: 1 }
]) ,addCouse);

instructorRouter.post('/addSection', verifyJWT, requireInstructorRole, addSection);
instructorRouter.post('/addSectionContent', verifyJWT, requireInstructorRole, upload.single('content_asset'), addSectionContent);
