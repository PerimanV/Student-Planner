import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Course from "./models/Course.js";
import Task from "./models/Task.js";
import Note from "./models/Note.js";
import OpenAI from "openai";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import Profile from "./models/Profile.js";
import { fromNodeHeaders } from "better-auth/node";
import Goal from "./models/Goal.js" 
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

async function requireAuth(req, res, next) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session || !session.user) {
            return res.status(401).json({
                message: "You must be logged in."
            });
        }

        req.user = session.user;

        console.log("Authenticated user:", req.user);

        next();

    } catch (error) {
        console.error("Session verification failed:", error);

        return res.status(500).json({
            message: "Failed to verify session."
        });
    }
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const PORT = 5000;

//~~~ GOAL ROUTES ~~~

app.get("/api/goals", requireAuth, async (req, res) => {
    try {
        const goals = await Goal.find({
            userId: req.user.id
        });

        res.json(goals);
    } catch (error) {
        console.error("error fetching goals:", error);
        res.status(500).json({
            message: "Failed to fetch goals"
        });
    }
});

app.post("/api/goals", requireAuth, async (req, res) => {
    try {
        const { title, description, targetDate, milestones, courses } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                message: "Goal title is required"
            });
        }

        // at least one course or milestone needs to exist
        if ((!Array.isArray(courses) || courses.length === 0) && (!Array.isArray(milestones) || milestones.length === 0)) {
            return res.status(400).json({
                message: "Please add at least one course or milestone to your goal."
            });
        }

        const trimmedMilestones = (milestones || []).map(milestone => ({
            title: milestone.title?.trim(),
            completed: false
        }));

        const selectedCourses = courses || [];

        // Check that all selected courses belong to the logged-in user
        const courseIds = selectedCourses.map(course => course.courseId);

        const userCourses = await Course.find({
            _id: { $in: courseIds },
            userId: req.user.id
        });

        if (userCourses.length !== courseIds.length) {
            return res.status(400).json({
                message: "One or more selected courses are invalid"
            });
        }

        const goalCourses = selectedCourses.map(course => ({
            courseId: course.courseId,
            completed: false
        }));

        const goal = await Goal.create({
            userId: req.user.id,
            title: title.trim(),
            description: description?.trim() || "",
            targetDate: targetDate || null,
            courses: goalCourses,
            milestones: trimmedMilestones,
            completed: false
        });

        res.status(201).json(goal);

    } catch (error) {
        console.error("Error creating goal:", error);

        res.status(500).json({
            message: "Failed to create goal"
        });
    }
});


app.put("/api/goals/:id", requireAuth, async (req, res) => {
    try {
        const { title, description, targetDate, milestones, courses } = req.body;

        const updates = {};

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: "Goal title is required"
                });
            }

            updates.title = title.trim();
        }
        
        const existingGoal = await Goal.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!existingGoal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        if (description !== undefined) {
            updates.description = description.trim();
        }

        if (targetDate !== undefined) {
            updates.targetDate = targetDate || null;
        }

        // Update milestones
        if (milestones !== undefined) {
            updates.milestones = milestones.map(milestone => ({
                _id: milestone._id,
                title: milestone.title.trim(),
                completed: milestone.completed || false
            }));
        }

        // Update associated courses
        if (courses !== undefined) {
            if (!Array.isArray(courses)) {
                return res.status(400).json({
                    message: "Invalid courses"
                });
            }

            const courseIds = courses.map(course => course.courseId);

            const userCourses = await Course.find({
                _id: { $in: courseIds },
                userId: req.user.id
            });

            if (userCourses.length !== courseIds.length) {
                return res.status(400).json({
                    message: "One or more selected courses are invalid"
                });
            }

            updates.courses = courses.map(course => {
                const existingCourse = existingGoal.courses.find(
                    item => item.courseId.toString() === course.courseId.toString()
                );

                return {
                    courseId: course.courseId,
                    completed: course.completed !== undefined
                        ? course.completed
                        : existingCourse ? existingCourse.completed : false
                };
            });
        }

        // Get the courses and milestones after the requested changes
        const finalCourses = updates.courses ?? existingGoal.courses;
        const finalMilestones = updates.milestones ?? existingGoal.milestones;

        // A goal must contain at least one course or milestone
        if (finalCourses.length === 0 && finalMilestones.length === 0) {
            return res.status(400).json({
                message: "A goal must have at least one course or milestone."
            });
        }

        // Check whether all courses and milestones are completed
        const allCoursesCompleted = finalCourses.every(course => course.completed);

        const allMilestonesCompleted = finalMilestones.every(
            milestone => milestone.completed
        );

        updates.completed = allCoursesCompleted && allMilestonesCompleted;

        const updatedGoal = await Goal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedGoal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json(updatedGoal);

    } catch (error) {
        console.error("Error updating goal:", error);

        res.status(500).json({
            message: "Failed to update goal"
        });
    }
});


