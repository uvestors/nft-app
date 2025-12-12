const localStorage = {
  clear() {
    window.localStorage.clear();
  },
  remove(key: string) {
    window.localStorage.removeItem(key);
  },
  set(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  get(key: string) {
    const value = window.localStorage.getItem(key);

    try {
      return value != null ? JSON.parse(value) : value;
    } catch (err) {
      // err
      return value;
    }
  },
};

export default localStorage;
