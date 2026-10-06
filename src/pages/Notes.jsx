import Header from '../components/Header';
import { useState, useEffect  } from 'react';
import { ChevronDown, Plus, X, Pencil, Trash2, Sparkles  } from 'lucide-react';

function Notes() { 
    const [courses, setCourses] = useState(() => {
        const savedCourses = localStorage.getItem("courses");

        if (savedCourses) {
            return JSON.parse(savedCourses);
        } else {
            return [];
        }
    }) 

    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem("notes");

        if (savedNotes) {
            return JSON.parse(savedNotes);
        } else {
            return [];
        }
    })

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [error, setError] = useState("");
    const [editingNote, setEditingNote] = useState(null);

    const courseColors = {
        blue: "bg-blue-600/70",
        green: "bg-emerald-600/70",
        purple: "bg-purple-600/70",
        orange: "bg-orange-600/70",
        red: "bg-red-600/70"
    }

    const courseButtonColors = {
        blue: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/40 font-semibold",
        green: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/40 font-semibold",
        purple: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/40 font-semibold",
        orange: "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border-orange-500/40 font-semibold",
        red: "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/40 font-semibold"
    };

    const courseBorderColors = {
        blue: "border-l-blue-600/50",
        green: "border-l-emerald-600/50",
        purple: "border-l-purple-600/50",
        orange: "border-l-orange-600/50",
        red: "border-l-red-600/50"
    }

    function addNote() {
        if (!noteTitle) {
            setError("Title is required")
            return
        }

        setError("");

        const newNote = {
            id: Date.now(),
            title: noteTitle,
            content: noteContent,
            course: selectedCourse.courseName
        }

        setNotes([...notes, newNote]);
        closeModal();
    }

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    function closeModal() {
        setShowModal(false);
        setNoteTitle('');
        setNoteContent('');
        setEditingNote(null);
        setError('');
    }  

    function editNote(note) {
        setEditingNote(note);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setSelectedCourse(
            courses.find(course => course.courseName === note.course)
        );
        setShowModal(true);
    }

    function saveEditedNote() {
        const updatedNotes = notes.map(note => {
            if (note.id === editingNote.id) {
                return {
                    ...note,
                    title: noteTitle,
                    content: noteContent
                };
            }
            else {
                return note;
            }
        });

        setNotes(updatedNotes);
        closeModal();
    }

    function deleteNote(noteId) {
        const updatedNotes = notes.filter(note => note.id !== noteId);

        setNotes(updatedNotes);
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="flex gap-3 mt-8 flex-wrap">
                    <div className="flex flex-col gap-4 w-full">
                        {
                            courses.length === 0 ? (
                                <div className="text-center py-16">
                                    <h2 className="text-2xl font-semibold text-gray-300">
                                        No courses yet
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        Add a course to start creating notes.
                                    </p>
                                </div>
                            ) : (
                                courses.map(course => {

                                    const courseNotes = notes.filter(
                                        note => note.course === course.courseName
                                    );

                                    return (
                                        <div
                                            key={course.courseName}
                                            className={`w-full rounded-2xl transition-all duration-200 border border-gray-800 bg-gray-900 overflow-hidden ${
                                                selectedCourse?.courseName === course.courseName
                                                    ? "ring-2 ring-white"
                                                    : ""
                                            }`}
                                        >
                                            <div
                                                onClick={() =>
                                                    setSelectedCourse(
                                                        selectedCourse?.courseName === course.courseName
                                                            ? null
                                                            : course
                                                    )
                                                }
                                                className="w-full p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">

                                                    {/* Course information */}
                                                    <div className="flex items-center gap-4 text-left">

                                                        <div
                                                            className={`w-2 h-12 rounded-full ${
                                                                courseColors[course.courseColor]
                                                            }`}
                                                        ></div>

                                                        <div>
                                                            <h2 className="text-2xl font-semibold">
                                                                {course.courseName}
                                                            </h2>

                                                            <p className="text-gray-400 text-sm mt-1">
                                                                {courseNotes.length} {courseNotes.length === 1 ? "note" : "notes"}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {/* Right side */}
                                                    <div className="flex items-center gap-3">

                                                        {/* Add Note */}
                                                        <button
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                setSelectedCourse(course);
                                                                setShowModal(true);
                                                            }}
                                                            className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-colors cursor-pointer border ${
                                                                courseButtonColors[course.courseColor]
                                                            }`}
                                                        >
                                                            <Plus size={18} />
                                                            Add Note
                                                        </button>

                                                        {/* Arrow */}
                                                        <ChevronDown
                                                            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                                                                selectedCourse?.courseName === course.courseName
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }`}
                                                        />

                                                    </div>

                                                </div>
                                            </div>

                                            {/* Expanded section */}
                                            {selectedCourse?.courseName === course.courseName && (
                                                <div className="px-4 pb-4">
                                                    <div className="border-t border-gray-800 pt-4">

                                                        {courseNotes.length === 0 ? (
                                                            <p className="text-gray-500 text-center py-4">
                                                                No notes yet.
                                                            </p>
                                                        ) : (
                                                            courseNotes.map(note => (
                                                                <div
                                                                    key={note.id}
                                                                    className={`bg-gray-800/50 rounded-xl p-4 mb-3 border-l-3 ${courseBorderColors[selectedCourse.courseColor]}`}
                                                                >
                                                                    <div className="flex items-start justify-between gap-4">

                                                                        <div className="min-w-0">
                                                                            <h3 className="text-xl font-semibold">
                                                                                {note.title}
                                                                            </h3>

                                                                            <p className="text-gray-400 mt-2 line-clamp-2">
                                                                                {note.content}
                                                                            </p>

                                                                            <p className="text-sm text-gray-500 mt-3">
                                                                                Date: {new Date(note.id).toLocaleDateString("en-US", {
                                                                                    month: "long",
                                                                                    day: "numeric",
                                                                                    year: "numeric"
                                                                                })}
                                                                            </p>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 shrink-0">

                                                                            {/* AI Summary */}
                                                                            <button
                                                                                className="p-2 flex rounded-lg text-purple-400 hover:text-purple-300 border border-gray-600 hover:bg-purple-500/10 transition-colors cursor-pointer"
                                                                                onClick={() => summarizeNote(note)}
                                                                                title="Summarize with AI"
                                                                            >
                                                                                <Sparkles size={18} />
                                                                            </button>

                                                                            {/* Edit */}
                                                                            <button
                                                                                className="p-2 rounded-lg text-gray-400 hover:text-white border border-gray-600 hover:bg-gray-700 transition-colors cursor-pointer"
                                                                                onClick={() => editNote(note)}
                                                                            >
                                                                                <Pencil size={18} />
                                                                            </button>

                                                                            {/* Delete */}
                                                                            <button
                                                                                className="p-2 rounded-lg text-red-500 hover:text-red-400 border border-gray-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                                                onClick={() => deleteNote(note.id)}
                                                                            >
                                                                                <Trash2 size={18} />
                                                                            </button>

                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}

                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    );
                                })
                            )
                        }
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

                        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Add Note
                                    </h2>

                                    <p className="text-sm text-gray-400 mt-1">
                                        Course: <span className='font-bold'>{selectedCourse?.courseName}</span>
                                    </p>
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    <X size={22} />
                                </button>

                            </div>

                            <section className="p-6 flex flex-col gap-5">

                                {/* Title */}
                                <div className="flex flex-col gap-2">

                                    <label className="text-sm font-medium text-gray-300">
                                        Note Title
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. SQL Joins"
                                        value={noteTitle}
                                        onChange={(e) => setNoteTitle(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                                    />

                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm">
                                        {error}
                                    </p>
                                )}

                                <div className="flex flex-col gap-2">

                                    <label className="text-sm font-medium text-gray-300">
                                        Note Content
                                    </label>

                                    <textarea
                                        placeholder="Write your notes here..."
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        rows={12}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-y"
                                    />

                                    <p className="text-xs text-gray-600">
                                        You can write as much as you need.
                                    </p>

                                </div>

                                <div className="flex justify-end gap-3 pt-2">

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={editingNote ? saveEditedNote : addNote}
                                        className="px-5 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-600 active:bg-emerald-800 transition-colors cursor-pointer"
                                    >
                                        {editingNote ? "Save Changes" : "Add Note"}
                                    </button>

                                </div>

                            </section>

                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}

export default Notes;