export function getStoredQuizResultCategory() {
    const quizData = localStorage.getItem('quizData');

    if (!quizData) {
        return null;
    }

    try {
        const { resultCategory } = JSON.parse(quizData);

        return resultCategory ?? null;
    } catch (error) {
        console.error('Error loading quiz data from localStorage', error);

        return null;
    }
}

export function clearStoredQuizResultCategory() {
    localStorage.removeItem('quizData');
}
