import { voteTimeModel } from "../../../databases/models/votingTime.model.js";
import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';


export const startVoting = catchAsyncHandler(async (req, res, next) => {
    const { hour_duration } = req.body
    let start_at = Date.now()
    let end_at = Date.now() + hour_duration
    let result = new voteTimeModel({ start_at, end_at, voting_status: true, hour_duration })
    await result.save()
    res.json({ message: "start voting", result })
})

export const endVoting = catchAsyncHandler(async (req, res, next) => {
    const { id } = req.body
    let result = await voteTimeModel.findByIdAndUpdate(id, { start_at: Date.now(), end_at: Date.now(), voting_status: false, hour_duration: 0 }, { new: true })
    if (!result) return new AppError("Erorr voting", 404)
    res.json({ message: "end voting", result })
})

export const getLastVoting = catchAsyncHandler(async (req, res, next) => {
    let result = await voteTimeModel.find().sort({ _id: -1 }).limit(1);
    if (!result) return new AppError("Erorr voting", 404)
    res.json({ message: "last voting time", result })
})
