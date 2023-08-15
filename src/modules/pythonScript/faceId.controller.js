import { PythonShell } from 'python-shell';
import { voterModel } from '../../../databases/models/voter.model.js';
import { catchAsyncHandler } from './../../middleware/catchAsyncHandler.js';
import { AppError } from './../../utils/AppError.js';
import Jwt from 'jsonwebtoken'


export const faceIdCreate = catchAsyncHandler(async (req, res, next) => {
    const { personal_id, faceIdImageVerification } = req.body;

    const user = await voterModel.findOne({ personal_id: req.body.personal_id })
    if (!user) return next(new AppError('User is not registerd!!!', 409))

    const updatedVoter = await voterModel.findOneAndUpdate(
        { personal_id },
        { faceIdImageVerification: req.file.filename },
        { new: true }
        ).select("+faceIdImageVerification")
    let imagePath = user.faceIdImage
    let new_path = imagePath.replace("http://localhost:3030", "./uploads")
    console.log(new_path);
    console.log(updatedVoter.faceIdImageVerification);
    let options = {
        scriptPath: 'C:/Users/Ahmed/Desktop/Amin Project/election-app/backend/src/modules/pythonScript',
        args: [`${new_path}`, `./uploads/voterPhotoVerification/${updatedVoter.faceIdImageVerification}`]
    };

    let result = await PythonShell.run('./face.py', options, null)
    // False shall be with F capital as the result of result[0]   
    console.log(result);
    if (result[0] === "False" || result.length > 1) {
        return next(new AppError('Face Id is not matching', 400))
    }

    let accessToken = Jwt.sign({_id : updatedVoter._id , role : updatedVoter.role}, process.env.ACCESS_TOKEN_SECRET , { expiresIn: '3000s' })
    let refreshToken = Jwt.sign({_id : updatedVoter._id , role : updatedVoter.role},  process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    updatedVoter.faceIdImage = undefined
    let updateRefreshToken = await voterModel.findByIdAndUpdate(updatedVoter._id, { refreshToken } , { new : true })
    
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(200).json({
        message: "success",
        accessToken, 
        result
    })

})

