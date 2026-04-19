import axios from 'axios';

function assertCategory(category) {
    if (!category || typeof category !== 'string') {
        throw new Error('Invalid quiz category');
    }
}

export async function saveProfileQuizResult(category) {
    assertCategory(category);

    const { data } = await axios.post(route('profile.quiz.save'), {
        category,
    });

    return data;
}

export const quizApi = {
    saveProfileQuizResult,
};
