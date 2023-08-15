import Jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js';

export const verifyJwt =  (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader === undefined) return next(new AppError('Not Authorized !!!!!!!!', 401))
    // console.log(authHeader);  // bearer token
    const token = authHeader.split(' ')[1];
    Jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return next(new AppError('Forbidden !!!!!!!!', 403))
            req.user = decoded;
            next()
        }
    )

} 