import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, AlertTriangle, Calendar, Star, Clock } from 'lucide-react';
import { calculateNextReview } from '../services/spacedRepetition';
import { topics } from '../data/mockDatabase';

const StudyPlan = ({ userState }) => {
    const scheduleTasks = useMemo(() => {
        return topics.map(topic => {
            const mastery = userState.topicMastery[topic.id] || 0;

            // Calculate consecutive correct attempts
            const attempts = userState.attempts.filter(a => a.topicId === topic.id);
            let consecutive = 0;
            for (let i = attempts.length - 1; i >= 0; i--) {
                if (attempts[i].isCorrect) consecutive++;
                else break;
            }

            // Using mock previous interval as 0
            const reviewData = calculateNextReview(mastery, 0, consecutive);

            return {
                ...topic,
                mastery,
                ...reviewData,
                attemptsCount: attempts.length
            };
        }).sort((a, b) => a.nextIntervalDays - b.nextIntervalDays); // Sort by urgency
    }, [userState]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-2 flex items-center gap-3">
                        <BookOpen className="text-emerald-400" size={32} />
                        AI Study Schedule
                    </h1>
                    <p className="text-slate-400 font-medium">Spaced-repetition optimal review intervals mapped via SuperMemo-2 algorithms.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scheduleTasks.map((task, idx) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className={`glass-card p-6 rounded-2xl relative overflow-hidden group border ${task.isUrgent ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800'
                            }`}
                    >
                        {task.isUrgent && (
                            <div className="absolute top-0 right-0 p-3 bg-red-500/20 text-red-400 rounded-bl-2xl">
                                <AlertTriangle size={18} />
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-white mb-2">{task.name}</h3>

                        <div className="flex items-center gap-2 mb-6">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${task.mastery < 0 ? 'bg-red-500/20 text-red-400' :
                                    task.mastery > 1.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                Mastery Index: {task.mastery.toFixed(2)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-slate-400 flex items-center gap-2"><Calendar size={16} /> Next Review</span>
                                <span className={`font-mono font-bold ${task.nextIntervalDays <= 1 ? 'text-red-400' : 'text-slate-300'}`}>
                                    {task.nextIntervalDays <= 1 ? 'Today / Urgent' : `in ${task.nextIntervalDays} days`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-slate-400 flex items-center gap-2"><Star size={16} /> Ease Factor</span>
                                <span className="font-mono text-purple-400">{task.easeFactor.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-slate-400 flex items-center gap-2"><Clock size={16} /> Interactions</span>
                                <span className="font-mono text-slate-300">{task.attemptsCount} total</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${task.isUrgent
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {task.isUrgent ? 'Review Now' : 'Schedule Set'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudyPlan;
