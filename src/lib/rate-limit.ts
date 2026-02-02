const rateLimit = new Map();

export function rateLimiter(ip: string) {
    const now = Date.now();
    const windowSize = 60 * 1000; // 1 minute
    const limit = 100; // 100 requests per minute

    const userHistory = rateLimit.get(ip) || [];
    const validHistory = userHistory.filter((timestamp: number) => timestamp > now - windowSize);

    if (validHistory.length >= limit) {
        return false;
    }

    validHistory.push(now);
    rateLimit.set(ip, validHistory);
    return true;
}
