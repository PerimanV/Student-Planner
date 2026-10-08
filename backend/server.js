const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Course = require("./models/Course");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const PORT = 5000;

app.post("/api/users", async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        res.json(newUser)
    } catch (error) {
        res.status(500).json({
            message: "Failed to create user"
        });
    }
});

app.post("/api/courses", async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);

        console.log(newCourse);

        res.json(newCourse);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create course"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});