export function userRole(req, res) {

    console.log('got req');

    // console.log(req.user_role);

    return res.status(200).json({
        role: req.user_role
    });
}

export function requireInstructorRole(req, res, next) {
  
    if (!req.user_id || req.user_role !== 'instructor') 
    {
        return res.status(403).send('Access denied');
    }

    next();
}