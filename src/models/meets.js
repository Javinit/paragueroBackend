import mongoose, { Schema, model } from 'mongoose'

const Meets = new Schema({
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

const Meet = model("meet", Meets)

export default Meet
