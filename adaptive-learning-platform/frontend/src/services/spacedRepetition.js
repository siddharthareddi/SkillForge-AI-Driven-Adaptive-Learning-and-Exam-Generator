/**
 * Spaced Repetition Engine
 * Uses SuperMemo-2 (SM-2) inspired logic to schedule review dates
 */

export function calculateNextReview(topicMastery, previousIntervalDays, consecutiveCorrect) {
    // topicMastery: -3.0 to +3.0
    // previousIntervalDays: days since last review (0 for new)
    // consecutiveCorrect: how many times in a row the student got this right

    // Map mastery to a simulated "Ease Factor" (default 2.5 in SM-2)
    // If mastery is high (+3.0), EF is ~ 3.0. If low (-3.0), EF is ~ 1.3
    let easeFactor = 2.5 + (topicMastery * 0.2);
    easeFactor = Math.max(1.3, easeFactor);

    let nextInterval = 0;

    if (consecutiveCorrect === 0) {
        nextInterval = 1; // Need to review tomorrow
    } else if (consecutiveCorrect === 1) {
        nextInterval = 6;
    } else {
        nextInterval = Math.round(previousIntervalDays * easeFactor);
    }

    // Calculate the actual future date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    return {
        nextIntervalDays: nextInterval,
        nextReviewDate,
        easeFactor,
        isUrgent: nextInterval <= 2 && topicMastery < 0
    };
}
