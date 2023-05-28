import express from 'express'
import * as auth from './auth.controller.js'

const refreshRouter = express.Router()

refreshRouter.route('/').get(auth.handleRefreshToken)


export default refreshRouter