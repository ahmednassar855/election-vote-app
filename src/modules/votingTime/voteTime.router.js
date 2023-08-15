import express from 'express';
import * as voteTime from './voteTime.controller.js';
import { allowedTo } from '../auth/auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';

const voteTimeRouter = express.Router()


voteTimeRouter.route('/')
//verifyJwt , allowedTo('admin')
.post(  voteTime.startVotingTime)
.put( voteTime.endVotingTime)
.delete( voteTime.deleteVotingTime)

//verifyJwt , allowedTo('admin' , 'voter' , 'candidate'),
.get( voteTime.getLastVotingTime)



export default voteTimeRouter