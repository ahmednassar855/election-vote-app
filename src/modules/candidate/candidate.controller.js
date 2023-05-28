import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { candidateModel } from "../../../databases/models/candidate.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import slugify from "slugify"

export const createCandidateProfile = catchAsyncHandler(async (req, res, next) => {
    const { name, code, agenda, birthday, political_party } = req.body;

    let isFound = await userModel.findOne({ _id: req.params.id, role: "candidate", isActive: true }).select('-password');
    if (!isFound) return next(new AppError('sorry account is not exist or its not a candidate', 409));

    let exist = await candidateModel.exists({ $or: [{ user_id: req.params.id }, { candidate_code: code }] }).select('-password');
    if (exist) return next(new AppError('account and / or candidate code is already exist', 404));

    let result = new candidateModel({
        name,
        candidate_code: code,
        candidate_code_slug: slugify(code),
        date_of_birth: birthday,
        political_party,
        agenda,
        agendaSlug: slugify(agenda),
        user_id: req.params.id,
    })
    await result.save()
    res.status(201).json({ message: "success", result })
})

export const updateCandidate = catchAsyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    req.body.agendaSlug = slugify(req.body.agenda)
    req.body.candidate_code = slugify(req.body.code)

    let isFound = await candidateModel.findOne({ personal_id: req.params.personal_id })
    if (!isFound) return next(new AppError('account is not exist', 409))
    let result = await candidateModel.findByIdAndUpdate(req.params.id, {})
    res.status(200).json({ message: "success", result })
})

export const deleteCandidateProfile = catchAsyncHandler(async (req, res, next) => {
    let isFound = await candidateModel.findOne({ _id: req.params.id })
    if (!isFound) return next(new AppError('This id is not exist', 409))
    let result = await candidateModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "success", result })
})

export const getCandidate = catchAsyncHandler(async (req, res, next) => {
    let result = await candidateModel.findOne({ _id: req.params.id })
    if (!result) return next(new AppError('candidate is not exist', 409))
    res.status(200).json({ message: "success", result })
})

export const getAllCandidates = catchAsyncHandler(async (req, res, next) => {
    let result = await candidateModel.find({})
    if (!result) return next(new AppError('No candidate exists', 409))
    res.status(200).json({ message: "success", result })
})


