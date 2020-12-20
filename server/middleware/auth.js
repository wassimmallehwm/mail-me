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
        console.log(e);
        res.status(500).json({error: err.message});
    }
}

module.exports = auth;

