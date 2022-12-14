const jsontoken=require('jsonwebtoken')
module.exports=(req,res,next)=>{
    const authHeader=req.get('Authorization')
    if(!authHeader){
        const error=new Error('Authorization Header Not Found!!');
        error.statusCode=401;
        throw error;
    }
    const token=req.get('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken=jsontoken.verify(token,'veggies')
    }catch(err){
        err.statusCode=500;
        throw err;
    }
    if(!decodedToken){
        const error=new Error('Invalid Authorization');
        error.statusCode=401;
        throw error; 
    }
    req.userId=decodedToken.userId;
    next();
}