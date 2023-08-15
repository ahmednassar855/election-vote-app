import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { userModel } from './../../../databases/models/user.model.js';

const createVoter = catchAsyncHandler(async (req, res, next) => {
    let user = await userModel.findOne({ personal_id: req.body.personal_id })
    if (user) return next(new AppError('account already exist', 409))
    let result = new userModel(req.body)
    await result.save()
    res.status(200).json({ message: "success", result })
})

const getAllVoters = catchAsyncHandler(async (req, res, next) => {
    let result = await userModel.find({ role: "voter" }).select('-password')
    res.status(200).json({ message: "success", result })
})

const getAllUsers = catchAsyncHandler(async (req, res, next) => {
    let result = await userModel.find({}).select('-password')
    res.status(200).json({ message: "success", result })
})

const getAllCandidates = catchAsyncHandler(async (req, res, next) => {
    let result = await userModel.find({ role: "candidate" }).select('-password')
    res.status(200).json({ message: "success", result })
})

const deleteVoter = catchAsyncHandler(async (req, res, next) => {
    let user = await userModel.findOne({ _id: req.params.id, role: "voter" }).select('personal_id')
    if (!user) return next(new AppError('account is not  exist', 409))
    let result = await userModel.findByIdAndDelete(req.params.id).select('personal_id')
    res.status(200).json({ message: "success", result })
})

const getUser = catchAsyncHandler(async (req, res, next) => {
    let user = req.user
    let result = await userModel.findById(user._id).select('-password')
    if (!result) return next(new AppError('account is not  exist', 409))
    res.status(200).json({ message: "success", result })
})

const activateUser = catchAsyncHandler(async (req, res, next) => {
    let checkUserId = await userModel.findOne({ _id: req.params.id })
    if (!checkUserId) return next(new AppError('account is not  exist', 409))
    if (checkUserId.isActive == false) {
        let result = await userModel.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select('-password')
        res.status(200).json({ message: "success", result })
    } else {
        let result = await userModel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password')
        res.status(200).json({ message: "success", result })
    }
})

const updateUserRole = catchAsyncHandler(async (req, res, next) => {
    const { userType } = req.body;
    let checkUserId = await userModel.findOne({ _id: req.params.id })
    if (!checkUserId) return next(new AppError('account is not  exist', 409))
    let result = await userModel.findByIdAndUpdate(req.params.id, { role: userType }, { new: true }).select('-password')
    res.status(200).json({ message: "success", result })
})

const updatePhotoProflie = catchAsyncHandler ( async ( req , res , next ) => {
    // let user = req.user
    const { image } = req.body
    console.log(req.file);
    console.log(req.user.personal_id);
    let checkUserId = await userModel.findOne({personal_id: req.user.personal_id })
    if (!checkUserId) return next(new AppError('account is not  exist', 409))
    
    let result = await userModel.findByIdAndUpdate(checkUserId._id, { image : req.file.filename }, { new: true }).select('-password')

    res.status(200).json({ message: "uploade image successfully", result })

} )

export {
    createVoter,
    deleteVoter,
    getAllVoters,
    getAllUsers,
    getAllCandidates,
    getUser,
    activateUser,
    updateUserRole,
    updatePhotoProflie
}