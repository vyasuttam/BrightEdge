export function adminOnly(req, res, next) {

    if(req.user_role != "admin") {
        return res.status(400).json({
            message : "only admin route"
        });
    }

    next();
}