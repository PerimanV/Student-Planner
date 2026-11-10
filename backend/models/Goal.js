import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const goalCourseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const goalSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    targetDate: {
        type: Date,
        default: null
    },
    courses: {
        type: [goalCourseSchema],
        default: []
    },
    milestones: {
        type: [milestoneSchema],
        default: []
    },
    completed: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true
});

export default mongoose.model("Goal", goalSchema);