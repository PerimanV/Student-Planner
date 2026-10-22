import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Task from "./models/Task.js";
import Note from "./models/Note.js";
import OpenAI from "openai";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import "dotenv/config";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const PORT = 5000;

// ~~~ AI ROUTES ~~~

app.post("/api/notes/:id/summarize", async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        if(!note.content || !note.content.trim()) {
            return res.status(400).json({
                message: "Note has no content to summarize"
            });
        }

        const response = await ai.responses.create({
        model: "gpt-6-luna",
        reasoning: {
            effort: "none"
        },
        input: `You are an academic study assistant helping university students understand their course material and prepare for exams.

        Transform the following student notes into a comprehensive, well-organized study guide. Your goal is to help the student understand the material, remember important concepts, and revise effectively for exams.

        Follow these instructions:

        1. **Organize the material:** Identify the distinct topics covered in the notes and separate them using clear Markdown headings and subheadings. Group related concepts together logically. Do not invent chapter names or force unrelated topics together.
        2. **Explain concepts thoroughly:** Do not merely list or name concepts. Explain what each important concept means, how it works, why it matters, and how it relates to other concepts when the source provides enough information. Use clear language appropriate for a university student.
        3. **Preserve definitions and technical details:** Retain important terminology, definitions, characteristics, processes, conditions, advantages, disadvantages, and distinctions from the original notes. Do not oversimplify technical material or remove qualifications that are necessary for understanding a concept.
        4. **Use examples where appropriate:** Preserve examples provided in the source and explain how they illustrate the relevant concept. Do not invent examples or factual claims that are not supported by the notes.
        5. **Highlight important information:** Use bold text to emphasize key terms, definitions, important rules, and distinctions that students should remember.
        6. **Improve readability:** Use bullet points and numbered lists for related items, steps, classifications, and collections of definitions. Use tables when they genuinely help compare related concepts. Use normal paragraphs for explanations. Avoid excessive formatting.
        7. **Emphasize important distinctions:** Clearly explain differences between related concepts when the notes discuss them. For example, distinguish between different database commands, normal forms, or transaction properties when those topics appear in the source.
        8. **Support exam preparation:** Preserve details that could be important for answering theoretical or technical exam questions. Include important conditions, exceptions, limitations, and trade-offs mentioned in the notes. Do not claim that something is likely to appear on an exam unless the source supports that conclusion.
        9. **Remain faithful to the source:** Do not introduce unsupported facts, definitions, examples, or explanations. If the notes mention a topic without explaining it sufficiently, indicate that the source provides limited information rather than inventing missing material.
        10. **Avoid unnecessary repetition:** Remove redundant wording while retaining the information needed to understand each concept. Prefer a complete and understandable explanation over an excessively short summary.
        11. **Return only the study guide:** Begin directly with the first appropriate heading. Do not include an introductory message explaining what you did or a concluding paragraph about the summary.
        Return the study guide in Markdown.

        Student notes:
        ${note.content}
        ${note.content}`
        });

        res.json({
            summary: response.output_text
        });
    } catch (error) {
        console.error("Error summarizing note:", error);

        res.status(500).json({
            message: "Failed to summarize note"
        });
    }
});

// ~~~ USERS ROUTES ~~~

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

// ~~~ COURSES ROUTES ~~~

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


// ~~~ TASKS ROUTES ~~~

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
            { 
                new: true,
                runValidators: true 
            }
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
                message: "Task not found"
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

// ~~~ NOTES ROUTES ~~~

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();

        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);

        res.status(500).json({
            message: "Failed to fetch notes"
        });
    }
});

app.post("/api/notes", async (req, res) => {
    try {
        const newNote = await Note.create(req.body);

        res.json(newNote)
    } catch (error) {
        console.error("Error creating note:", notes);

        res.status(400).json({
            message: "Failed to create note"
        });
    }
});

app.put("/api/notes/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if(!updatedNote) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error("PUT error:", error);
        res.status(500).json({
            message: "Failed to update note"
        });
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if(!deletedNote) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Note deleted succesfully",
            task: deletedNote
        })
    } catch (error) {
        console.error("Error deleting note:", error);

        res.status(500).json({
            message: "Failed to delete note"
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});