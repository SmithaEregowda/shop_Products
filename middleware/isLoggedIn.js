const jwt=require('jsonwebtoken')
//protecting routes using jwt token authorization
module.exports=(req,res,next)=>{
    let authheader=req.get('Authorization');
    if(!authheader){
        const error=new Error('Authorization Header Not Found!!');
        error.statusCode=401;
        throw error;
    }
    const token=req.get('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken=jwt.verify(token,'veggies')
    }catch(err){
        err.statusCode=500;
        throw err;
    }
    if(!decodedToken){
        const error=new Error('Not Authenticated');
        error.statusCode=401;
        throw error;
    }
    req.userId=decodedToken.userId;
    next();
}