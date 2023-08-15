import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { candidateModel } from "../../../databases/models/candidate.model.js";
import slugify from "slugify"
import { voterModel } from "../../../databases/models/voter.model.js";

export const createCandidate = catchAsyncHandler(async (req, res, next) => {
    let isFound = await candidateModel.findOne({ candidate_code_slug: slugify(req.body.candidate_code) })
    if (isFound) return next(new AppError('Candidate code is already exist', 404));
    const candidate = new candidateModel({
        name: req.body.name,
        candidate_code: req.body.candidate_code,
        candidate_code_slug: slugify(req.body.candidate_code),
        date_of_birth: req.body.date_of_birth,
        political_party: req.body.political_party,
        agenda_list: req.body.agenda_list,
        image : req.file.filename,
    });
    candidate.agendaSlug = req.body.agenda_list.map(agenda => ({
        summary_slug: slugify(agenda.summary.toLowerCase()),
        abstraction_slug: slugify(agenda.abstraction.toLowerCase())
    }));
    await candidate.save()
    res.status(201).json({
        status: 'success',
        message: "Create Candidate Successfully",
        candidate
    })
})

export const deleteCandidate = catchAsyncHandler(async (req, res, next) => {
    let isFound = await candidateModel.findById(req.params.id)
    if (!isFound) return next(new AppError('This id is not exist', 409))
    await candidateModel.findByIdAndDelete(req.params.id)
    const updateVote = await voterModel.findOneAndUpdate({candidate_id : req.params.id} , { isVote : false , candidate_id : null} , { new : true } )

    res.status(200).json({
        status: 'success',
        message: "Deleted Successfully!!"
    })
})

export const getCandidate = catchAsyncHandler(async (req, res, next) => {
    let result = await candidateModel.findOne({ _id: req.params.id }).populate({ path :'voter_id' ,  select: 'name personal_id'})
    if (!result) return next(new AppError('candidate is not exist', 409))
    res.status(200).json({ message: "success", result })
})

export const getAllCandidates = catchAsyncHandler(async (req, res, next) => {
    let result = await candidateModel.find({}).populate({ path :'voter_id' ,  select: 'name personal_id'})
    if (!result) return next(new AppError('No candidate exists', 409))
    res.status(200).json({ message: "success", result })
})


export const addVoteToCandidate = catchAsyncHandler(async (req, res, next) => {
    //  get this data from req.body untill complete token to get data from login token
    // all id will be replaced by user id when it logged in
    
    const { id } = req.body;
    const voter = await voterModel.findById(id)
    if ( !voter ) return next(new  AppError('This Voter id is not exist' , 404) )
    if ( voter.isVote == true ) return next( new AppError('This Voter is voted before , You can not vote again' , 404) )
    
    // check id is for existing candiadtae an
    let isFound = await candidateModel.findById(req.params.id)
    if (!isFound) return next(new AppError('This id is not exist', 409))
    //  updating steps
    // update vode status in voterModel
    const updateVote = await voterModel.findByIdAndUpdate(id , { isVote : true , candidate_id : req.params.id} , { new : true } )
    const updateCandidate = await candidateModel.findByIdAndUpdate(req.params.id , { $inc : { vote_count : 1 }   ,  $addToSet : { voter_id : id }} , { new : true } )
    res.status(200).json({
        status: 'success',
        message: "Update voting Successfully!!",
        updateVote,
        updateCandidate
    })
})

export const deleteVoteFromCandidate = catchAsyncHandler(async (req, res, next) => {
    //  get this data from req.body untill complete token to get data from login token
    // all id will be replaced by user id when it logged in
    
    const { id } = req.body;
    const voter = await voterModel.findById(id)
    if ( !voter ) return next(new  AppError('This Voter id is not exist' , 404) )
    if ( voter.isVote == false ) return next( new AppError('This Voter is not voted before' , 404) )
    
    // check id is for existing candiadtae an
    let isFound = await candidateModel.findById(req.params.id)
    if (!isFound) return next(new AppError('This id is not exist', 409))
    //  updating steps
    // update vode status in voterModel
    const updateVote = await voterModel.findByIdAndUpdate(id , { isVote : false , candidate_id : null} , { new : true } )
    const updateCandidate = await candidateModel.findByIdAndUpdate(req.params.id , { $inc : { vote_count : -1 }   ,  $pull : { voter_id : id }} , { new : true } )
    res.status(200).json({
        status: 'success',
        message: "Update voting Successfully!!",
        updateVote,
        updateCandidate
    })
})



