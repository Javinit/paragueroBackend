import { Schema, model } from 'mongoose'

const Users = new Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    level: {
        type: Number,
        require: true
    },
    active: {
        type: Boolean,
        require: true,
        default: true
    }
})

const User = model("Users", Users)

export default User
