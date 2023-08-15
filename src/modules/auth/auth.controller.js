import { catchAsyncHandler } from "../../middleware/catchAsyncHandler.js"
import { AppError } from '../../utils/AppError.js';
import { userModel } from './../../../databases/models/user.model.js';
import Jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

const signup = catchAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return next(new AppError('please enter email or password', 400));
    }
    let isFound = await userModel.findOne({ email })
    if (isFound) return next(new AppError('account already exist', 409));
    let result = new userModel(req.body)
    console.log(result);
    await result.save()
    res.status(200).json({ message: "success", result })
})

const signin = catchAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let foundeUser = await userModel.findOne({ email });
    if (!foundeUser) return next(new AppError('account is not exist', 401));
    const match = await bcrypt.compare(password, foundeUser.password);
    if (!match) return next(new AppError('email or password and/or wrong', 404));

    // create Jwt token
    let accessToken = Jwt.sign({ _id: foundeUser._id, role: foundeUser.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30000s' })
    let refreshToken = Jwt.sign({ _id: foundeUser._id, role: foundeUser.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
    foundeUser.password = undefined
    let updateRefreshToken = await userModel.findByIdAndUpdate(foundeUser._id, { refreshToken }, { new: true })
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ message: "success", accessToken })

})

const handleRefreshToken = catchAsyncHandler(async (req, res, next) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) return next(new AppError('cookies is not exist', 401))
    const refreshToken = cookies.jwt
    const findUser = await userModel.findOne({ refreshToken })
    if (!findUser) return next(new AppError('Forbidden', 403))
    // evaluate jwt
    Jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || findUser.email !== decoded.email) return next(new AppError('Forbidden !!!!!!!!', 403))
            const accessToken = Jwt.sign({
                _id: findUser._id, email: findUser.email, role: findUser.role, active: findUser.isActive
            },
                'TokenSecretKey', { expiresIn: '3000s' }
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
    if (!cookies.jwt) return next(new AppError('Forbidden !!!!!!!!', 403))// No content
    const refreshToken = cookies.jwt

    // is refresh token in db
    const findUser = await userModel.findOne({ refreshToken })
    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.status(204).json({ message: "logout successfully" })
    }

    // delete refresh token
    let DeletRefreshToken = await userModel.findByIdAndUpdate(findUser._id, { refreshToken: '' }, { new: true })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.status(204).json({ message: 'logout successfully"' })

})



export {
    signup,
    signin,
    allowedTo,
    logout,
    handleRefreshToken
}