import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle2, XCircle, BrainCircuit, Terminal, Video, FileText, ShieldAlert } from 'lucide-react';
import { selectNextQuestion } from '../services/adaptiveEngine';
import { calculateProbability, updateAbility, calculateTopicMastery } from '../services/irtModel';
import { api } from '../services/api';

const AdaptiveTest = ({ userState, topicId, onComplete, onCancel }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [cameraVerified, setCameraVerified] = useState(false);

    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswering, setIsAnswering] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [showTerminal, setShowTerminal] = useState(true);

    const videoRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);

    // Timer state
    const [timeSpent, setTimeSpent] = useState(0);
    const timerRef = useRef(null);

    // Confidence Slider
    const [confidence, setConfidence] = useState(50);

    // Local session state
    const [sessionState, setSessionState] = useState({ ...userState });
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const MAX_QUESTIONS = 5; // Reduced to 5 for testing/demo purposes

    const loadNextQuestion = (state, questionsPool = allQuestions) => {
        const answeredIds = state.attempts.map(a => a.questionId);
        const nextQ = selectNextQuestion(state.ability, answeredIds, state.topicMastery, state.enrolledCourses || [], questionsPool, topicId);

        if (!nextQ) return; // Wait for questions to load

        setCurrentQuestion(nextQ);
        setSelectedOption(null);
        setFeedback(null);
        setIsAnswering(false);
        setTimeSpent(0);
        setConfidence(50);

        // Add to terminal logs
        const logEntry = {
            id: Date.now(),
            type: 'system',
            text: `[SYS] Selected Question ID: ${nextQ.id}. Difficulty (b) = ${nextQ.difficulty.toFixed(2)}, Discrimination (a) = ${nextQ.discrimination.toFixed(2)}.`
        };
        setTerminalLogs(prev => [...prev.slice(-4), logEntry]);
    };

    // Fetch questions when quiz starts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // If we have a topicId, the backend restricts the returned pool to that topic
                const data = await api.getQuestions(topicId);
                setAllQuestions(data);
                loadNextQuestion(sessionState, data);
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        };

        if (quizStarted) {
            fetchQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizStarted, topicId]);

    // Timer logic
    useEffect(() => {
        if (currentQuestion && !isAnswering) {
            timerRef.current = setInterval(() => {
                setTimeSpent(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentQuestion, isAnswering]);

    // Media stream cleanup
    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStream]);

    const handleOptionSelect = (opt) => {
        if (!isAnswering) {
            setSelectedOption(opt);
        }
    };

    const handleSubmit = async () => {
        if (!selectedOption || isAnswering) return;

        setIsAnswering(true);
        clearInterval(timerRef.current);

        const isCorrect = selectedOption === currentQuestion.correct;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        // --- AI Engine Core Math Simulation ---
        const probability = calculateProbability(sessionState.ability, currentQuestion.discrimination, currentQuestion.difficulty);
        const newAbility = updateAbility(sessionState.ability, isCorrect, probability, sessionState.attempts.length);
        const newMastery = calculateTopicMastery(
            sessionState.topicMastery[currentQuestion.topic_id] || 0,
            isCorrect,
            probability
        );

        // Log Math to Terminal
        const mathLog = {
            id: Date.now() + 1,
            type: 'math',
            text: `[MATH] Current θ = ${sessionState.ability.toFixed(2)}. P(Correct) = (1 / 1 + e^-a(θ-b)) = ${(probability * 100).toFixed(1)}%`
        };

        const updateLog = {
            id: Date.now() + 2,
            type: isCorrect ? 'success' : 'error',
            text: `[UPDATE] User answered ${isCorrect ? 'correctly' : 'incorrectly'}. Bayesian update applied. New θ = ${newAbility.toFixed(2)}`
        };

        setTerminalLogs(prev => [...prev.slice(-3), mathLog, updateLog]);

        const newAttempt = {
            questionId: currentQuestion.id,
            topicId: currentQuestion.topic_id,
            isCorrect,
            probability,
            responseTime: timeSpent,
            confidenceScore: confidence,
            timestamp: Date.now()
        };

        const newState = {
            ...sessionState,
            ability: newAbility,
            topicMastery: {
                ...sessionState.topicMastery,
                [currentQuestion.topic_id]: newMastery
            },
            attempts: [...sessionState.attempts, newAttempt]
        };

        setSessionState(newState);

        try {
            // Save progress to the database via API
            await api.submitTestProgress(
                sessionState.userId || sessionState._id || 'u123', // handle mock or real DB ID
                newState.ability,
                newState.topicMastery,
                newState.attempts
            );
        } catch (error) {
            console.error('Failed to sync progress with backend:', error);
            // Even if sync fails, we let the user continue locally for resilience
        }

        // Wait before loading next question to show math feedback
        setTimeout(() => {
            if (questionsAnswered + 1 >= MAX_QUESTIONS) {
                onComplete(newState);
            } else {
                setQuestionsAnswered(prev => prev + 1);
                loadNextQuestion(newState);
            }
        }, 2500);
    };

    // ----------------------------------------------------
    // PROCTORED PRE-QUIZ ENVIRONMENT Screen
    // ----------------------------------------------------
    if (!quizStarted) {
        return (
            <div className="max-w-3xl mx-auto py-8 lg:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                        <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <ShieldAlert className="text-red-400" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Proctored Assessment Interface</h2>
                            <p className="text-slate-400 mt-1">SkillForge strict testing environment protocol initiation.</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        {/* Terms Block */}
                        <div className={`p-5 rounded-2xl border-2 transition-colors ${termsAccepted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-700'}`}>
                            <div className="flex gap-4 items-start">
                                <FileText className={termsAccepted ? 'text-emerald-400' : 'text-slate-400'} size={24} />
                                <div>
                                    <h3 className="font-bold text-white mb-2">Terms and Conditions of Testing</h3>
                                    <ul className="text-sm text-slate-400 space-y-2 mb-4 list-disc pl-4">
                                        <li>You must not switch away from this browser window.</li>
                                        <li>No external materials, phones, or assistance are permitted.</li>
                                        <li>This assessment uses Bayesian Adaptive Logic; accuracy and speed are tracked.</li>
                                    </ul>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${termsAccepted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 group-hover:border-purple-400'}`}>
                                            {termsAccepted && <CheckCircle2 size={16} className="text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                                        <span className={`font-medium ${termsAccepted ? 'text-emerald-400' : 'text-slate-300'}`}>I agree to the testing conditions</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Camera Block */}
                        <div className={`p-5 rounded-2xl border-2 transition-colors ${cameraVerified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-700'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex gap-4 items-center">
                                    <Video className={cameraVerified ? 'text-emerald-400' : 'text-slate-400'} size={24} />
                                    <div>
                                        <h3 className="font-bold text-white mb-1">Identity & Hardware Verification</h3>
                                        <p className="text-sm text-slate-400">Microphone and Camera must be active.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                                            setMediaStream(stream);
                                            if (videoRef.current) {
                                                videoRef.current.srcObject = stream;
                                            }
                                            setCameraVerified(true);
                                            setCameraError(null);
                                        } catch (err) {
                                            console.error("Camera access denied:", err);
                                            setCameraError("Camera access denied or device not found.");
                                        }
                                    }}
                                    className={`px-6 py-2 rounded-xl font-bold transition-all ${cameraVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default' : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'}`}
                                >
                                    {cameraVerified ? 'Verified' : 'Allow Access'}
                                </button>
                            </div>

                            {/* Camera Feed Display */}
                            {mediaStream && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-emerald-500/30 bg-black aspect-video relative max-w-sm mx-auto">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover transform -scale-x-100"
                                    />
                                    <div className="absolute top-2 left-2 flex items-center gap-2 px-2 py-1 bg-black/50 backdrop-blur text-emerald-400 rounded text-xs font-mono">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Feed
                                    </div>
                                </div>
                            )}
                            {cameraError && (
                                <p className="text-red-400 text-sm mt-3 font-medium flex items-center gap-2">
                                    <AlertCircle size={14} /> {cameraError}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={() => {
                                if (mediaStream) {
                                    mediaStream.getTracks().forEach(track => track.stop());
                                }
                                onCancel();
                            }}
                            className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!termsAccepted || !cameraVerified}
                            onClick={() => setQuizStarted(true)}
                            className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${(!termsAccepted || !cameraVerified) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-500 hover:to-purple-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]'}`}
                        >
                            INITIATE ADAPTIVE EXAM
                        </button>
                    </div>

                </motion.div>
            </div>
        )
    }

    if (!currentQuestion) return <div className="flex justify-center items-center h-full text-white">Initializing Engine...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Test Header */}
            <div className="flex justify-between items-center mb-6 glass-card p-4 rounded-2xl border border-slate-800 relative z-10 w-full">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                        <BrainCircuit className="text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-widest leading-none">IRT ENGINE RESPONDING</h2>
                        <p className="text-sm text-slate-400 font-mono mt-1">Question {questionsAnswered + 1} of {MAX_QUESTIONS} • Target θ {currentQuestion.difficulty.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <button
                        onClick={() => setShowTerminal(!showTerminal)}
                        className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border font-mono text-xs transition-colors ${showTerminal ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                    >
                        <Terminal size={14} /> AI Visualizer
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 hidden md:block">Time</span>
                        <div className={`flex items-center gap-1 md:gap-2 font-mono text-lg md:text-xl ${timeSpent > 90 ? 'text-red-400' : 'text-emerald-400'}`}>
                            <Clock size={16} />
                            {Math.floor(timeSpent / 60).toString().padStart(2, '0')}:{(timeSpent % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                    <button onClick={onCancel} className="px-3 py-2 md:px-4 md:py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm md:text-base">Abort</button>
                </div>
            </div>

            <div className={`flex flex-col ${showTerminal ? 'xl:flex-row' : ''} gap-6 relative`}>

                {/* Main Quiz Area */}
                <div className={`transition-all duration-300 ${showTerminal ? 'xl:w-2/3 flex-shrink-0' : 'w-full max-w-4xl mx-auto'}`}>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
                        >
                            {/* Subtle background glow representing difficulty */}
                            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${currentQuestion.difficulty > 1.5 ? 'bg-red-500' :
                                currentQuestion.difficulty < -0.5 ? 'bg-emerald-500' : 'bg-purple-500'
                                }`}></div>

                            <div className="mb-6 flex gap-2">
                                <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-full border border-slate-700 uppercase tracking-wider">
                                    {currentQuestion.topic_id}
                                </span>
                                <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs font-bold rounded-full border border-purple-700/50 uppercase tracking-wider">
                                    Diff: {currentQuestion.difficulty.toFixed(1)}
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl text-white font-medium mb-10 leading-relaxed">
                                {currentQuestion.question}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                {currentQuestion.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        disabled={isAnswering}
                                        onClick={() => handleOptionSelect(opt)}
                                        className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden text-lg ${selectedOption === opt
                                            ? 'border-purple-500 bg-purple-500/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                                            : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                                            } ${isAnswering && selectedOption === opt ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                                    >
                                        <div className="flex items-center justify-between pointer-events-none">
                                            <span>{opt}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Confidence Slider representing metacognition tracking */}
                            <div className="mb-10 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <BrainCircuit size={16} /> Metacognitive Confidence
                                    </label>
                                    <span className="text-purple-400 font-mono font-bold">{confidence}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={confidence}
                                    onChange={(e) => setConfidence(e.target.value)}
                                    disabled={isAnswering}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                    <span>Guessing</span>
                                    <span>Certain</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                {/* Feedback Alert */}
                                <div className="w-1/2">
                                    <AnimatePresence>
                                        {isAnswering && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-3 p-4 rounded-xl font-bold tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                            >
                                                <BrainCircuit className="animate-pulse" />
                                                PROCESSING RESPONSE...
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    disabled={!selectedOption || isAnswering}
                                    onClick={handleSubmit}
                                    className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${!selectedOption || isAnswering
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-sky-500 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transform hover:-translate-y-1'
                                        }`}
                                >
                                    Submit Response
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* AI Math Visualizer Side Panel */}
                <AnimatePresence>
                    {showTerminal && (
                        <motion.div
                            initial={{ opacity: 0, x: 50, width: 0 }}
                            animate={{ opacity: 1, x: 0, width: 'auto' }}
                            exit={{ opacity: 0, x: 50, width: 0 }}
                            className="hidden xl:block xl:w-1/3 flex-shrink-0"
                        >
                            <div className="bg-[#0A0A0A] border border-slate-800 rounded-2xl h-full shadow-2xl flex flex-col overflow-hidden">
                                <div className="bg-slate-900/80 p-3 border-b border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                                        <Terminal size={14} className="text-sky-400" />
                                        skillforge_irt_engine.exe
                                    </div>
                                    <div className="flex gap-1.5 ml-4">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                    </div>
                                </div>
                                <div className="p-4 font-mono text-xs flex-1 overflow-y-auto space-y-3">
                                    {terminalLogs.map(log => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={log.id}
                                            className={`${log.type === 'system' ? 'text-blue-400' :
                                                log.type === 'math' ? 'text-purple-400' :
                                                    log.type === 'success' ? 'text-emerald-400' : 'text-orange-400'
                                                }`}
                                        >
                                            <span className="opacity-50 mr-2 text-slate-500">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                                            {log.text}
                                        </motion.div>
                                    ))}
                                    {isAnswering && !feedback && (
                                        <div className="text-slate-500 animate-pulse">
                                            <span className="opacity-50 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                                            [SYS] Processing response, running Bayesian inference model...
                                        </div>
                                    )}
                                    <div className="animate-pulse text-sky-400">_</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdaptiveTest;
