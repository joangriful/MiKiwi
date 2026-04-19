import axios from 'axios';

function assertPositionPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid doll position payload');
    }

    const requiredKeys = ['view', 'category', 'part_id'];
    const hasAllKeys = requiredKeys.every((key) => payload[key]);

    if (!hasAllKeys) {
        throw new Error('Invalid doll position payload');
    }
}

export async function saveDollPartPosition(payload) {
    assertPositionPayload(payload);
    const { data } = await axios.post(route('doll.settings.savePosition'), payload);
    return data;
}

export async function saveDollSettings(settings) {
    const { data } = await axios.post(route('doll.settings.save'), { settings });
    return data;
}

export const dollSettingsApi = {
    saveDollPartPosition,
    saveDollSettings,
};
