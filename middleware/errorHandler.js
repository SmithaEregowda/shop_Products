module.exports=(error,req,res,next)=>{
    if(error){
        console.log('-------- Error Occured -----------')
        const status=error.statusCode||500;
        const message=error.message;
        const data=error.data//original error data from midlewares
        res.status(status).json({
          message:message,
          status:status,
          data:data
        })
    }
}