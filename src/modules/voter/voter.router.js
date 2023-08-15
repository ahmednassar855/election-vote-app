import express from 'express';
import * as voter from './voter.controller.js';
import { allowedTo } from '../auth/auth.controller.js';
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js';
import { uploadSingleFile } from '../../utils/fileUploads.js';

const voterRouter = express.Router(verifyJwt, voter.getVoter)

voterRouter.route('/me').get(verifyJwt ,voter.getMe)

voterRouter.route('/')
.get( verifyJwt, allowedTo('admin'),voter.getAllVoters)
.post( verifyJwt, allowedTo('admin'),uploadSingleFile('faceIdImage' , 'voterPhoto'),voter.createVoter)

voterRouter.route('/:id')
.delete( verifyJwt, allowedTo('admin'),voter.deleteVoter)
.get(verifyJwt, allowedTo('admin'), voter.getVoter)
.patch( verifyJwt, allowedTo('voter'), uploadSingleFile('image' , 'voterPhoto') , voter.updateVoterPhoto)


export default voterRouter