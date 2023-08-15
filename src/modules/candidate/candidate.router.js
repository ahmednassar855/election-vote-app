import express from 'express';
import * as candidate from './candidate.controller.js';
import { allowedTo } from '../auth/auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { uploadSingleFile } from '../../utils/fileUploads.js';

const candidateRouter = express.Router()

candidateRouter.route('/')
.get( candidate.getAllCandidates)  
.post( verifyJwt, allowedTo('admin') , uploadSingleFile('image' , 'candidatePhoto') ,candidate.createCandidate)  // 


candidateRouter.route('/:id')
.delete( verifyJwt, allowedTo('admin') ,  candidate.deleteCandidate) 
.get( verifyJwt, allowedTo('admin' ,'voter') , candidate.getCandidate)

candidateRouter.route('/voting/:id')
.post(verifyJwt, allowedTo('voter') ,candidate.addVoteToCandidate)
.delete( verifyJwt, allowedTo('voter') , candidate.deleteVoteFromCandidate)

//  route for update votestatus
export default candidateRouter