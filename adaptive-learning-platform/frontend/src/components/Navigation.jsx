import React from 'react';
import { Home, PlayCircle, BarChart2, BookOpen, Settings, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = ({ currentView, setCurrentView, onReset }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'test', label: 'Take Quiz', icon: PlayCircle },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'study', label: 'Study Plan', icon: BookOpen },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-20 md:w-64 glass-card border-r border-slate-800 z-50 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-center md:justify-start p-6 md:px-8 bg-slate-900/40 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-sky-500 shadow-neon flex items-center justify-center font-bold text-white mr-0 md:mr-3">
                        AI
                    </div>
                    <h1 className="hidden md:block font-bold text-lg tracking-wider text-gradient">
                        SkillForge
                    </h1>
                </div>

                <nav className="mt-8 px-4 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative ${isActive
                                    ? 'text-white bg-slate-800/80 shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-purple-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-md shadow-[0_0_10px_#a855f7]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                                <Icon size={20} className={isActive ? 'text-purple-400' : ''} />
                                <span className="hidden md:block font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => setCurrentView('profile')}
                    className={`flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl transition-all w-full mb-2 ${currentView === 'profile'
                        ? 'text-white bg-slate-800/80 shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-purple-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                >
                    <Settings size={20} className={currentView === 'profile' ? 'text-purple-400' : ''} />
                    <span className="hidden md:block font-medium">Profile</span>
                </button>

                <button
                    onClick={onReset}
                    className="w-full flex items-center justify-center md:justify-start gap-4 p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Reset All Progress"
                >
                    <RefreshCw size={20} />
                    <span className="hidden md:block font-medium">Reset Data</span>
                </button>
            </div>
        </div>
    );
};

export default Navigation;
