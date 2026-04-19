import { useCallback } from 'react';
import { saveProfileQuizResult } from '@/Features/Configurator/services/quizApi';

export default function useQuizResult() {
    const saveQuizResult = useCallback((category) => saveProfileQuizResult(category), []);

    return {
        saveQuizResult,
    };
}
