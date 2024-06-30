import { Schema, model } from 'mongoose';

const Courses = new Schema({
    name: {
        type: String,
        require: true
    },
    teacher: {
        type: String,
        require: true
    },
    hours: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        default: "",
    },
    active: {
        type: Boolean,
        default: true,
    }
});

const Course = model("courses", Courses);

export default Course;
