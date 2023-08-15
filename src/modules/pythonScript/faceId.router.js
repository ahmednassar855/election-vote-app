import express from 'express';
import * as faceId from './faceId.controller.js';
import { uploadSingleFile } from '../../utils/fileUploads.js';


const faceIdRouter = express.Router()

faceIdRouter.route('/signin')
.post(uploadSingleFile('faceIdImageVerification' , 'voterPhotoVerification'), faceId.faceIdCreate)


export default faceIdRouter