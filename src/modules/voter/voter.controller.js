import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { voterModel } from "../../../databases/models/voter.model.js";
import { candidateModel } from "../../../databases/models/candidate.model.js";

export const createVoter = catchAsyncHandler(async (req, res, next) => {
    const isExist = await voterModel.findOne({ personal_id: req.body.personal_id })

    if (isExist) return next(new AppError('This persoanl id is already regsiterd!!', 409))
    const voter = new voterModel({
        personal_id: req.body.personal_id,
        name: req.body.name,
        date_of_birth: req.body.date_of_birth,
        city: req.body.city,
        faceIdImage: req.file.filename,
    });
    await voter.save()
    res.status(200).json({
        status: 'success',
        message: "createVoter Successfully!!",
        data: voter
    })
})

export const deleteVoter = catchAsyncHandler(async (req, res, next) => {
    let isExist = await voterModel.findById(req.params.id)
    if (!isExist) return next(new AppError('This id is not exist', 409))
    isExist.faceImageId = undefined

    const checkVoterInCandidate = await candidateModel.findOne({ voter_id: req.params.id })
    if (checkVoterInCandidate) {
        await voterModel.findByIdAndDelete(req.params.id)
        await candidateModel.findOneAndUpdate({ voter_id: req.params.id }, { $inc: { vote_count: -1 }, $pull: { voter_id: req.params.id } }, { new: true })
    }
    else{
        await voterModel.findByIdAndDelete(req.params.id)
    }

    res.status(200).json({
        status: 'success',
        message: "Deleted Voter Successfully!!",
    })
})

export const getVoter = catchAsyncHandler(async (req, res, next) => {
    const voter = await voterModel.findById(req.params.id).populate({ path: 'candidate_id', select: 'name candidate_code' })
    if (!voter) return next(new AppError('This id is not exist', 404))
    voter.faceIdImage = undefined
    res.status(200).json({
        status: 'success',
        message: "Get Voter Data successfully",
        voter
    })
})

export const getMe = catchAsyncHandler(async (req, res, next) => {
    const voter = await voterModel.findById(req.user._id).populate({ path: 'candidate_id', select: 'name candidate_code' })
    if (!voter) return next(new AppError('This id is not exist', 404))
    voter.faceImageId = undefined
    res.status(200).json({
        status: 'success',
        message: "Get Voter Data successf,ully",
        voter
    })
})

export const getAllVoters = catchAsyncHandler(async (req, res, next) => {
    let voters = await voterModel.find({}, { faceImageId: 0 }).populate({ path: 'candidate_id', select: 'name candidate_code' })
    if (!voters) return next(new AppError('No voters are existed', 409))
    voters.faceImageId = undefined
    res.status(200).json({
        status: 'success',
        message: "get All Voters Successfully!!",
        voters
    })

})


export const updateVoterPhoto = catchAsyncHandler(async (req, res, next) => {
    const isExist = await voterModel.findById(req.params.id)
    if (!isExist) return next(new AppError('his id is not exist!!', 404))
    const voter = await voterModel.findByIdAndUpdate(req.params.id, { image: req.file.filename }, { new: true });
    voter.faceImageId = undefined
    res.status(200).json({
        status: 'success',
        message: "createVoter Successfully!!",
        data: voter
    })
})




