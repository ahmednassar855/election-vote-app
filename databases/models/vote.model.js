import mongoose from "mongoose";

const voteSchema = mongoose.Schema({
    candidate_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },

    voter_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    
}, { timestamps: true })



export const voteModel = mongoose.model('vote', voteSchema)