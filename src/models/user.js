import { Schema, model } from 'mongoose'

const Users = new Schema({
    userName: {
        type: String,
        require: true
    },
    userPassword: {
        type: String,
        require: true
    },
    userEmail: {
        type: String,
        require: true,
        unique: true
    },
    userLevel: {
        type: Number,
        require: true
    }
})

const User = model("Users", Users)

export default User
