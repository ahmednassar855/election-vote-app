import mongoose from 'mongoose'

export const dbConnection = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.DB_CONNECTION).then( ()=> {
        console.log('data base connected successfully');
    } ).catch( (err) => {
        console.log('data base connection error!!!!');
    });
}