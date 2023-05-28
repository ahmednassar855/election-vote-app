import express from 'express'
import * as auth from './auth.controller.js'
import { verifyJwt } from '../../middleware/verifyJwt.middleware.js'

const authRouter = express.Router()

authRouter.route('/signin').post(auth.signin)
authRouter.route('/createUser').post(verifyJwt , auth.allowedTo('admin'),auth.createUser)


authRouter.route('/logout').get(verifyJwt , auth.logout)


export default authRouter