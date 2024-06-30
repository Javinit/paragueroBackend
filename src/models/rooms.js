import { Schema, model } from 'mongoose'

const Rooms = new Schema({
    number: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    },

})

const Room = model("rooms", Rooms)

export default Room
