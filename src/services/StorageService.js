import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '@env';

const StorageService = {
  save: async (key, value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY + key, value);
    } catch (e) {
      console.warn('Error saving data ' + value);
    }
  },
  load: async key => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY + key);
      if (value !== null) {
        return '' + value;
      } else {
        return undefined;
      }
    } catch (e) {
      console.warn('Error loading data ' + key);
    }
  },
  clean: async key => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY + key);
    } catch (e) {
      console.warn('Error cleaning data ' + key);
    }
  },
};

export default StorageService;
