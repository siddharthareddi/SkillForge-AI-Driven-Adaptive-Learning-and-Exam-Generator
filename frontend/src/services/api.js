// Fallback to relative '/api' root allowing Vite Proxy and production ingress correctly
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const api = {
    // Authentication
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },

    register: async (name, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
    },

    googleLogin: async (profile) => {
        const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
        if (!res.ok) throw new Error('Google Login failed');
        return res.json();
    },

    // Password Recovery
    forgotPassword: async (email) => {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error('Failed to send OTP');
        return res.json();
    },

    verifyOtp: async (email, otp) => {
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        if (!res.ok) throw new Error('Invalid or expired OTP');
        return res.json();
    },

    resetPassword: async (email, otp, newPassword) => {
        const res = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });
        if (!res.ok) throw new Error('Failed to reset password');
        return res.json();
    },

    // Courses
    getCourses: async () => {
        const res = await fetch(`${API_URL}/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
    },

    // Tests
    getQuestions: async (topicId) => {
        let url = `${API_URL}/test/questions`;
        if (topicId) {
            url += `?topicId=${topicId}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch questions');
        return res.json();
    },

    submitTestProgress: async (userId, ability, topicMastery, attempts) => {
        const res = await fetch(`${API_URL}/test/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ userId, ability, topicMastery, attempts })
        });
        if (!res.ok) throw new Error('Failed to submit progress');
        return res.json();
    }
};
