export const sample = <T>(arr: T[], count: number, cb = (_: T) => true): T[] => {
    const indexes: number[] = [];

    while (indexes.length < count) {
        const num = Math.floor(Math.random() * arr.length);

        if (indexes.indexOf(num) != -1 || !cb(arr[num])) {
            continue;
        }

        indexes.push(num);
    }

    return indexes.map(i => arr[i]);
}

const gcd = (a: number, b: number) => {
    if (b === 0) return a;

    return gcd(b, a % b);
}

export const relativelyPrime = (num: number, scale = 100) => {
    const nums = [];

    for (let i = 0; i < scale; i++) {
        if (gcd(i, num) === 1) {
            nums.push(i);
        }
    }

    return nums[Math.floor(Math.random() * nums.length)];
}