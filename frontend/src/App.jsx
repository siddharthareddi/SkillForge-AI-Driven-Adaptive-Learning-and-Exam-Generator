import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import AdaptiveTest from './pages/AdaptiveTest';
import Landing from './pages/Landing';
import Analytics from './pages/Analytics';
import StudyPlan from './pages/StudyPlan';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import QuizResults from './pages/QuizResults';
import AdminDashboard from './pages/AdminDashboard'; // Added import
import { initialUserState } from './data/mockDatabase';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Added isAdmin state

  // App-level state for the user's progress
  const [userState, setUserState] = useState(() => {
    // CRITICAL FIX: Wipe out any old localStorage data that was previously trapping users
    // on the dashboard during live reloads, since we are moving back to sessionStorage
    localStorage.removeItem('adaptivePlatformState');

    // Try to load from sessionStorage for persistence across reloads during testing but clearing on new tabs
    const saved = sessionStorage.getItem('adaptivePlatformState');
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });

  // Save to session storage whenever it changes
  useEffect(() => {
    if (userState) {
      sessionStorage.setItem('adaptivePlatformState', JSON.stringify(userState));
    } else {
      sessionStorage.removeItem('adaptivePlatformState');
    }
  }, [userState]);

  const handleLogin = (user) => {
    setUserState(user);
    setIsAdmin(user.isAdmin || false);
    setCurrentView('dashboard');
  };

  // Global listener for starting a module from the Courses page
  useEffect(() => {
    window.onStartModule = (topicId) => {
      setActiveTopicId(topicId);
      setCurrentView('test');
    };
    return () => {
      delete window.onStartModule;
    }
  }, []);

  const handleTestComplete = (updatedState) => {
    setUserState(updatedState);
    setActiveTopicId(null);
    setCurrentView('dashboard');
  };

  const handleTestCancel = () => {
    setActiveTopicId(null);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserState(null);
    setIsAdmin(false); // Reset isAdmin on logout
    setActiveTopicId(null);
    setCurrentView('dashboard');
    sessionStorage.removeItem('adaptivePlatformState');
    localStorage.removeItem('token');
  };

  const handleEnrollCourse = (courseId) => {
    if (userState && !userState.enrolledCourses?.includes(courseId)) {
      setUserState(prev => ({
        ...prev,
        enrolledCourses: [...(prev.enrolledCourses || []), courseId]
      }));
    }
  };

  const handleReset = () => {
    // Development only hard reset of progress, but keeping user logged in
    setUserState({
      ...initialUserState,
      name: userState.name,
      email: userState.email
    });
    setActiveTopicId(null);
    setCurrentView('dashboard');
  };

  if (!userState) {
    return <Landing onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden">
      {/* Dynamic particles background effect (simulated via CSS) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-900/20 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-900/10 blur-[100px]"></div>
      </div>

      {/* Only show Navigation if NOT admin */}
      {!isAdmin && (
        <Navigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          onReset={handleReset}
        />
      )}

      <main className={`flex-1 z-10 overflow-hidden relative min-h-screen ${isAdmin ? 'ml-0 w-full p-4 md:p-10' : 'ml-20 md:ml-64'}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {currentView === 'dashboard' && (
            <motion.div key="dashboard" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <Dashboard userState={userState} onStartTest={() => setCurrentView('test')} onViewResults={() => setCurrentView('results')} />
            </motion.div>
          )}
          {currentView === 'test' && (
            <motion.div key="test" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <AdaptiveTest userState={userState} topicId={activeTopicId} onComplete={handleTestComplete} onCancel={handleTestCancel} />
            </motion.div>
          )}
          {currentView === 'results' && (
            <motion.div key="results" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <QuizResults userState={userState} onComplete={() => setCurrentView('dashboard')} />
            </motion.div>
          )}
          {currentView === 'courses' && (
            <motion.div key="courses" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <Courses userState={userState} enrollCourse={handleEnrollCourse} />
            </motion.div>
          )}
          {currentView === 'analytics' && (
            <motion.div key="analytics" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <Analytics userState={userState} />
            </motion.div>
          )}
          {currentView === 'study' && (
            <motion.div key="study" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <StudyPlan userState={userState} />
            </motion.div>
          )}
          {currentView === 'profile' && (
            <motion.div key="profile" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 p-6 md:p-10 overflow-y-auto">
              <Profile userState={userState} onLogout={handleLogout} />
            </motion.div>
          )}
          {currentView === 'admin' && isAdmin && (
            <motion.div key="admin" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="absolute inset-0 overflow-y-auto p-4 md:p-8">
              <AdminDashboard onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
