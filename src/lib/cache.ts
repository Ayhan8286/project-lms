export class Cache<T = unknown> {
    private static instance: Cache<unknown>;
    private store: Map<string, { value: T; expiry: number }>;

    private constructor() {
        this.store = new Map();
    }

    public static getInstance(): Cache {
        if (!Cache.instance) {
            Cache.instance = new Cache();
        }
        return Cache.instance;
    }

    public set(key: string, value: T, ttlSeconds: number) {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.store.set(key, { value, expiry });
    }

    public get(key: string): T | null {
        const item = this.store.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }
}

export const cache = Cache.getInstance();
