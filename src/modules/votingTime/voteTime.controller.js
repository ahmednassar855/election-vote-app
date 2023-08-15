import { voteTimeModel } from "../../../databases/models/votingTime.model.js";
import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';


export const startVotingTime = catchAsyncHandler(async (req, res, next) => {
    const { hour_duration } = req.body

    // Get the current date and time
    const currentDate = new Date();

    // Set the number of hours to add

    // Add the specified number of hours to the current date
    const newDate = new Date(currentDate.getTime() + hour_duration * 60 * 60 * 1000);

    // Get the year, month, and day of the new date
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Month value is zero-based, so add 1
    const day = newDate.getDate();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();

     
    // Log the new date with the specified hour duration
    console.log(`New date after ${hour_duration} hours: ${year}-${month}-${day}-${minutes}-${seconds}`);
    console.log(newDate);

    let result = new voteTimeModel({ start_at : currentDate, end_at : newDate, voting_status: true, hour_duration })
    await result.save()
    res.json({ message: "start voting", result })
})

export const endVotingTime = catchAsyncHandler(async (req, res, next) => {
    const { id } = req.body
    console.log(id);
    let result = await voteTimeModel.findOneAndUpdate({_id : req.body.id}, { start_at: Date.now(), end_at: Date.now(), voting_status: false, hour_duration: 0 }, { new: true })
    if (!result) return new AppError("Erorr voting", 404)
    res.json({ message: "end voting", result })
})

export const deleteVotingTime = catchAsyncHandler(async (req, res, next) => {
    const { id } = req.body
    console.log(id);
    let result = await voteTimeModel.findOneAndUpdate({_id : req.body.id}, { start_at: Date.now(), end_at: Date.now(), voting_status: false, hour_duration: 0 }, { new: true })
    if (!result) return new AppError("Erorr voting", 404)
    res.json({ message: "end voting", result })
})
export const getLastVotingTime = catchAsyncHandler(async (req, res, next) => {
    let result = await voteTimeModel.find().sort({ _id: -1 }).limit(1);
    if (!result) return new AppError("Erorr voting", 404)
    res.json({ message: "last voting time", result })
})
