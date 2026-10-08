const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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

module.exports = mongoose.model("Course", courseSchema);