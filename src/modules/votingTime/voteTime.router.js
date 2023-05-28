import express from 'express';
import * as voteTime from './voteTime.controller.js';
import { allowedTo } from '../auth/auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';

const voteTimeRouter = express.Router()


voteTimeRouter.route('/')
.post(  verifyJwt , allowedTo('admin'), voteTime.startVoting)
.put( verifyJwt , allowedTo('admin'),voteTime.endVoting)
.get( verifyJwt , allowedTo('admin' , 'voter' , 'candidate'),voteTime.getLastVoting)



export default voteTimeRouter