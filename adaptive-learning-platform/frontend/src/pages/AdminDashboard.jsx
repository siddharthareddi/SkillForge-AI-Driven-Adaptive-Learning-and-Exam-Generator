import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Target, Brain, Search, PlusCircle, Database, CheckCircle2 } from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [mockAdded, setMockAdded] = useState(false);

    // Mock student data for Teacher View
    const students = [
        { id: '1', name: 'Alex Doe', email: 'alex@example.com', ability: 1.2, joined: '2023-10-15', status: 'Excellent', courses: 3 },
        { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', ability: -0.5, joined: '2023-11-02', status: 'Needs Help', courses: 1 },
        { id: '3', name: 'Michael Johnson', email: 'mike@example.com', ability: 0.8, joined: '2023-12-10', status: 'Good', courses: 4 },
        { id: '4', name: 'Emily Chen', email: 'emily@example.com', ability: 2.1, joined: '2024-01-05', status: 'Exceptional', courses: 5 },
        { id: '5', name: 'David Wilson', email: 'david@example.com', ability: -1.2, joined: '2024-01-20', status: 'At Risk', courses: 2 },
        { id: '6', name: 'You (Demo)', email: 'student@example.com', ability: 0.0, joined: 'Today', status: 'New', courses: 0 }
    ];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddQuestion = (e) => {
        e.preventDefault();
        setIsAddingQuestion(true);
        setTimeout(() => {
            setIsAddingQuestion(false);
            setMockAdded(true);
            setTimeout(() => setMockAdded(false), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider border border-red-500/30">
                            Instructor Privileges
                        </span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Command Center</span>
                    </motion.h1>
                    <p className="text-slate-400 mt-2 text-lg">Oversee all student metrics and database pools.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onLogout}
                        className="px-6 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors font-bold"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4 mb-4 text-slate-400">
                        <Users className="text-sky-400" />
                        <h3 className="font-bold">Total Students</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">1,248</div>
                    <p className="text-xs text-emerald-400 mt-2">+12 this week</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4 mb-4 text-slate-400">
                        <Target className="text-red-400" />
                        <h3 className="font-bold">Avg Ability (θ)</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">0.42</div>
                    <p className="text-xs text-slate-500 mt-2">Platform wide average</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4 mb-4 text-slate-400">
                        <BookOpen className="text-purple-400" />
                        <h3 className="font-bold">Active Courses</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">15</div>
                    <p className="text-xs text-slate-500 mt-2">Across 6 categories</p>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-4 mb-4 text-slate-400">
                        <Database className="text-emerald-400" />
                        <h3 className="font-bold">Question Pool</h3>
                    </div>
                    <div className="text-3xl font-extrabold text-white">4,892</div>
                    <p className="text-xs text-emerald-400 mt-2">Dynamic IRT items</p>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Student Roster (Takes up 2 cols) */}
                <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">Student Performance Roster</h2>
                            <p className="text-sm text-slate-400">Track individual Bayesian ability estimations.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search student..."
                                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-800">
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Ability (θ)</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{student.name}</div>
                                            <div className="text-xs text-slate-500">{student.email}</div>
                                        </td>
                                        <td className="p-4 font-mono">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${student.ability > 1 ? 'bg-emerald-500/10 text-emerald-400' :
                                                    student.ability < 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-800 text-slate-300'
                                                }`}>
                                                {student.ability > 0 ? '+' : ''}{student.ability.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">{student.courses} Courses</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold tracking-wider uppercase ${student.status === 'Excellent' || student.status === 'Exceptional' ? 'text-emerald-400' :
                                                    student.status === 'Needs Help' || student.status === 'At Risk' ? 'text-orange-400' : 'text-sky-400'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Question Tool */}
                <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-full">
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Brain className="text-purple-400" /> Item Calibration
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">Add new items to the IRT database.</p>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <form onSubmit={handleAddQuestion} className="space-y-4 flex-1">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Course / Topic</label>
                                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-red-500">
                                    <option>Data Structures</option>
                                    <option>Python</option>
                                    <option>System Design</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Question Text</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Enter question..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Base Diff (b)</label>
                                    <input type="number" step="0.1" defaultValue="0.0" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white text-center font-mono focus:outline-none focus:border-red-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Discrim (a)</label>
                                    <input type="number" step="0.1" defaultValue="1.0" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white text-center font-mono focus:outline-none focus:border-red-500" />
                                </div>
                            </div>

                            <div className="pt-4 mt-auto">
                                {mockAdded ? (
                                    <div className="w-full py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center gap-2">
                                        <CheckCircle2 size={18} /> Added to Pool
                                    </div>
                                ) : (
                                    <button
                                        disabled={isAddingQuestion}
                                        type="submit"
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isAddingQuestion ? 'bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]'}`}
                                    >
                                        {isAddingQuestion ? 'Calibrating...' : <><PlusCircle size={18} /> Inject Question</>}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
