import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultKey = '@interior-vision:';

const StorageService = {
  save: async (key, value) => {
    try {
      await AsyncStorage.setItem(defaultKey + key, value);
    } catch (e) {
      console.warn('Error saving data ' + value);
    }
  },
  load: async key => {
    try {
      const value = await AsyncStorage.getItem(defaultKey + key);
      if (value !== null) {
        return '' + value;
      } else {
        return undefined;
      }
    } catch (e) {
      console.warn('Error loading data ' + key);
    }
  },
};

export default StorageService;
