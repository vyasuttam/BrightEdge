export function requireInstructorRole(req, res, next) {
  
    if (!req.user_id || req.user_role !== 'instructor') 
    {
        return res.status(403).send('Access denied');
    }

    next();
}