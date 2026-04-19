import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import {
    saveDollPartPosition,
    saveDollSettings,
} from '@/Features/Configurator/services/dollSettingsApi';

vi.mock('axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('dollSettingsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.route = vi.fn((name) => `/${name}`);
    });

    it('saves doll part position with valid payload', async () => {
        const payload = {
            view: 'front',
            category: 'hair',
            part_id: 12,
            x: 10,
            y: 20,
            scale: 1,
        };

        axios.post.mockResolvedValueOnce({ data: { success: true } });

        const response = await saveDollPartPosition(payload);

        expect(globalThis.route).toHaveBeenCalledWith('doll.settings.savePosition');
        expect(axios.post).toHaveBeenCalledWith('/doll.settings.savePosition', payload);
        expect(response).toEqual({ success: true });
    });

    it('rejects invalid part position payload', async () => {
        await expect(saveDollPartPosition({ view: 'front' })).rejects.toThrow('Invalid doll position payload');
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('saves default doll settings', async () => {
        const settings = { selections: { front: {} }, zoom: { x: 0 } };
        axios.post.mockResolvedValueOnce({ data: { ok: true } });

        const response = await saveDollSettings(settings);

        expect(globalThis.route).toHaveBeenCalledWith('doll.settings.save');
        expect(axios.post).toHaveBeenCalledWith('/doll.settings.save', { settings });
        expect(response).toEqual({ ok: true });
    });
});
