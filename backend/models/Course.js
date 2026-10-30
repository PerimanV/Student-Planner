import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },

    courseName: {
        type: String,
        required: true
    },

    courseColor: {
        type: String,
        required: true
    }
});

export default mongoose.model("Course", courseSchema);