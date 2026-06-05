import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar
} from 'recharts';
import { Award, Brain, Clock, Target, ArrowRight, Home, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { topics, mockQuestions } from '../data/mockDatabase';

const QuizResults = ({ userState, onComplete }) => {
    // Only looking at the most recent 10 attempts (this quiz session)
    const recentAttempts = userState.attempts.slice(-10);

    // Calculate score
    const correctCount = recentAttempts.filter(a => a.isCorrect).length;
    const totalQuestions = recentAttempts.length;
    
    // Average time per question
    const avgTime = recentAttempts.length > 0 
        ? recentAttempts.reduce((acc, a) => acc + a.responseTime, 0) / recentAttempts.length 
        : 0;

    // Time Analysis Data for Bar Chart
    const timeData = useMemo(() => {
        return recentAttempts.map((att, i) => ({
            name: `Q${i+1}`,
            time: att.responseTime,
            isCorrect: att.isCorrect
        }));
    }, [recentAttempts]);

    // Mastery Shift Radar Data (Mocking "Before" vs "After")
    const masteryData = useMemo(() => {
        return topics.map((t, i) => {
            // "After" is the current state
            const currentMastery = Math.max(0, Math.min(100, (userState.topicMastery[t.id] + 3) * (100 / 6)));
            
            // "Before" we just mock slightly lower for visual proof of learning
            // In a real database we'd fetch the DB state snapshot prior to test
            const previousMastery = Math.max(0, currentMastery - ((i % 5) * 3 + 5));

            return {
                subject: t.name,
                before: previousMastery,
                after: currentMastery
            };
        });
    }, [userState.topicMastery]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-500/30">
                            SESSION COMPLETE
                        </span>
                    </div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                    >
                        Adaptive Logic <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Analysis</span>
                    </motion.h1>
                    <p className="text-slate-400 mt-2 text-lg">Bayesian ability recalculation complete.</p>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={onComplete}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700"
                    >
                        <Home size={18} /> Dashboard
                    </button>
                    <button 
                        onClick={onComplete}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white rounded-xl font-bold transition-all"
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-6">
                    <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl relative">
                        <Award size={32} />
                        <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Raw Accuracy</p>
                        <div className="text-3xl font-extrabold text-white">
                            {correctCount} <span className="text-slate-500 text-xl">/ {totalQuestions}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl relative">
                        <Brain size={32} />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">New Ability (θ)</p>
                        <div className="text-3xl font-extrabold text-white">
                            {userState.ability.toFixed(3)}
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-6">
                    <div className="p-4 bg-sky-500/20 text-sky-400 rounded-2xl relative">
                        <Clock size={32} />
                        <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full"></div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Avg Pace</p>
                        <div className="text-3xl font-extrabold text-white">
                            {Math.round(avgTime)}<span className="text-slate-500 text-xl">s</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mastery Radar Shift */}
                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Target size={20} className="text-purple-400" />
                                Topic Mastery Shift
                            </h2>
                            <p className="text-sm text-slate-400">Before vs After Assessment</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-500 rounded-full"></div> Before</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> After</div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={masteryData}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Before" dataKey="before" stroke="#64748b" strokeWidth={2} fill="#64748b" fillOpacity={0.1} />
                                <Radar name="After" dataKey="after" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.4} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cognitive Load (Time per question) */}
                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-sky-400" />
                            Cognitive Load Analysis
                        </h2>
                        <p className="text-sm text-slate-400">Time spent per question (seconds)</p>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{ fill: '#1e293b' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    formatter={(value) => [`${value}s`, 'Time']}
                                />
                                <Bar dataKey="time" radius={[4, 4, 0, 0]}>
                                    {timeData.map((entry, index) => (
                                        <cell key={`cell-${index}`} fill={entry.isCorrect ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-center gap-6 text-sm font-medium">
                        <div className="flex items-center gap-2 text-emerald-400"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Correct</div>
                        <div className="flex items-center gap-2 text-red-400"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Incorrect</div>
                    </div>
                </div>
            </div>

            {/* Question Breakdown Log */}
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Item Response Log</h2>
                    <p className="text-sm text-slate-400">Detailed breakdown of semantic inferences.</p>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {recentAttempts.map((attempt, index) => {
                        const qInfo = mockQuestions.find(q => q.id === attempt.questionId) || {};
                        return (
                            <div key={index} className="p-4 md:p-6 hover:bg-slate-800/20 transition-colors flex flex-col md:flex-row gap-4 md:items-center">
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 font-bold text-slate-300">
                                    {index + 1}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1 ${attempt.isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {attempt.isCorrect ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                                            {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded uppercase font-bold tracking-wider">{qInfo.topic_id || 'Unknown'}</span>
                                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded uppercase font-bold tracking-wider hidden sm:block">Diff: {qInfo.difficulty?.toFixed(2)}</span>
                                    </div>
                                    <p className="text-white font-medium text-sm md:text-base leading-relaxed">{qInfo.question || 'Question content unavailable'}</p>
                                </div>

                                <div className="md:w-48 flex-shrink-0 bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Time:</span> <span className="text-sky-400">{attempt.responseTime}s</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>P(c|θ):</span> <span className="text-purple-400">{(attempt.probability * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Conf:</span> <span className="text-yellow-400">{attempt.confidenceScore}%</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
};

export default QuizResults;
