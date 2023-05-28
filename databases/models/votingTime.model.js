import mongoose from "mongoose";


// name , code , image ,
const voteTimeSchema = mongoose.Schema({
    voting_status :{
        type : Boolean,
        default : false 
    },
    hour_duration:{
        type : Number,
        default : 0
    },
    start_at: [{
        type: Date,
    }],
    end_at: [{
        type: Date,
    }],
    
}, { timestamps: true })



export const voteTimeModel = mongoose.model('voteTime', voteTimeSchema)