import express from 'express'
import dotenv from "dotenv"
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { dbConnection } from './databases/dbConnection.js';
import { AppError } from './src/utils/AppError.js';
import { globalErrorMiddleware } from './src/middleware/globalErrorMiddleware.js';

import candidateRouter from './src/modules/candidate/candidate.router.js';
import authRouter from './src/modules/auth/auth.router.js';
import userRouter from './src/modules/user/user.router.js';
import voteRouter from './src/modules/vote/vote.router.js';
import refreshRouter from './src/modules/auth/refresh.router.js';
import voteTimeRouter from './src/modules/votingTime/voteTime.router.js'
import voterRouter from './src/modules/voter/voter.router.js'
import faceIdRouter from './src/modules/pythonScript/faceId.router.js'


dotenv.config()
const app = express()
const port = 3030

if (process.env.MODE == 'development'){
    app.use(morgan('dev'))
}

app.use(cors())
app.use(express.urlencoded({ extended : false }))
app.use(express.json())

app.use(cookieParser())
app.use(express.static('uploads'))


// routes

// admin
app.use('/api/v1/auth' ,authRouter)  // will be reviewed later

app.use('/api/v1/user' ,userRouter)   // will be reviewed later
app.use('/api/v1/refresh' ,refreshRouter)   // ok done

app.use('/api/v1/candidates' ,candidateRouter) // ok done
app.use('/api/v1/voters' , voterRouter) // ok done

app.use('/api/v1/vote' ,voteRouter)

app.use('/api/v1/votingTime' ,voteTimeRouter)

app.use('/api/v1/FaceIdPython' ,faceIdRouter)

app.get('/', (req, res) => res.send('Hello World!'))


app.all('*' , (req , res , next) => {
    next( new AppError(`can not find this route : ${req.originalUrl}` , 404) )
})

app.use(globalErrorMiddleware)
dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

process.on( 'unhandledRejection' , ( err ) =>{
    console.log('unhandledRejection' , err);
} )


