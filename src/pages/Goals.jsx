
import { useState, useEffect } from "react";
import Header from '../components/Header';
import { Plus, X } from 'lucide-react';

export default function Goals() {
    console.log("Goals component rendered");
    const [goals, setGoals] = useState([]);
    useEffect(() => {
        console.log("Goals useEffect executed");

        fetch("/api/goals", {
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            console.log("Goals received:", data);
            setGoals(data);
        })
        .catch(error => {
            console.error("Error fetching goals:", error);
        });
    }, []);
    
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetch("/api/courses", {
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            setCourses(data);
        })
        .catch(error => {
            console.error("Error fetching courses:", error);
        });
    }, []);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [milestones, setMilestones] = useState([""]);
    const [editingGoal, setEditingGoal] = useState(null);
    const [originalMilestones, setOriginalMilestones] = useState([]);
    const [error, setError] = useState("");

    function closeModal() {
        setShowModal(false);

        setTitle("");
        setDescription("");
        setTargetDate("");
        setMilestones([""]);

        setSelectedCourses([]);
        setEditingGoal(null);
        setOriginalMilestones([]);
        setError("");
    }

    async function toggleMilestone(goalId, milestoneId) {
        const goal = goals.find(goal => goal._id === goalId);

        const updatedMilestones = goal.milestones.map(milestone => ({
            _id: milestone._id,
            title: milestone.title,
            completed: milestone._id === milestoneId ? !milestone.completed : milestone.completed
        }));

        try {
            const response = await fetch(`/api/goals/${goalId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    milestones: updatedMilestones
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update goal");
            }

            const updatedGoal = await response.json();

            setGoals(goals.map(goal =>
                goal._id === goalId ? updatedGoal : goal
            ));

        } catch (error) {
            console.error("Error updating milestone:", error);
        }
    }

    async function toggleGoalCourse(goalId, courseId) {
        const goal = goals.find(goal => goal._id === goalId);

        const updatedCourses = goal.courses.map(course => ({
            courseId: course.courseId,
            completed: course.courseId === courseId
                ? !course.completed
                : course.completed
        }));

        try {
            const response = await fetch(`/api/goals/${goalId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ courses: updatedCourses })
            });

            if (!response.ok) {
                throw new Error("Failed to update course progress");
            }

            const updatedGoal = await response.json();

            setGoals(goals.map(goal =>
                goal._id === goalId ? updatedGoal : goal
            ));
        } catch (error) {
            console.error("Error updating course progress:", error);
        }
    }

    function addMilestoneField() {
        setMilestones([...milestones, ""]);
    }

    function removeMilestoneField(index) {
        setMilestones(current =>
            current.filter((_, i) => i !== index)
        );
    }

    function updateMilestone(index, value) {
        const updatedMilestones = [...milestones];

        updatedMilestones[index] = value;

        setMilestones(updatedMilestones);
    }

    function editGoal(goal) {
        setEditingGoal(goal);

        setTitle(goal.title);
        setDescription(goal.description);
        setTargetDate(goal.targetDate ? goal.targetDate.slice(0, 10) : "");

        setMilestones(goal.milestones.map(
            milestone => milestone.title
        ));
        setOriginalMilestones(goal.milestones);

        setSelectedCourses(
            goal.courses.map(course => course.courseId)
        );

        setError("");
        setShowModal(true);
    }

    async function saveEditedGoal() {
        const cleanedMilestones = milestones
            .map(milestone => milestone.trim())
            .filter(milestone => milestone !== "");

        if (!title.trim()) {
            setError("Goal title is required");
            return;
        }

        if (cleanedMilestones.length === 0) {
            setError("Please add at least one milestone");
            return;
        }

        setError("");

        try {
            const response = await fetch(`/api/goals/${editingGoal._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        description: description.trim(),
                        targetDate: targetDate || null,
                        milestones: cleanedMilestones.map((milestone, index) => ({
                            _id: originalMilestones[index]?._id,
                            title: milestone,
                            completed: originalMilestones[index]?.completed || false
                        }))
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update goal");
            }

            const updatedGoal = await response.json();

            const updatedGoals = goals.map(goal => {
                if (goal._id === updatedGoal._id) {
                    return updatedGoal;
                } else {
                    return goal;
                }
            });

            setGoals(updatedGoals);
            closeModal();

        } catch (error) {
            console.error("Error updating goal:", error);
            setError("Failed to update goal. Please try again.");
        }
    }

    async function addGoal() {
        if (!title.trim()) {
            setError("Goal title is required");
            return;
        }

        const cleanedMilestones = milestones
            .map(milestone => milestone.trim())
            .filter(milestone => milestone !== "");

        if (cleanedMilestones.length === 0) {
            setError("Please add at least one milestone");
            return;
        }

        setError("");

        try {
            const response = await fetch("/api/goals", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    courses: selectedCourses.map(courseId => ({
                        courseId: courseId
                    })),
                    targetDate: targetDate || null,
                    milestones: cleanedMilestones.map(milestone => ({
                        title: milestone,
                        completed: false
                    }))
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create goal");
            }

            const newGoal = await response.json();

            setGoals([...goals, newGoal]);
            closeModal();

        } catch (error) {
            console.error("Error creating goal:", error);
            setError("Failed to create goal. Please try again.");
        }
    }

    function toggleCourse(courseId) {
        setSelectedCourses(current => {
            if (current.includes(courseId)) {
                return current.filter(id => id !== courseId);
            }

            return [...current, courseId];
        });
    }
    
    async function deleteGoal(goalId) {
        try {
            const response = await fetch(`/api/goals/${goalId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to delete goal");
            }

            setGoals(goals.filter(goal => goal._id !== goalId));

        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
            <Header />
            <div className="min-h-screen bg-gray-950 text-white p-6">
                <div className="max-w-5xl mx-auto">
                    <button onClick={() => {
                            closeModal();
                            setShowModal(true);
                        }} className='mt-8 mb-8 p-2 flex justify-between w-full cursor-pointer card-hover'>
                        <h3 className='text-3xl font-bold'>Add Goal</h3>
                        <div className='cursor-pointer text-emerald-600'> <Plus className='w-10 h-10' strokeWidth={3} /> </div>
                    </button>

                    <div className="space-y-4">
                        {goals.map(goal => {
                           const completedCourses = (goal.courses || []).filter(
                                course => course.completed
                            ).length;

                            const completedMilestones = (goal.milestones || []).filter(
                                milestone => milestone.completed
                            ).length;

                            const totalCourses = (goal.courses || []).length;
                            const totalMilestones = (goal.milestones || []).length;

                            const completed = completedCourses + completedMilestones;
                            const total = totalCourses + totalMilestones;

                            const progress = total > 0 ? (completed / total) * 100 : 0;
                            const isCompleted = total > 0 && completed === total;

                            return (
                                <div
                                    key={goal._id}
                                    className="border border-zinc-800 rounded-2xl p-4 sm:p-5 bg-gray-900"
                                >
                                    <div className="flex items-start gap-3">

                                        <div className="flex-1 min-w-0">
                                            <h2 className="font-semibold text-lg">
                                                {goal.title}
                                            </h2>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {goal.description}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => editGoal(goal)}
                                                className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/20"
                                            >
                                                Update
                                            </button>

                                            <button
                                                onClick={() => deleteGoal(goal._id)}
                                                className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-gray-300">
                                                Progress
                                            </span>
                                            <span className="text-emerald-400 font-semibold">
                                                {completed} of {total} completed
                                            </span>
                                        </div>

                                        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">

                                        {goal.courses?.length > 0 ? (
                                            <div className=" mt-1 pt-1">
                                                <h3 className="font-semibold mb-3">
                                                    Courses
                                                </h3>

                                                <div className="space-y-3">
                                                    {goal.courses?.map(goalCourse => {
                                                        const course = courses.find(
                                                            course => course._id === goalCourse.courseId
                                                        );

                                                        return (
                                                            <label
                                                                key={goalCourse.courseId}
                                                                className="flex items-center gap-3 cursor-pointer group"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={goalCourse.completed}
                                                                    onChange={() => toggleGoalCourse(
                                                                        goal._id,
                                                                        goalCourse.courseId
                                                                    )}
                                                                    className="w-4 h-4 accent-emerald-400 shrink-0 cursor-pointer"
                                                                />

                                                                <span className={`text-sm sm:text-base transition-colors ${
                                                                    goalCourse.completed
                                                                        ? "text-gray-400"
                                                                        : "text-gray-200 group-hover:text-white"
                                                                }`}>
                                                                    {course ? course.courseName : "Course not found"}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No courses associated with this goal.
                                            </p>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 mt-5 pt-5">
                                        <h3 className="font-semibold mb-3">
                                            Milestones
                                        </h3>

                                        <div className="space-y-3">
                                            {goal.milestones.map(milestone => (
                                                <label
                                                    key={milestone._id}
                                                    className="flex items-center gap-3 cursor-pointer group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={milestone.completed}
                                                        onChange={() => toggleMilestone(goal._id,milestone._id)}
                                                        className="w-4 h-4 accent-emerald-400 shrink-0 cursor-pointer"
                                                    />

                                                    <span className={`text-sm sm:text-base transition-colors ${
                                                        milestone.completed
                                                            ? "text-gray-400"
                                                            : "text-gray-200 group-hover:text-white"
                                                    }`}>
                                                        {milestone.title}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>

                                        {!isCompleted && (
                                            <p className="text-xs text-gray-400 mt-4">
                                                The goal will be completed when all courses and milestones are checked.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

                            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-md">
                                <form 
                                    onSubmit={event => event.preventDefault()}
                                    className="mb-6 border border-zinc-800 rounded-2xl p-5 bg-zinc-950 space-y-4">
                                        <h2 className="text-xl font-semibold">
                                            {editingGoal ? "Edit Goal" : "Create a new goal"}
                                        </h2>

                                        {error && (
                                            <p className="text-red-500 text-sm">
                                                {error}
                                            </p>
                                        )}

                                        <div>
                                            <label className="block text-sm text-gray-300 mb-2">
                                                Goal title
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={event => setTitle(event.target.value)}
                                                required
                                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-400"
                                            />
                                        </div>
                                        
                                        <div>
                                    <label className="block text-sm text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={event => setDescription(event.target.value)}
                                        placeholder="What do you want to achieve?"
                                        rows={2}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">
                                        Target date (optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={targetDate}
                                        onChange={event => setTargetDate(event.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">
                                        Associated courses (optional)
                                    </label>

                                    <div className="space-y-2 max-h-40 overflow-y-auto border border-zinc-700 rounded-lg p-3">
                                        {courses.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No courses available.
                                            </p>
                                        ) : (
                                            courses.map(course => (
                                                <label
                                                    key={course._id}
                                                    className="flex items-center gap-3 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCourses.includes(course._id)}
                                                        onChange={() => toggleCourse(course._id)}
                                                        className="w-4 h-4 accent-emerald-400"
                                                    />

                                                    <span className="text-sm text-gray-200">
                                                        {course.courseName}
                                                    </span>
                                                </label>
                                            ))
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-500 mt-2">
                                        Select one or more courses related to this goal.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm text-gray-300">Milestones</label>
                                        <button
                                            type="button"
                                            onClick={addMilestoneField}
                                            className="text-sm text-emerald-400 hover:text-emerald-300"
                                        >
                                            + Add milestone
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {milestones.map((milestone, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={milestone}
                                                    onChange={event =>
                                                        updateMilestone(index, event.target.value)
                                                    }
                                                    placeholder={`Milestone ${index + 1}`}
                                                    className="flex-1 min-w-0 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-emerald-400"
                                                />

                                                {milestones.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMilestoneField(index)}
                                                        className="text-gray-400 hover:text-red-400 px-2"
                                                        aria-label={`Remove milestone ${index + 1}`}
                                                    >
                                                        <X />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={editingGoal ? saveEditedGoal : addGoal}
                                            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                                        >
                                            {editingGoal ? "Save Changes" : "Create Goal"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                            </div>
                        </div>
                        
                    )}
                </div>
            </div>
        </div>
    );
}
