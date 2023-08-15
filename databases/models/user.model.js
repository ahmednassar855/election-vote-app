import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : [true , "Please Enter your email!!"],
        unique : [true , "This email is registerd before!!"]
    },
    password : {
        type : String,
        required : true,
        minLength : [ 6 , 'minLength 6 characters' ],
    },
    role : {
        type : String,
        enum : ['user' , 'admin'],
        default : 'user'
    },
    image : {
        type : String,
        default : 'uploads/blank.jpg'
    },
    passwordChangedAt : Date,
    isActive : {
        type : Boolean,
        default : false
    },
    refreshToken:{ type: String}
   
} , { timestamps : true })

userSchema.pre('save' , function () {
    this.password = bcrypt.hashSync(this.password , 7)
})

userSchema.pre('findOneAndUpdate' , function () {
    if(this._update.password)  this._update.password = bcrypt.hashSync(this._update.password , 7)
})
userSchema.post('init' ,(doc) => {
    doc.image= process.env.BASE_URL+"/userPhoto/"+doc.image
})


export const userModel = mongoose.model('user' , userSchema)