app.delete("/api/goals/:id", requireAuth, async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        res.json({
            message: "Goal deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting goal:", error);
        res.status(500).json({
            message: "Failed to delete goal"
        });
    }
});

// ~~~ AI ROUTES ~~~

app.post("/api/notes/:id/summarize", requireAuth, async (req, res) => {
    try {

        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

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

// ~~~ PROILE ROUTES ~~~

app.get("/api/profile", requireAuth, async (req, res) => {
    try {
        let profile = await Profile.findOne({
            userId: req.user.id
        });

        if (!profile) {
            profile = await Profile.create({
                userId: req.user.id
            });
        }

        res.json({
            name: req.user.name,
            email: req.user.email,
            university: profile.university,
            department: profile.department,
            year: profile.year
        });
    } catch (error) {
        console.error("Error fetching profile:", error);

        if (res.headersSent) {
            return;
        }

        res.status(500).json({
            message: "Failed to fetch profile."
        });
    }
});

app.put("/api/profile", requireAuth, async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId: req.user.id },
            {
                university: req.body.university,
                department: req.body.department,
                year: req.body.year
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.json({
            name: req.user.name,
            email: req.user.email,
            university: profile.university,
            department: profile.department,
            year: profile.year
        });
    } catch (error) {
        console.error("Error saving profile:", error);

        res.status(500).json({
            message: "Failed to save profile."
        });
    }
});

// ~~~ COURSES ROUTES ~~~

app.post("/api/courses", requireAuth, async (req, res) => {
    try {
        const newCourse = await Course.create({
            courseName: req.body.courseName,
            courseColor: req.body.courseColor,
            userId: req.user.id
        });

        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error creating course:", error);

        res.status(500).json({
            message: "Failed to create course"
        });
    }
});

app.get("/api/courses", requireAuth, async (req, res) => {
    try {
        const courses = await Course.find({
            userId: req.user.id
        });

        res.json(courses);
    } catch (error) {
        console.error("Error fething courses:", error);

        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
});


app.put("/api/courses/:id", requireAuth, async (req, res) => {
    try {
        const updatedCourse = await Course.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                courseName: req.body.courseName,
                courseColor: req.body.courseColor
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCourse) {
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

app.delete("/api/courses/:id", requireAuth, async (req, res) => {
    try {
        const deletedCourse = await Course.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deletedCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course deleted successfully",
            course: deletedCourse
        });
    } catch (error) {
        console.error("Error deleting course:", error);

        res.status(500).json({
            message: "Failed to delete course"
        });
    }
});

// ~~~ TASKS ROUTES ~~~

app.post("/api/tasks", requireAuth, async (req, res) => {
        try {
            const { courseId, title, priority, dueDate, completed } = req.body;

            const course = await Course.findOne({
                _id: courseId,
                userId: req.user.id
            });

            if (!course) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            const newTask = await Task.create({
                userId: req.user.id,
                courseId,
                title,
                priority,
                dueDate,
                completed
            });

            res.status(201).json(newTask);
        } catch (error) {
            console.error("Error creating task:", error);

            res.status(500).json({
                message: "Failed to create task"
            });
        }
    });

app.get("/api/tasks", requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
});

app.put("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
        
        if (req.body.courseId) {
            const course = await Course.findOne({
                _id: req.body.courseId,
                userId: req.user.id
            });

            if (!course) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }
        }

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                title: req.body.title,
                priority: req.body.priority,
                dueDate: req.body.dueDate,
                completed: req.body.completed,
                courseId: req.body.courseId
            },
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
        console.error("Error updating task:", error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
});

app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        })

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

app.get("/api/notes", requireAuth, async (req, res) => {
    try {
        const notes = await Note.find({
            userId: req.user.id
        });

        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);

        res.status(500).json({
            message: "Failed to fetch notes"
        });
    }
});

app.post("/api/notes", requireAuth, async (req, res) => {
    try {

        const course = await Course.findOne({
            _id: req.body.courseId,
            userId: req.user.id
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const newNote = await Note.create({
            userId: req.user.id,
            courseId: req.body.courseId,
            title: req.body.title,
            content: req.body.content
        });

        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);

        res.status(500).json({
            message: "Failed to create note"
        });
    }
});

app.put("/api/notes/:id", requireAuth, async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                title: req.body.title,
                content: req.body.content,
                courseId: req.body.courseId
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);

        res.status(500).json({
            message: "Failed to update note"
        });
    }
});

app.delete("/api/notes/:id", requireAuth, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.json({
            message: "Note deleted successfully",
            note: deletedNote
        });
    } catch (error) {
        console.error("Error deleting note:", error);

        res.status(500).json({
            message: "Failed to delete note"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});