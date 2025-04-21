export const storage = {
    get<T>(key: string): T | null {
        const stored = localStorage.getItem(key);
        try {
            return stored ? JSON.parse(stored) as T : null;
        } catch {
            return stored as unknown as T;
        }
    },
    set(key: string, value: any) {
        localStorage.setItem(key, value)
    },
    remove(key: string) {
        localStorage.removeItem(key)
    }
}