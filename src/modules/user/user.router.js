import express from 'express'
import * as user from './user.controller.js'
import { allowedTo } from '../auth/auth.controller.js'
import { uploadSingleFile } from '../../utils/fileUploads.js'
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js'


const userRouter = express.Router()

userRouter.route('/')
// .get(protectedRoute , allowedTo('admin'), user.getAllUsers)
.get(verifyJwt,  allowedTo('admin') ,  user.getAllUsers)


userRouter.route('/voters')
.get(verifyJwt , allowedTo('admin'), user.getAllVoters)

userRouter.route('/candidates')
.get(verifyJwt , allowedTo('admin'), user.getAllCandidates)

userRouter.route('/:id')
.delete( verifyJwt , allowedTo('admin'),user.deleteVoter)
.patch( verifyJwt , allowedTo('admin'), user.activateUser)  
.put(verifyJwt , allowedTo('admin'), user.updateUserRole)
.get( verifyJwt , allowedTo('admin'),user.getUser)

userRouter.route('/updateProfile')
.patch( verifyJwt , allowedTo('voter', 'candidate'), uploadSingleFile('image' , 'userPhoto'), user.updatePhotoProflie)

export default userRouter