import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { userModel } from './../../../databases/models/user.model.js';
import Jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const createUser = catchAsyncHandler(async (req, res, next) => {
    let isFound = await userModel.findOne({ personal_id: req.body.personal_id })
    if (isFound) return next(new AppError('account already exist', 409));
    let result = new userModel(req.body)
    await result.save()
    result.password = undefined
    res.status(200).json({ message: "success", result })
})

const signin = catchAsyncHandler(async (req, res, next) => {
    const { personal_id, password } = req.body;
    let foundeUser = await userModel.findOne({ personal_id })
  
    if (!foundeUser) return next(new AppError('account is not exist', 401))
    const match = await bcrypt.compare(password, foundeUser.password)
    if (match) {
        // create Jwt token
        let accessToken = Jwt.sign({
            personal_id: foundeUser.personal_id, role: foundeUser.role, active: foundeUser.isActive
        }, 'TokenSecretKey', { expiresIn: '30s' })

        let refreshToken = Jwt.sign({
            personal_id: foundeUser.personal_id, role: foundeUser.role, active: foundeUser.isActive
        }, 'refreshSecretKey', { expiresIn: '1d' })
    
        foundeUser.password = undefined
        let updateRefreshToken = await userModel.findByIdAndUpdate(foundeUser._id, { refreshToken } , { new : true })
        
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

        res.json({ message: "success", accessToken })
    } else {
        res.sendStatus(401);
    }
})


const handleRefreshToken = catchAsyncHandler(async (req, res, next) => {  
    const cookies = req.cookies;
    console.log(req.cookies);
    if (!cookies?.jwt) return next(new AppError('cookies is not exist', 401))

    const refreshToken = cookies.jwt

    const findUser = await userModel.findOne({ refreshToken })

    if (!findUser) return next(new AppError('Forbidden', 403))

    // evaluate jwt
    Jwt.verify(
        refreshToken,
        'refreshSecretKey',
        (err, decoded) => {
            if (err || findUser.personal_id !== decoded.personal_id) return next(new AppError('Forbidden !!!!!!!!', 403))
      
            const accessToken = Jwt.sign({ personal_id: findUser.personal_id, role: findUser.role, active: findUser.isActive
            },
                'TokenSecretKey', { expiresIn: '30s' }
            );
      
            res.status(200).json({ message: "success", accessToken })
        }
    )

})



const allowedTo = (...roles) => {
    return catchAsyncHandler(async (req, res, next) => {      
        if (!roles.includes(req.user.role)) return next(new AppError('You Are Not Authorized to access this route.' + req.user.role, 409))
        next()
    })
}

const logout = catchAsyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204) // No content
    const refreshToken = cookies.jwt

    // is refresh token in db
    const findUser = await userModel.findOne({ refreshToken })
    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.status(204)
    }

    // delete refresh token
    let DeletRefreshToken = await userModel.findByIdAndUpdate(findUser._id, { refreshToken: '' }, { new: true })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.status(204).json({ message: 'success' })

})



// const protectedRoute = catchAsyncHandler(async (req, res, next) => {
//     let { token } = req.headers
//     if (!token) return next(new AppError("Token is not Provided", 401))
//     let decoded = await Jwt.verify(token, "candiateVoteApp")
//     let user = await userModel.findOne({ personal_id: decoded.personal_id })
//     if (!user) return next(new AppError('Invalid Token', 401))
//     if (user.passwordChangedAt) {
//         let changePasswordDate = parseInt(user.passwordChangedAt.getTime() / 1000)
//         if (changePasswordDate > decoded.iat) return next(new AppError('Invalid Token', 401))
//     }
//     if (user.isActive == false) return next(new AppError('This user is not activate yet , please contact Admin!!', 401))
//     req.user = user;
//     next()
// })

export {
    createUser,
    signin,
    // protectedRoute,
    allowedTo,
    logout,
    handleRefreshToken
}