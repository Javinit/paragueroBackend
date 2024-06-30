import mongoose, { Schema, model } from 'mongoose'

const Users = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        require: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'rooms',
        require: true
    },
    fullDate: {
        type: Date,
        require: true
    }


})

const User = model("users", Users)

export default User
