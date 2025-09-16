export const loadState = <T>(key: string): T | undefined => {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return undefined;
    return JSON.parse(serialized) as T;
  } catch (err) {
    console.error("Error loading from localStorage", err);
    return undefined;
  }
};

export const saveState = <T>(key: string, state: T): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.error("Error saving to localStorage", err);
  }
};
