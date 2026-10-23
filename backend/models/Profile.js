
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },

        university: {
            type: String,
            default: ""
        },

        department: {
            type: String,
            default: ""
        },

        year: {
            type: String,
            default: "1st Year"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Profile", profileSchema);
