

/**
 * Adaptive Question Selection Algorithm
 * Uses Reinforcement-style logic:
 * - Match b (difficulty) with θ (ability)
 * - Avoid repetition
 * - Prioritize weak topics
 */

export function selectNextQuestion(currentAbility, answeredIds, topicMasteries, enrolledCourses = [], allQuestions = [], targetTopicId = null) {
    if (targetTopicId) {
        // STRICT MODE: Only pick questions from this exact topic ID (e.g. course module mode)
        let availableQuestions = allQuestions.filter(q =>
            !answeredIds.includes(q.id) && q.topic_id === targetTopicId
        );

        if (availableQuestions.length === 0) {
           return null; // Exhausted course module questions
        }

        let bestQuestion = null;
        let minScore = Infinity;

        availableQuestions.forEach(q => {
            // Difficulty distance |θ - b|
            const diffDistance = Math.abs(currentAbility - q.difficulty);
            
            if (diffDistance < minScore) {
                minScore = diffDistance;
                bestQuestion = q;
            }
        });

        return bestQuestion || availableQuestions[0];
    } else {
        // ADAPTIVE GENERAL MODE: Determine eligible topics based on enrollment
        const eligibleTopicIds = ['algebra', 'geometry', 'calculus', 'stats', 'logic'];
        if (enrolledCourses.includes('c_dsa')) eligibleTopicIds.push('dsa');
        if (enrolledCourses.includes('c_python') || enrolledCourses.includes('c_react') || enrolledCourses.includes('c_system_design')) {
            eligibleTopicIds.push('programming');
        }

        let availableQuestions = allQuestions.filter(q =>
            !answeredIds.includes(q.id) && eligibleTopicIds.includes(q.topic_id)
        );

        if (availableQuestions.length === 0 && allQuestions.length > 0) {
            availableQuestions = [...allQuestions];
        }

        const topicKeys = Object.keys(topicMasteries);
        const sortedTopics = topicKeys.sort((a, b) => topicMasteries[a] - topicMasteries[b]);
        const priorityTopics = sortedTopics.slice(0, 2);

        let bestQuestion = null;
        let minScore = Infinity;

        availableQuestions.forEach(q => {
            const diffDistance = Math.abs(currentAbility - q.difficulty);
            const topicPenalty = priorityTopics.includes(q.topic_id) ? 0 : 1.5;
            const score = diffDistance + topicPenalty;

            if (score < minScore) {
                minScore = score;
                bestQuestion = q;
            }
        });

        return bestQuestion || availableQuestions[0];
    }
}
