
import { useState } from "react";
import Header from '../components/Header';
import { Plus, X } from 'lucide-react';

const sampleGoals = [
    {
        _id: "1",
        title: "Become a good C programmer",
        description: "Long-term goal · Created by you",
        milestones: [
            { _id: "1", title: "Complete the C programming course", completed: true },
            { _id: "2", title: "Pass the university C course with 90/100", completed: true },
            { _id: "3", title: "Build a project using C", completed: false },
            { _id: "4", title: "Learn pointers and dynamic memory", completed: false },
            { _id: "5", title: "Upload the project to GitHub", completed: false }
        ]
    },
    {
        _id: "2",
        title: "Read 12 books this year",
        description: "Personal development",
        milestones: Array.from({ length: 12 }, (_, i) => ({
            _id: String(i + 1),
            title: `Read book ${i + 1}`,
            completed: i < 4
        }))
    }
];

export default function Goals() {
    const [goals, setGoals] = useState(sampleGoals);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [milestones, setMilestones] = useState([""]);

    function toggleMilestone(goalId, milestoneId) {
        setGoals(currentGoals =>
            currentGoals.map(goal => {
                if (goal._id !== goalId) return goal;

                const milestones = goal.milestones.map(milestone =>
                    milestone._id === milestoneId
                        ? { ...milestone, completed: !milestone.completed }
                        : milestone
                );

                return { ...goal, milestones };
            })
        );
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
    
    function handleCreateGoal(event) {
        event.preventDefault();

        const cleanedTitle = title.trim();
        const cleanedMilestones = milestones
            .map(milestone => milestone.trim())
            .filter(Boolean);

        if (!cleanedTitle || cleanedMilestones.length === 0) {
            return;
        }

        const newGoal = {
            _id: crypto.randomUUID(),
            title: cleanedTitle,
            description: description.trim(),
            targetDate: targetDate || null,
            milestones: cleanedMilestones.map(milestone => ({
                _id: crypto.randomUUID(),
                title: milestone,
                completed: false
            }))
        };

        setGoals([...goals, newGoal]);

        setTitle("");
        setDescription("");
        setTargetDate("");
        setMilestones([""]);
        setShowModal(false);
    }


    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
            <Header />
            <div className="min-h-screen bg-gray-950 text-white p-6">
                <div className="max-w-5xl mx-auto">
                    <button onClick={() => setShowModal(true)} className='mt-8 mb-8 p-2 flex justify-between w-full cursor-pointer card-hover'>
                        <h3 className='text-3xl font-bold'>Add Goal</h3>
                        <div className='cursor-pointer text-emerald-600'> <Plus className='w-10 h-10' strokeWidth={3} /> </div>
                    </button>

                    <div className="space-y-4">
                        {goals.map(goal => {
                            const completed = goal.milestones.filter(milestone => milestone.completed).length;

                            const total = goal.milestones.length;
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

                                        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                                            isCompleted
                                                ? "bg-emerald-950 text-emerald-400"
                                                : "bg-blue-950 text-blue-400"
                                        }`}>
                                            {isCompleted ? "Completed" : "In progress"}
                                        </span>
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

                                    <div className="border-t border-zinc-800 mt-5 pt-5">
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
                                                        onChange={() =>
                                                            toggleMilestone(
                                                                goal._id,
                                                                milestone._id
                                                            )
                                                        }
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
                                                The goal cannot be completed until all milestones are checked.
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
                                    onSubmit={handleCreateGoal}
                                    className="mb-6 border border-zinc-800 rounded-2xl p-5 bg-zinc-950 space-y-4">
                                        <h2 className="text-xl font-semibold">Create a new goal</h2>

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
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-900"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                                    >
                                        Create goal
                                    </button>
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
