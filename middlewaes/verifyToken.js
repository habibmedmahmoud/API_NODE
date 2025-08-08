const jwt = require("jsonwebtoken");

 // verify token 
function verifyToken(req,res,next) {
    const autToken = req.headers.authorization;
    if(autToken){

        const token = autToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY); // ✅ FIXED
            req.user = decodedPayload;
            next();
            
        } catch (error) {
            return res.status(401).json({message : " invalide token , acces denied"});
        }
    }
    else{
        return res.status(401).json({message : " no token provided , acces denied"});
    }
}

 // Verify token And Admin 
 function VerifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();

        }
        else {
            return res.status(403).json({message :"not allowed only admin"});
        }
    })
 }

 // Verify token And only user Himself  
 function VerifyTokenAndOnlyUser(req,res,next){
    
    verifyToken(req,res,() => {
        if(req.user.id === req.params.id){
            
            next();

        }
        else {
            return res.status(403).json({message :" not allowed only user himself "});
        }
    })
 }

 // Verify token & Authorization 
 function VerifyTokenAndAuthorization(req,res,next){

    verifyToken(req,res,() => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            
            next();

        }
        else {
            return res.status(403).json({message :" not allowed only user himself or admin "});
        }
    })
 }

 module.exports = {
    verifyToken ,
    VerifyTokenAndAdmin, 
    VerifyTokenAndOnlyUser,
    VerifyTokenAndAuthorization

 }