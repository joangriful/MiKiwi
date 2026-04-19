import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { saveProfileQuizResult } from '@/Features/Configurator/services/quizApi';

vi.mock('axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('quizApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name) => `/${name}`);
    });

    it('saves authenticated user quiz result', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });

        const response = await saveProfileQuizResult('Sensaciones');

        expect(globalThis.route).toHaveBeenCalledWith('profile.quiz.save');
        expect(axios.post).toHaveBeenCalledWith('/profile.quiz.save', {
            category: 'Sensaciones',
        });
        expect(response).toEqual({ success: true });
    });

    it('fails fast when category is invalid', async () => {
        await expect(saveProfileQuizResult('')).rejects.toThrow('Invalid quiz category');
        expect(axios.post).not.toHaveBeenCalled();
    });
});
