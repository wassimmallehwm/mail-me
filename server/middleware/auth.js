const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if(!token){
            return res.status(401).json({msg : "Not Authorized !"})
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified){
            return res.status(401).json({msg : "Not Authorized !"})
        }
        req.user = verified._id;
        next();
    } catch(e){
        if(e instanceof jwt.TokenExpiredError){
            if(req.originalUrl === '/users/refresh'){
                next();
            } else {
                return res.status(401).json({msg : "token_expired"})
            }
        } else {
            res.status(500).json({error: e});
        }
    }
}


module.exports = auth;

