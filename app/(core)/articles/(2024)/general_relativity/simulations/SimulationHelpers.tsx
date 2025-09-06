/**
 * Linear interpolation between a and b at time t.
 * @param a Initial value
 * @param b Final value
 * @param t Time
 * @returns 
 */
export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

/**
 * Linear interpolation between a and b at time t, but clamped to t0 and t1.
 * @param a Initial value
 * @param b Final value
 * @param t Time
 * @param t0 Minimum time
 * @param t1 Maximum time
 */
export function lerpc(a: number, b: number, t: number, t0: number, t1: number) {
    if (t <= t0) return a;
    if (t >= t1) return b;
    return lerp(a, b, (t - t0) / (t1 - t0));
}


/**
 * Smoothstep interpolation between a and b at time t.
 * @param a Initial value
 * @param b Final value
 * @param t Time
 */
export function smooth(a: number, b: number, t: number) {
    return lerp(a, b, t * t * (3 - 2 * t));
}

/**
 * Smoothstep interpolation between a and b at time t, but clamped to t0 and t1.
 * @param a Initial value
 * @param b Final value
 * @param t Time
 * @param t0 Minimum time
 * @param t1 Maximum time
 */
export function smoothc(a: number, b: number, t: number, t0: number, t1: number) {
    if (t <= t0) return a;
    if (t >= t1) return b;
    return smooth(a, b, (t - t0) / (t1 - t0));
}
