import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Brain, Target, TrendingUp, Award, Zap, BookOpen, Star } from 'lucide-react';
import { predictFinalScore } from '../services/mlPredictor';
import { topics } from '../data/mockDatabase';

const StatCard = ({ title, value, subtitle, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={64} className="text-purple-500" />
        </div>
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Icon size={20} className="text-purple-400" />
            </div>
            <h3 className="text-slate-400 font-medium text-sm tracking-wide uppercase">{title}</h3>
        </div>
        <div className="mt-4">
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                {value}
            </span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-2 font-medium">{subtitle}</p>}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-sky-500 opacity-50 group-hover:opacity-100 transition-opacity w-full"></div>
    </motion.div>
);

const Dashboard = ({ userState, onStartTest, onViewResults }) => {
    // Generate mock growth data based on attempts
    const growthData = useMemo(() => {
        let currentAbility = 0;
        const data = [{ attempt: 0, ability: 0 }];
        for (let i = 0; i < userState.attempts.length; i++) {
            const att = userState.attempts[i];
            currentAbility += att.isCorrect ? 0.2 : -0.15;
            data.push({
                attempt: i + 1,
                ability: (currentAbility + (i * 0.05)).toFixed(2)
            });
        }
        return data;
    }, [userState.attempts]);

    // Transform mastery data for Radar chart
    const masteryData = useMemo(() => {
        return topics.map(t => ({
            subject: t.name,
            // Map mastery (-3 to 3) to 0-100 scale for visual
            score: Math.max(0, Math.min(100, (userState.topicMastery[t.id] + 3) * (100 / 6)))
        }));
    }, [userState.topicMastery]);

    // Calculate ML Prediction
    const masteryVariance = 1.5; // Mock variance for now
    const hasEnrolledCourses = userState.enrolledCourses && userState.enrolledCourses.length > 0;
    const avgTime = userState.attempts.length > 0
        ? userState.attempts.reduce((acc, a) => acc + a.responseTime, 0) / userState.attempts.length
        : 120;

    const predictedScore = predictFinalScore(userState.ability, avgTime, masteryVariance).toFixed(1);

    // Convert Ability (-4 to 4) to 130-170 scaled score (GRE Equivalent approximation)
    const mathScore = Math.max(130, Math.min(170, Math.round(150 + (userState.ability * 5))));

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-sky-400 to-emerald-400 pb-2"
                    >
                        Welcome, {userState.name}
                    </motion.h1>
                    <p className="text-slate-400 font-medium">Your Neural Adaptive Learning Engine is Ready.</p>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-4 justify-center md:items-end w-full md:w-auto mt-6 md:mt-0">
                    <div className="flex gap-4">
                        <button
                            onClick={onViewResults}
                            disabled={userState.attempts.length === 0}
                            className={`px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                userState.attempts.length > 0
                                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-lg'
                                : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                            }`}
                        >
                            Past Results
                        </button>
                        <button
                            onClick={onStartTest}
                            disabled={!hasEnrolledCourses}
                            className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
                                hasEnrolledCourses 
                                ? 'bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}
                        >
                            <Zap size={20} className={hasEnrolledCourses ? "text-yellow-300" : "text-slate-600"} /> Take Quiz
                        </button>
                    </div>
                    {!hasEnrolledCourses && (
                        <p className="text-xs text-red-400 font-medium text-center md:text-right max-w-[200px]">
                            Enroll in at least one course to unlock adaptive quizzes.
                        </p>
                    )}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Current Ability (θ)"
                    value={userState.ability.toFixed(2)}
                    subtitle="Bayesian 2PL Estimate"
                    icon={Brain}
                    delay={0.1}
                />
                <StatCard
                    title="Est. Standard Score"
                    value={mathScore}
                    subtitle="130-170 Scale Equivalent"
                    icon={Target}
                    delay={0.2}
                />
                <StatCard
                    title="Questions Solved"
                    value={userState.attempts.length}
                    subtitle="Across all difficulty levels"
                    icon={TrendingUp}
                    delay={0.3}
                />
                <StatCard
                    title="ML Score Predictor"
                    value={`${predictedScore}%`}
                    subtitle="Random Forest Prediction"
                    icon={Award}
                    delay={0.4}
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Growth Curve */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-sky-400" />
                                Ability Growth Curve
                            </h2>
                            <p className="text-sm text-slate-400">Real-time Bayesian state update</p>
                        </div>
                        <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-xs text-sky-300 font-mono">
                            Live updates
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="attempt" stroke="#64748b" tick={{ fill: '#64748b' }} tickLine={false} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#38bdf8' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="ability"
                                    stroke="#38bdf8"
                                    strokeWidth={3}
                                    dot={{ fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 8, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Topic Mastery Radar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col"
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target size={20} className="text-purple-400" />
                            Topic Mastery
                        </h2>
                        <p className="text-sm text-slate-400">Expected vs Performed</p>
                    </div>
                    <div className="flex-1 min-h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={masteryData}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Mastery"
                                    dataKey="score"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    fill="#a855f7"
                                    fillOpacity={0.4}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#a855f7' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Insights & Weak Topics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="glass-card rounded-2xl border border-slate-800 p-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Brain size={20} className="text-emerald-400" />
                        AI Suggestions & Insights
                    </h2>
                    <div className="space-y-4 text-slate-300 font-medium font-mono text-sm leading-relaxed">
                        <p className="flex items-start gap-3">
                            <span className="text-emerald-400 mt-1">▶</span>
                            <span>System has analyzed {userState.attempts.length} data points using a 2PL Item Response Theory model. Your current ability factor (θ) is structurally converging at {userState.ability.toFixed(3)}.</span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-purple-400 mt-1">▶</span>
                            <span>Regression models predict a final testing readiness of {predictedScore}%. Optimal pacing is observed with an average response time of {Math.round(avgTime)}s per conceptual block.</span>
                        </p>
                        <p className="flex items-start gap-3 items-center">
                            <span className="text-yellow-400 mt-1">▶</span>
                            <span>Spaced repetition engine scheduling highly recommended for: <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded mx-1">Geometry</span></span>
                        </p>
                    </div>
                </motion.div>

                {/* Enrolled Courses Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="glass-card rounded-2xl border border-slate-800 p-6 relative overflow-hidden"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
                        <BookOpen size={20} className="text-sky-400" />
                        Enrolled Courses Status
                    </h2>

                    {(!userState.enrolledCourses || userState.enrolledCourses.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm italic">
                            <BookOpen size={32} className="mb-2 opacity-50" />
                            No courses enrolled yet. Please visit the Courses directory.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userState.enrolledCourses.map((courseId) => {
                                // Find course name from a small local map since Dashboard doesn't own courses array directly
                                // For scale this would use a global store or context
                                const courseMap = {
                                    'c_python': 'Python for AI & Data Science',
                                    'c_dsa': 'Advanced Data Structures & Algorithms',
                                    'c_react': 'Modern React & Frontend Engineering',
                                    'c_system_design': 'Distributed System Design'
                                };
                                const courseName = courseMap[courseId] || courseId;

                                return (
                                    <div key={courseId} className="bg-slate-900/40 border border-slate-700 p-4 rounded-xl flex items-center justify-between group hover:border-sky-500/50 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-white">{courseName}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-xs">
                                                <span className="text-slate-400">Progress: <span className="text-sky-400">In Progress</span></span>
                                                <span className="text-yellow-500 flex items-center"><Star size={10} className="inline mr-1" /> Active</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
