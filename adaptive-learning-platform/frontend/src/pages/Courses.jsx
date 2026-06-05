import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Star, Clock, Flame, CheckCircle, ArrowRight, X, PlayCircle } from 'lucide-react';
import { api } from '../services/api';

const Courses = ({ userState, enrollCourse }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // A mapping/array of course IDs the user is currently enrolled in
    const enrolledIds = userState.enrolledCourses || [];

    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await api.getCourses();
                setAvailableCourses(data);
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setLoading(false);
            }
        };
        loadCourses();
    }, []);

    const categories = useMemo(() => ['All', ...new Set(availableCourses.map(c => c.category))], [availableCourses]);

    const filteredCourses = useMemo(() => {
        return availableCourses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, availableCourses]);

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                    Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">Directory</span>
                </h1>
                {loading && <p className="text-purple-400 mt-4 animate-pulse">Loading latest courses from Neural Engine...</p>}
                <p className="text-slate-400 max-w-2xl text-lg">
                    Enroll in specialized tracks to refine your technical skills. Our Neural Engine will adapt your quizzes based on your active enrollments.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-shrink-0">
                    <select
                        className="w-full md:w-auto px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredCourses.map((course, index) => {
                    const isEnrolled = enrolledIds.includes(course.id);

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={course.id}
                            className={`glass-card p-6 md:p-8 rounded-2xl border transition-all group ${isEnrolled
                                ? 'border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.1)]'
                                : 'border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-2">
                                    {course.tags.map(tag => (
                                        <span key={tag} className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded font-bold text-sm">
                                    <Star size={14} fill="currentColor" /> {course.rating}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                            <p className="text-slate-400 mb-6 min-h-[48px]">{course.description}</p>

                            <div className="flex flex-wrap gap-4 mb-8 text-sm text-slate-300 font-medium">
                                <div className="flex items-center gap-2">
                                    <Flame size={16} className="text-red-400" />
                                    {course.level}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-sky-400" />
                                    {course.duration}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                <div className="font-bold text-lg text-white">Free</div>
                                {isEnrolled ? (
                                    <button disabled className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-2">
                                        <CheckCircle size={16} /> Enrolled
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedCourse(course)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-colors flex items-center gap-2 group-hover:bg-purple-600 group-hover:border-purple-500"
                                    >
                                        View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Course Detail Modal */}
            <AnimatePresence>
                {selectedCourse && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl p-0 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="relative h-48 bg-gradient-to-r from-purple-900/50 to-slate-900 p-8 flex items-end">
                                <button
                                    onClick={() => setSelectedCourse(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-slate-300 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute top-4 left-4 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                                    {selectedCourse.category}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-extrabold text-white mb-2">{selectedCourse.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-slate-300">
                                        <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> {selectedCourse.rating}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {selectedCourse.duration}</span>
                                        <span className="flex items-center gap-1"><BookOpen size={14} /> {selectedCourse.topics.length} Modules</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3">About this Course</h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        {selectedCourse.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Curriculum Topics</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {selectedCourse.topics.map((topic, i) => {
                                            const isEnrolled = enrolledIds.includes(selectedCourse.id);
                                            // Mocking a topicId for now based on the topic name (e.g., "Arrays" -> "arrays")
                                            const topicId = topic.toLowerCase().replace(/\s+/g, '-');
                                            
                                            return (
                                                <div key={i} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-slate-700 text-slate-300 p-2 rounded-lg">
                                                            <PlayCircle size={16} />
                                                        </div>
                                                        <span className="text-slate-200 font-medium">Module {i + 1}: {topic}</span>
                                                    </div>
                                                    {isEnrolled && (
                                                        <button 
                                                            onClick={() => {
                                                                if (window.onStartModule) {
                                                                    window.onStartModule(topicId);
                                                                }
                                                            }}
                                                            className="px-4 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Start Module
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                                    <button
                                        onClick={() => setSelectedCourse(null)}
                                        className="px-6 py-3 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            enrollCourse(selectedCourse.id);
                                            setSelectedCourse(null);
                                        }}
                                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Courses;
