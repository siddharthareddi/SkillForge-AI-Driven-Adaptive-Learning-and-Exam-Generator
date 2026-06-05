/**
 * 2-Parameter Logistic (2PL) Item Response Theory Model
 */

// Calculate probability of correct answer using logistic function
// P(θ) = 1 / (1 + e^(-a * (θ - b)))
export function calculateProbability(theta, a, b) {
    const exponent = -a * (theta - b);
    return 1 / (1 + Math.exp(exponent));
}

// Bayesian Ability Update
// θ_new = θ_old + η * (R - P)
// where R = 1 (correct) or 0 (incorrect)
// P = predicted probability
// η = learning rate (diminishes as more questions are answered for stability)
export function updateAbility(thetaOld, isCorrect, predictedProbability, attemptCount) {
    // Dynamic learning rate (η): Starts higher, decreases to stabilize
    const learningRate = Math.max(0.2, 1.0 / Math.sqrt(attemptCount + 1));
    const R = isCorrect ? 1 : 0;

    // Update theta
    let thetaNew = thetaOld + learningRate * (R - predictedProbability);

    // Bound theta between -4.0 and 4.0 (standard GRE/GMAT range logic)
    thetaNew = Math.max(-4.0, Math.min(4.0, thetaNew));

    return thetaNew;
}

// Update Topic Mastery using Expected Probability Deviation
// Mastery = previous_mastery + (R - P)
export function calculateTopicMastery(currentMastery, isCorrect, predictedProbability) {
    const R = isCorrect ? 1 : 0;
    const deviation = R - predictedProbability;

    // Scale the deviation update slightly so it doesn't swing too wildly
    const newMastery = currentMastery + deviation * 0.5;

    return Math.max(-3.0, Math.min(3.0, newMastery));
}
