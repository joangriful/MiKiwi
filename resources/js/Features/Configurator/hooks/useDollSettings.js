import { useCallback } from 'react';
import {
    saveDollPartPosition,
    saveDollSettings,
} from '@/Features/Configurator/services/dollSettingsApi';

export default function useDollSettings() {
    const savePartPosition = useCallback((payload) => saveDollPartPosition(payload), []);
    const saveSettings = useCallback((settings) => saveDollSettings(settings), []);

    return {
        savePartPosition,
        saveSettings,
    };
}
