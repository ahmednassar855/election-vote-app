import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { candidateModel } from "../../../databases/models/candidate.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import { voteModel } from './../../../databases/models/vote.model.js';

export const getAllCandiatesWithITsVoter = catchAsyncHandler(async (req, res, next) => {
    let result = await candidateModel.find({}).populate('voter_id', 'personal_id')
    res.json({ message: result })
})

export const addVote = catchAsyncHandler(async (req, res, next) => {
    let user = req.user
    const { candidateId } = req.params;

    let checkUserIsVoted = await candidateModel.findOne({ voter_id: user._id })
    if (checkUserIsVoted ) return next(new AppError('You are already voted before', 409));
    // console.log(checkUserIsVoted);
    let checkCandidateIsExist = await candidateModel.findOne({ user_id: candidateId })
    if (!checkCandidateIsExist) return next(new AppError('This candiadate id is not exist', 409));

    let result = await candidateModel.findOneAndUpdate({ user_id: candidateId }, { $addToSet: { voter_id: user._id } }, { new: true })
    res.status(200).json({ message: "add vote successfully", result })
})


export const deleteVote = catchAsyncHandler(async (req, res, next) => {
    let user = req.user
    const { candidateId } = req.params;

    let checkUserIsVoted = await candidateModel.findOne({ voter_id: user._id })
    if (!checkUserIsVoted) return next(new AppError('You are not voted before', 409));

    let checkCandidateIsExist = await candidateModel.findOne({ user_id: candidateId })
    if (!checkCandidateIsExist) return next(new AppError('This candiadate id is not exist', 409));

    let result = await candidateModel.findOneAndUpdate({ user_id: candidateId }, { $pull: { voter_id: user._id } }, { new: true })
    res.status(200).json({ message: "Delete vote successfully", result })
})
