/**
 * Mock Machine Learning Predictor
 * Simulates regression models built on scikit-learn
 */

// Regression Formula approximation for GRE/GMAT standard score (200-800 scale or similar, mapped to Percentage)
export function predictFinalScore(theta, avgResponseTime, topicMasteryVariance) {
    // Inputs:
    // Final θ: Base indicator (-4.0 to +4.0 mapped)
    // Avg response time: Penalizes too slow or rewards quick correct thinking (optimal 60-90s)
    // topicMasteryVariance: Consistency penalty. High variance = inconsistent knowledge.

    // Base score mapping from Theta (-4 to 4 -> 20% to 99%)
    let basePrediction = 50 + (theta * 12.5);

    // Time penalty (assuming ideal response is roughly 60 seconds)
    let timePenalty = 0;
    if (avgResponseTime > 120) {
        timePenalty = (avgResponseTime - 120) * 0.1; // Penalize 1% per 10s over 120
    }

    // Consistency Penalty
    let consistencyPenalty = topicMasteryVariance * 2; // Subtract percentage points for high variance

    let finalScore = basePrediction - timePenalty - consistencyPenalty;

    // Bound to standard 0-100%
    return Math.max(10, Math.min(99, finalScore));
}

// Generates comparison metrics for the dashboard (Linear Regression vs Random Forest)
export function getMLComparisonMetrics(actualScoreStr) {
    // Mock R2 and MAE for academic dashboard realism
    return {
        linearRegression: {
            r2: 0.81,
            mae: 4.2,
            predictedScore: actualScoreStr - (Math.random() * 3) // slightly lower/higher
        },
        randomForest: {
            r2: 0.94,
            mae: 1.8,
            predictedScore: actualScoreStr + (Math.random() * 1.5) // Highly accurate
        }
    };
}
