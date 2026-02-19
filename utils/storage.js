import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PREFERENCES_KEY = '@green_deen_preferences';
export const WORSHIP_TRACKER_KEY = '@green_deen_worship_tracker';
export const TASBIH_count_KEY = '@green_deen_tasbih_count';
export const BOOKMARKS_KEY = '@green_deen_bookmarks';
export const MEMORIZED_AYAH_KEY = '@green_deen_memorized_ayah';
export const LAST_READ_KEY = '@green_deen_last_read';
export const WORSHIP_HISTORY_KEY = '@green_deen_worship_history';

export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error('Error storing data:', e);
    }
};

export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('Error reading data:', e);
        return null;
    }
};

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error('Error removing data:', e);
    }
}
