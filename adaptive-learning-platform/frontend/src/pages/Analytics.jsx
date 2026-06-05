import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { topics } from '../data/mockDatabase';
import { Activity, Beaker, CheckCircle2, XCircle, Trophy, Globe, TrendingUp } from 'lucide-react';

const Analytics = ({ userState }) => {
    // Aggregate attempts per topic
    const performanceByTopic = topics.map(topic => {
        const attempts = userState.attempts.filter(a => a.topicId === topic.id);
        const correct = attempts.filter(a => a.isCorrect).length;
        const total = attempts.length;
        return {
            name: topic.name,
            correct,
            incorrect: total - correct,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
        };
    });

    // Generate Bell Curve Data points (Normal Distribution)
    // Formula: f(x) = (1 / (σ * sqrt(2π))) * e^(-0.5 * ((x-μ)/σ)^2)
    const generateBellCurveData = (mean, stdDev, userTheta) => {
        const data = [];
        for (let x = -3; x <= 3; x += 0.2) {
            const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                      Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
            
            // Mark if this segment represents the user's area
            const isUserRange = Math.abs(x - userTheta) <= 0.2;
            
            data.push({
                score: x.toFixed(1),
                population: y,
                userMarker: isUserRange ? y : null
            });
        }
        return data;
    };

    const userAbility = userState.ability || 0;
    const bellCurveData = generateBellCurveData(0, 1, userAbility); // Assuming mean 0, stdDev 1 for entire platform

    // Calculate Percentile using Error Function approximation
    const calcPercentile = (x) => {
        // Approximate standard normal CDF
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        if (x > 0) prob = 1 - prob;
        return (prob * 100).toFixed(1);
    };

    const userPercentile = calcPercentile(userAbility);

    // Mock Leaderboard Data
    const leaderboardData = [
        { rank: 1, name: 'Alice Wu', score: '99.9th', theta: 2.8 },
        { rank: 2, name: 'John Davis', score: '98.5th', theta: 2.1 },
        { rank: 3, name: 'Maria Garcia', score: '95.0th', theta: 1.6 },
        { rank: 4, name: 'Hasan Patel', score: '92.3th', theta: 1.4 },
        { rank: 5, name: 'You', score: `${userPercentile}th`, theta: userAbility.toFixed(2), isUser: true },
        { rank: 6, name: 'David Lee', score: '88.1th', theta: 1.1 }
    ].sort((a,b) => b.theta - a.theta).map((item, index) => ({...item, rank: index + 1}));

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 mb-2 flex items-center gap-3">
                    <Activity className="text-sky-400" size={32} />
                    Deep Analytics
                </h1>
                <p className="text-slate-400 font-medium">Detailed breakdown of your interactions with the Adaptive Engine.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-6 rounded-2xl border border-slate-800"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Topic Accuracy</h2>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceByTopic} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b' }} />
                                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
                                <Tooltip
                                    cursor={{ fill: '#0f172a', opacity: 0.5 }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#38bdf8' }}
                                    formatter={(value) => [`${value}%`, 'Accuracy']}
                                />
                                <Bar dataKey="accuracy" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Global Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass-card p-6 border border-slate-800 rounded-2xl flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Beaker size={20} className="text-emerald-400" />
                            Attempt Log Summary
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                <span className="text-slate-400 font-medium tracking-wide">Total Actions</span>
                                <span className="text-2xl font-bold text-white">{userState.attempts.length}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                <span className="text-emerald-400 font-medium tracking-wide flex items-center gap-2"><CheckCircle2 size={18} /> Validations</span>
                                <span className="text-2xl font-bold text-emerald-400">{userState.attempts.filter(a => a.isCorrect).length}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                <span className="text-red-400 font-medium tracking-wide flex items-center gap-2"><XCircle size={18} /> Errors</span>
                                <span className="text-2xl font-bold text-red-400">{userState.attempts.filter(a => !a.isCorrect).length}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Global Leaderboard & Peer Comparison Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bell Curve Percentile */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="glass-card p-6 border border-slate-800 rounded-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-purple-400" />
                                Peer Comparison
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Normal Distribution (Bell Curve)</p>
                        </div>
                        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-bold flex flex-col items-end">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Your Percentile</span>
                            {userPercentile}th
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 px-2 tracking-wide font-medium">
                        Your Ability Score (θ = {userAbility.toFixed(2)}) places you in the <span className="text-purple-400 font-bold">{userPercentile}th percentile</span> of all SkillForge users.
                    </p>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={bellCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorMarker" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="score" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis stroke="#475569" tick={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="population" stroke="#38bdf8" fillOpacity={1} fill="url(#colorPop)" isAnimationActive={true} />
                                {/* Overlay area specifically for the user's estimated position */}
                                <Area type="monotone" dataKey="userMarker" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorMarker)" isAnimationActive={true} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Global Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="glass-card flex flex-col border border-slate-800 rounded-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-800 bg-slate-900/40">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Globe size={20} className="text-sky-400" />
                                Global Leaderboard
                            </h2>
                            <Trophy size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto p-0">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/80">
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-16">Rank</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Percentile</th>
                                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right hidden sm:table-cell">Score (θ)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {leaderboardData.map((user) => (
                                    <tr key={user.name} className={`hover:bg-slate-800/30 transition-colors ${user.isUser ? 'bg-purple-500/10 border-l-4 border-l-purple-500' : 'border-l-4 border-l-transparent'}`}>
                                        <td className="p-4 text-center font-bold text-slate-300">
                                            {user.rank === 1 ? <span className="text-yellow-400">#1</span> : 
                                             user.rank === 2 ? <span className="text-slate-300">#2</span> : 
                                             user.rank === 3 ? <span className="text-amber-600">#3</span> : `#${user.rank}`}
                                        </td>
                                        <td className="p-4 font-bold">
                                            <span className={user.isUser ? 'text-purple-300' : 'text-slate-200'}>
                                                {user.name}
                                                {user.isUser && <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-[10px] rounded uppercase tracking-wider">You</span>}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-emerald-400 font-bold">{user.score}</td>
                                        <td className="p-4 text-right font-mono text-slate-400 text-sm hidden sm:table-cell">
                                            {Number(user.theta) > 0 ? '+' : ''}{user.theta}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default Analytics;
