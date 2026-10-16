const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Course = require("./models/Course");
const Task = require("./models/Task");
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

        res.json(newCourse);
    } catch (error) {

        console.error("Error creating course:", error);
        res.status(500).json({
            message: "Failed to create course"
        });
    }
});

app.get("/api/courses", async (req, res) => {
    try {
        const courses = await Course.find();

        res.json(courses);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
});

app.put("/api/courses/:id", async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            {
                courseName: req.body.courseName,
                courseColor: req.body.courseColor
            },
            {
                new: true,
                runValidators: true
            }
        );

        if(!updatedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json(updatedCourse);

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            message: "Failed to update course"
        });
    }
});

app.delete("/api/courses/:id", async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if(!deletedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course deleted succesfully",
            course: deletedCourse
        })
    } catch (error) {
        console.error("Error deleting course:", error);

        res.status(500).json({
            message: "Failed to delete course"
        });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const newTask = await Task.create(req.body);

        res.json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(400).json({
            message: "Failed to create task"
        });
    }
});

app.get("/api/tasks", async (req, res) => {
    try {
        
        const tasks = await Task.find();

        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    try {

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error("PUT error:", error);
        res.status(500).json({
            message: "Failed to update task"
        });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if(!deletedTask) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Task deleted succesfully",
            task: deletedTask
        })
    } catch (error) {
        console.error("Error deleting task:", error);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});