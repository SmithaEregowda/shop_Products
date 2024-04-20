const express=require('express');
const mongoose=require('mongoose')
const app=express();
const userRoutes=require('./routes/auth')
const productRoutes=require('./routes/products');
const cartRoutes=require('./routes/cart')
const wishlistRoutes=require('./routes/wishlist')
const orderRoutes=require('./routes/order')
const paymentRoutes=require('./routes/payment');
const ProductReqRoutes=require('./routes/reqsProd')
require('dotenv').config()
const BodyParser=require('body-parser')
const ErrorHandler=require('./middleware/errorHandler')
const multer=require('multer');
const path=require('path');
const cors=require('cors')

//to parse incoming req
 app.use(BodyParser.json())

app.use(BodyParser.urlencoded({ extended: true }));

const ImageStorage=multer.diskStorage({
  destination:'profileImages',
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

const productImageStorage=multer.diskStorage({
  destination:'productImages',
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

app.use(cors())
//static path to access profile images
app.use('/profileImages',express.static(path.join(__dirname,'profileImages')))

console.log("Image Path",process.env.PRODUCT_IMAGES_PATH)

app.use(`/${process.env.PRODUCT_IMAGES_PATH}`,express.static(path.join(__dirname,`${process.env.PRODUCT_IMAGES_PATH}`)))

//allowing headers from clients
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
      //*:--->it will allow access for all the clients
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,PATCH');

    res.setHeader('Access-Control-Allow-Headers','*');
    //allows the headers sent by the client
  next();
})

//user related routes needs to go for userRoutes
app.use('/api/user',
multer({
  storage:ImageStorage,
  limits:{
    fileSize:1000000
  }
}).single('imgurl'),userRoutes)

//products related routes
app.use('/api/products',
multer({
  storage:productImageStorage,
  limits:{
    fileSize:1000000
  }
}).single('productImg'),
productRoutes)

app.use('/api/cart',cartRoutes)

app.use('/api/wishlist',wishlistRoutes)

app.use('/api/orders',orderRoutes)

app.use('/api',paymentRoutes)

app.use('/api',ProductReqRoutes)

//error handling middleware
app.use(ErrorHandler)

//connecting data base
const connectDatabase=async()=>{
   try{
    const result = await mongoose.connect(
      `mongodb+srv://smitha:smitha123@cluster0.pmlfv.mongodb.net/vegetableShop?retryWrites=true&w=majority`
      );
    if(!result){
        const error=new Error('Failed to connect Database');
        throw error;
    }
    console.log(process.env.PORT)
    app.listen(process.env.PORT||8080)
    console.log('Database Connected!!')
   }catch(err){
    console.log('Error:---->',err)
   }
   
}

connectDatabase();
