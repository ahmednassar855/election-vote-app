import express from 'express';
import * as vote from './vote.controller.js';
import { allowedTo } from '../auth/auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';

const voteRouter = express.Router()


voteRouter.route('/')
.get( vote.getAllCandiatesWithITsVoter)


voteRouter.route('/:candidateId')
.put( verifyJwt, allowedTo('voter') ,vote.addVote)
.delete( verifyJwt, allowedTo('voter') ,vote.deleteVote)


export default voteRouter