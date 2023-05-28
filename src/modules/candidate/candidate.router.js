import express from 'express';
import * as candidate from './candidate.controller.js';
import { allowedTo } from '../auth/auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';

const candidateRouter = express.Router()

candidateRouter.route('/')
.get( verifyJwt,  allowedTo('admin' , 'voter'),candidate.getAllCandidates)


candidateRouter.route('/:id')
.post( verifyJwt , allowedTo('admin'),candidate.createCandidateProfile)
.put( verifyJwt , allowedTo('admin'),candidate.updateCandidate)
.delete( verifyJwt , allowedTo('admin'),candidate.deleteCandidateProfile)
.get(verifyJwt, allowedTo('admin' , 'voter'),candidate.getCandidate)




export default candidateRouter