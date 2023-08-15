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
    agenda_list: [{
        summary: {
            type: String,
        },
        abstraction: {
            type: String,
        }
    }],
    agendaSlug: [{
        summary_slug: {
            type: String
        },
        abstraction_slug: {
            type: String
        }
    }],
    vote_count: {
        type: Number,
        default: 0
    },
    voter_id: [{
        type: mongoose.Types.ObjectId,
        ref: "voter"
    }],
    image: { 
        type :String
    }
}, { timestamps: true })

candidateSchema.post('init' ,(doc) => {
    doc.image= process.env.BASE_URL+"/candidatePhoto/"+doc.image
})


export const candidateModel = mongoose.model('candidate', candidateSchema)