import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Settings, LogOut, Shield, Award, Activity } from 'lucide-react';

const Profile = ({ userState, onLogout }) => {

    // Calculate simple stats
    const totalAttempts = userState.attempts.length;
    const accuracy = totalAttempts > 0
        ? Math.round((userState.attempts.filter(a => a.isCorrect).length / totalAttempts) * 100)
        : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400 mb-2 flex items-center gap-3">
                        <User className="text-purple-400" size={32} />
                        Profile Configuration
                    </h1>
                    <p className="text-slate-400 font-medium">Manage your Neural Engine account parameters.</p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold border border-red-500/30 rounded-xl transition-colors"
                >
                    <LogOut size={18} />
                    Secured Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ID Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-1 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center relative overflow-hidden h-fit"
                >
                    <div className="absolute top-0 w-full h-24 bg-gradient-to-br from-purple-600/30 to-sky-500/30"></div>

                    <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-[#0f172a] shadow-xl relative z-10 flex items-center justify-center mt-8 mb-4">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
                            {userState.name.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1 relative z-10">{userState.name}</h2>
                    <p className="text-slate-400 text-sm flex items-center gap-2 relative z-10 mb-6 font-mono">
                        <Mail size={14} /> {userState.email}
                    </p>

                    <div className="w-full flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-800 mt-2 relative z-10">
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2"><Shield size={14} /> Access Level</span>
                        <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Student</span>
                    </div>
                </motion.div>

                {/* Lifetime Stats & Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 space-y-8"
                >
                    {/* Stats */}
                    <div className="glass-card p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-4">
                            <Activity size={18} className="text-purple-400" />
                            Lifetime Telemetry
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-1">Current Ability (θ)</span>
                                <span className="text-3xl font-bold focus text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">{userState.ability.toFixed(2)}</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-1">Global Accuracy</span>
                                <span className="text-3xl font-bold focus text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{accuracy}%</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 col-span-2 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                                        <Award size={20} className="text-yellow-500" />
                                    </div>
                                    <span className="text-sm text-slate-300 font-medium tracking-wide">Questions Solved</span>
                                </div>
                                <span className="text-xl font-bold text-white font-mono">{totalAttempts}</span>
                            </div>
                        </div>
                    </div>

                    {/* App Settings Mock */}
                    <div className="glass-card p-6 rounded-2xl border border-slate-800 opacity-50 pointer-events-none">
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-4">
                            <Settings size={18} className="text-slate-400" />
                            Application Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <div>
                                    <p className="font-bold text-slate-300">Dark Mode Protocol</p>
                                    <p className="text-xs text-slate-500">Lock interface to futuristic theme</p>
                                </div>
                                <div className="w-12 h-6 bg-purple-600 rounded-full relative shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                <div>
                                    <p className="font-bold text-slate-300">Telemetry Data Sharing</p>
                                    <p className="text-xs text-slate-500">Allow engine to train on your metrics</p>
                                </div>
                                <div className="w-12 h-6 bg-purple-600 rounded-full relative shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
