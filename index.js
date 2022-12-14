import express from "express";
import multer from "multer";
import cors from "cors"
import fs from "fs"

import mongoose from "mongoose";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js"


import { checkAuth, handleValidationErros } from "./utils/index.js"

import { UserController,PostController } from "./controllers/index.js"



mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>console.log("DB ok"))
    .catch(err=>console.log(err))

const app = express();

const storage = multer.diskStorage({
    destination:(_, __, cb)=> {
        if(!fs.existsSync("uploads")){
            fs.mkdirSync("uploads")
        }
        cb(null, "uploads")
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname);
    },
})



const upload = multer({ storage })


app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'))


app.post("/auth/login",loginValidation,handleValidationErros, UserController.login)

app.post("/auth/register",registerValidation,handleValidationErros,UserController.register)

app.get("/auth/me",checkAuth,UserController.getMe)

app.post("/upload",checkAuth, upload.single("image"),(req,res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})


app.get('/posts',PostController.getAll)
app.get('/tags',PostController.getLastTags)
app.get('/posts/:id',PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation,handleValidationErros,PostController.create)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts/:id',checkAuth,postCreateValidation,handleValidationErros,PostController.update)
app.patch('/saveComment/:id',checkAuth,PostController.updateComment)


app.listen(process.env.PORT || 4444,(err)=>{
    if(!err){
        console.log("Server Ok")
    }
    else console.log(err)
})
