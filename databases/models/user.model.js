import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
    personal_id : {
        type : Number,
        trim : true,
        required: [ true , 'user personal id is required' ],
        unique : [ true , 'personal id must be unique'],
        min : [9999999999999, 'too short id'],
        max : [99999999999999, 'too long id'],
    },
    password : {
        type : String,
        required : true,
        minLength : [ 6 , 'minLength 6 characters' ]
    },
    role : {
        type : String,
        enum : ['voter' , 'admin' , 'candidate'],
        default : 'voter'
    },
    city : {
        type : String
    },
    image : {
        type : String,
        default : 'uploads/blank.jpg'
    },
    passwordChangedAt : Date,
    isVoted : {
        type : Boolean,
        default : false
    },
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