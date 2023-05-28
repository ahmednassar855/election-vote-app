import Jwt from 'jsonwebtoken'
import { AppError } from '../utils/AppError.js';

export const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401)
    // console.log(authHeader);  // bearer token
    const token = authHeader.split(' ')[1];
    Jwt.verify(
        token,
        'TokenSecretKey',
        (err, decoded) => {
            if (err) return res.sendStatus(403)
            console.log(decoded);
            req.user = decoded;
            next()
        }
    )

} 