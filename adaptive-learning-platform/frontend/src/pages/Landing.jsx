import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Mail, Shield, Zap, Key, Smartphone, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useGoogleLogin } from '@react-oauth/google';

const Landing = ({ onLogin }) => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'

    const [name, setName] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [authError, setAuthError] = useState(null);

    // Mock Database for registered users (persists during the session in memory)
    const [userRegistry, setUserRegistry] = useState({});

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError(null);

        try {
            if (authMode === 'login') {
                const data = await api.login(emailOrUsername, password);
                localStorage.setItem('token', data.token);
                onLogin(data.user);
            }
            else if (authMode === 'register') {
                if (name.trim() && emailOrUsername.trim() && password.trim()) {
                    await api.register(name, emailOrUsername, password);
                    setRegistrationSuccess(true);
                    setAuthMode('login');
                    setPassword('');
                    setTimeout(() => setRegistrationSuccess(false), 5000);
                }
            }
            else if (authMode === 'forgot') {
                if (!otpSent) {
                    await api.forgotPassword(emailOrUsername);
                    setOtpSent(true);
                } else {
                    if (otp.trim() && password.trim()) {
                        await api.resetPassword(emailOrUsername, otp, password);
                        setResetSuccess(true);
                        setAuthMode('login');
                        setPassword('');
                        setOtp('');
                        setOtpSent(false);
                        setTimeout(() => setResetSuccess(false), 5000);
                    } else {
                        setAuthError("Please enter OTP and new password.");
                    }
                }
            }
        } catch (error) {
            setAuthError(error.message || "An error occurred during authentication.");
            console.error("Auth error:", error);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Fetch user profile from Google
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                }).then(res => res.json());

                // Pass the profile to our backend
                const data = await api.googleLogin(userInfo);
                localStorage.setItem('token', data.token);
                onLogin(data.user);
            } catch (error) {
                setAuthError(error.message || "Google login failed.");
                console.error("Google Auth Error:", error);
            }
        },
        onError: () => setAuthError("Google login failed")
    });

    const openModal = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
        // Reset states
        setOtpSent(false);
        setOtp('');
        setPassword('');
        setRegistrationSuccess(false);
        setResetSuccess(false);
        setAuthError(null);
    };

    const handleAdminLogin = async () => {
        try {
            // For convenience locally, automatically logging in backend admin or test student
            const data = await api.login("student@example.com", "password123");
            localStorage.setItem('token', data.token);
            onLogin(data.user);
        } catch (error) {
            setAuthError("Failed to login test user.");
        }
    };
    
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#4c2454] text-white">
            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <BookOpen className="text-purple-400" size={28} />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-sky-400">
                        SkillForge
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <a href="#" className="hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg">Home</a>
                    <a href="#" className="hover:text-white transition-colors">Courses</a>
                    <a href="#" className="hover:text-white transition-colors">About</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => openModal('register')}
                        className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Register
                    </button>
                    <button
                        onClick={() => openModal('login')}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center justify-between gap-16">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:w-1/2 flex flex-col items-start"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                        Master New Skills <br />
                        with <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">SkillForge</span>
                    </h1>

                    <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
                        SkillForge – AI Driven Adaptive Learning and Exam Generator. Learn from industry experts, enroll in DSA and Programming courses, and transform your career using Bayesian adaptive assessments.
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                        <button
                            onClick={() => openModal('register')}
                            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105"
                        >
                            Explore Courses
                        </button>
                        <button className="px-8 py-3 border-2 border-slate-300/30 hover:bg-slate-300/10 text-white font-bold rounded-xl transition-all">
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Right Content - Hero Image / Graphic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:w-1/2 w-full max-w-xl relative"
                >
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl"></div>

                    <div className="relative glass-card rounded-2xl p-2 border border-slate-600/50 shadow-2xl overflow-hidden aspect-[4/3]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 to-slate-900/40 z-10 mix-blend-overlay"></div>
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Students collaborating"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                </motion.div>
            </main>

            {/* Auth Modal Overlay */}
            <AnimatePresence>
                {showAuthModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f172a] border border-slate-700/50 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-md w-full relative overflow-hidden"
                        >
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 blur-[50px] rounded-full"></div>

                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>

                            <div className="flex items-center justify-center mb-6 relative z-10">
                                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <Shield className="text-purple-400" size={24} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-white mb-2 relative z-10">
                                {authMode === 'login' ? 'Welcome Back' :
                                    authMode === 'register' ? 'Join SkillForge' :
                                        'Reset Password'}
                            </h2>
                            <p className="text-center text-slate-400 mb-4 text-sm relative z-10">
                                {authMode === 'login' ? 'Enter your credentials to access your courses.' :
                                    authMode === 'register' ? 'Create an account to start your adaptive learning journey.' :
                                        otpSent ? 'Enter the OTP sent to your email.' : 'Enter your email to receive a recovery OTP.'}
                            </p>

                            <AnimatePresence>
                                {registrationSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm text-center font-medium relative z-10"
                                    >
                                        Registration successful! Please log in with your new credentials.
                                    </motion.div>
                                )}
                                {resetSuccess && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm text-center font-medium relative z-10"
                                    >
                                        Password reset successfully! Please log in.
                                    </motion.div>
                                )}
                                {authError && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-medium relative z-10"
                                    >
                                        {authError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Google Login Button Button */}
                            {authMode !== 'forgot' && (
                                <div className="mb-6 relative z-10">
                                    <button
                                        onClick={handleGoogleLogin}
                                        type="button"
                                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-slate-800 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm mb-3"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                    
                                    {authMode === 'login' && (
                                        <button
                                            onClick={handleAdminLogin}
                                            type="button"
                                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                                        >
                                            <Shield size={18} className="text-red-400" />
                                            Instructor / Admin Login
                                        </button>
                                    )}

                                    <div className="flex items-center my-4">
                                        <div className="flex-grow border-t border-slate-700"></div>
                                        <span className="px-3 text-slate-500 text-xs font-bold uppercase">Or</span>
                                        <div className="flex-grow border-t border-slate-700"></div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10">
                                {authMode === 'register' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                placeholder="Alex Doe"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                )}

                                {(!otpSent || authMode !== 'forgot') && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">
                                            {authMode === 'register' ? 'Email' : 'Username or Email'}
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type={authMode === 'register' ? 'email' : 'text'}
                                                value={emailOrUsername}
                                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                                required
                                                placeholder={authMode === 'register' ? "alex@example.com" : "alex@example.com or alexdoe"}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                )}

                                {authMode !== 'forgot' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5 px-1">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                            {authMode === 'login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => openModal('forgot')}
                                                    className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                                                >
                                                    Forgot?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-600"
                                            />
                                        </div>
                                    </div>
                                )}

                                {authMode === 'forgot' && otpSent && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">New Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-600"
                                                />
                                            </div>
                                        </div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 pl-1">Enter OTP</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                                placeholder="1234"
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-slate-600 tracking-widest font-mono"
                                            />
                                        </div>
                                        <p className="text-xs text-emerald-400 mt-2 text-center">OTP sent to your email!</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 mt-6 py-3 bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all group"
                                >
                                    {authMode === 'login' ? <><Zap size={18} className="text-yellow-300" /> Initialize Session</> :
                                        authMode === 'register' ? 'Register Account' :
                                            !otpSent ? 'Send OTP' : <><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> Reset Password</>}
                                </button>

                                <div className="text-center mt-4">
                                    {authMode === 'login' ? (
                                        <p className="text-xs text-slate-400">
                                            Don't have an account? <button type="button" onClick={() => openModal('register')} className="text-purple-400 hover:text-purple-300 font-bold ml-1 transition-colors">Register</button>
                                        </p>
                                    ) : authMode === 'register' ? (
                                        <p className="text-xs text-slate-400">
                                            Already have an account? <button type="button" onClick={() => openModal('login')} className="text-purple-400 hover:text-purple-300 font-bold ml-1 transition-colors">Log In</button>
                                        </p>
                                    ) : (
                                        <button type="button" onClick={() => openModal('login')} className="text-xs text-slate-400 hover:text-white transition-colors">Back to Login</button>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;
