# AI-Based Adaptive Learning and Intelligent Exam Generation System

An advanced, research-grade Adaptive Learning Platform built to demonstrate GRE/GMAT-level computer-adaptive testing. The project dynamically assesses a student's latent ability ($\theta$) in real-time, matching question difficulties via Reinforcement-based selection, and predicts final examination scores using Machine Learning regression.

## 🚀 Features

- **Item Response Theory (2PL) Engine**: Dynamically calculates probabilities of answering correctly and updates user ability ($\theta$).
- **Bayesian Ability Estimation**: Real-time recalibration of the student's mastery level after every interaction.
- **Adaptive Question Selection**: Minimizes the distance between question difficulty ($b$) and student ability ($\theta$) while avoiding repetition and prioritizing weak concepts.
- **Topic Mastery Modeling**: Compares actual performance against IRT *expected probability*, mathematically isolating core weaknesses rather than relying on raw accuracy.
- **ML Score Prediction**: Evaluates pacing, variance, and $\theta$ to output an estimated percentual or scaled score.
- **Futuristic UI/UX**: Built with React, Tailwind CSS, Recharts, and Framer Motion to resemble a high-end, funded AI startup dashboard.

*Note: As per constraints, this project operates entirely in the frontend using local state management and JS simulations of complex backend logic for immediate, zero-config testing.*

## 🧠 System Architecture & Mathematical Models

### 1. Item Response Theory (2PL Model)
The probability of a student getting a question right is calculated using the logistic function:
$$P(correct) = \frac{1}{1 + e^{-a(\theta - b)}}$$
*Where:*
- $\theta$ = Student Ability Factor (-4.0 to +4.0)
- $b$ = Question Difficulty Parameter
- $a$ = Item Discrimination (How well the question differentiates between high and low ability students)

### 2. Bayesian Ability Update
After every response, the system updates the student's ability estimate:
$$\theta_{new} = \theta_{old} + \eta (R - P(\theta))$$
*Where:*
- $R$ = 1 if Correct, 0 if Incorrect
- $P(\theta)$ = Expected probability of correctness
- $\eta$ = Dynamic learning rate (stabilizes as attempt count increases)

### 3. Machine Learning Score Predictor
A mock Regression Model simulates mapping the student's latent traits to a standardized test score format:
- **Inputs**: $\theta$ (Ability), Topic Mastery Variance, Average Response Time (metacognitive pacing).
- **Penalizations**: Rushed or sluggish response times apply penalties to the raw curve.

## 🛠️ Tech Stack
- React (Vite)
- Tailwind CSS v4 (Glassmorphism & Neon theme)
- Framer Motion (Micro-interactions)
- Recharts (Data visualization: Growth Curve & Mastery Radar)
- Lucide React (Iconography)

## 📦 How to Run

Because this project uses a simulated mock database running purely in the browser, there is no need to set up Flask, MySQL, or Python virtual environments.

1. Ensure you have Node.js installed.
2. In the `adaptive-learning-platform` directory, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the provided `localhost` URL in your browser.

## 📊 Analytics Dashboard Demo
The application includes a dashboard featuring:
- **Ability Growth Curve**: A line chart tracking your Bayesian $\theta$ state.
- **Topic Mastery Heatmap (Radar)**: Visualizes competence across Algebra, Calculus, Statistics, Geometry, and Logic.
- **Neural Engine Insights**: Auto-generated text interpreting your ML parameters.

## 🏆 Academic Validity
This system moves beyond traditional CRUD applications by implementing core algorithmic principles of computer-adaptive standardized testing. It is suited for Capstone Projects, research paper validations on adaptive learning efficiency, and EdTech startup prototypes.
