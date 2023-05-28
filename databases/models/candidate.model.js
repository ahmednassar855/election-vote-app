import mongoose from "mongoose";

const candidateSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "The name is required"],
        minLength: [2, 'too short name']
    },
    candidate_code: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "The name is required"],
        minLength: [2, 'too short name']
    },
    candidate_code_slug: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    date_of_birth: {
        type: Date,
    },
    political_party: {
        type: String,
        enum: ['democrate', 'republican'],
        default: "democrate",
        required: [true, 'political Party name is required'],
    },
    agenda: [{ type: String }],
    agendaSlug: [{ type: String }],
    vote_count: {
        type: Number,
        default: 0
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    voter_id: [{
        type: mongoose.Types.ObjectId,
        ref: "user"
    }],
    vote_count : {
        type : Number,
        default : 0,
    }
    
}, { timestamps: true })


export const candidateModel = mongoose.model('candidate', candidateSchema)