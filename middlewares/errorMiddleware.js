const errorMiddleware=(err,req,res,next)=>{
  try {
    let error={...err};
    
    error.message=err.message;
    console.error(err);

    // mongoose bad objectID error
    if(err.name==='CastError'){
        const message=`Resource not found with id ${err.value}`,
        error = new Error(message);
        error.statusCode=404
    }

    // mongoose duplicate key error
    if(err.code===11000){
        const message=`Duplicate field value entered: ${field}`;
        error=new Error(message);
        error.statusCode=400
    }

    // mongoose validation error
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message)
        error=new Error(message.join(', '))
        error.statusCode=400 
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message='Invalid token'
        error = new Error(message);
        error.statusCode=401
    }

    if (err.name === 'TokenExpiredError') {
        const message='Token expired'
        error = new Error(message);
        error.statusCode=401
    }

    res.status(error.statusCode || '500').json({success : false,error: error.message || 'Server Error'});
  } catch(error) {
    next(error);
  }
};

export default errorMiddleware;