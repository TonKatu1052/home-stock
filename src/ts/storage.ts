import { AppData } from './types';

const STORAGE_KEY = 'appData';

export const Storage = {
  load(): AppData {
    const data = localStorage.getItem(STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : {
          inventory: [],
          shopping: [],
        };
  },

  save(data: AppData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
};
