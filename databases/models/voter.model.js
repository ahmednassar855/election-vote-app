import mongoose from "mongoose";

const voterSchema = mongoose.Schema({
    personal_id: {
        type: Number,
        trim: true,
        required: [true, 'voter personal id is required'],
        unique: [true, 'voter id must be unique'],
        min: [9999999999999, 'too short id'],
        max: [99999999999999, 'too long id'],
    },
    name: {
        type: String,
        trim: true,
        required: [true, "The name is required"],
        minLength: [2, 'too short name']
    },
    city: String,
    date_of_birth: {
        type: Date,
    },
    isVote: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    faceIdImage: {
        type: String,
    },
    faceIdImageVerification: {
        type: String,
        select : false
    },
    candidate_id: [{
        type: mongoose.Types.ObjectId,
        ref: "candidate"
    }],
    role : {
        type : String,
        enum : ['user' , 'voter'],
        default : 'voter'
    },
    refreshToken:{ type: String}
    
}, { timestamps: true })


voterSchema.post('init', (doc) => {
    doc.image = process.env.BASE_URL + "/voterPhoto/" + doc.image
})

// voterSchema.post('init', (doc) => {
//     doc.faceIdImage = doc.faceIdImage ? process.env.BASE_URL + "/voterPhoto/" + doc.faceIdImage : null
// })

voterSchema.post('init', function () {
    if (this._query && this._query._fields && !this._query._fields.faceIdImage) {
        this.faceIdImage = null;
    } else if (this.faceIdImage) {
        this.faceIdImage = process.env.BASE_URL + "/voterPhoto/" + this.faceIdImage;
    }
});

export const voterModel = mongoose.model('voter', voterSchema)