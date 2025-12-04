export const generateV1 = (n: number) =>
    Array
        .from({ length: n - 1 })
        .map((_, i) => Math.pow(i + 1, 2) % n);

export const generateV2 = (v1: number[]) => [...new Set(v1)];

export const generateV3 = (
    v2: number[],
    p: number,
    q: number
) => v2.filter(v => (v % p) && (v % q));

export const generateV0 = (v3: number[]) => v3[Math.floor(Math.random() * v3.length)]

export const calculateVm1 = (v0: number, n: number) => {
    for (let i = 0; i < 1_000_000; i++) {
        if (((i * v0) % n) === 1) {
            return i;
        }
    }

    return 0;
};

export const calculateS = (n: number, vm1: number) => {
    for (let i = 0; i < 1_000_000; i++) {
        if ((Math.pow(i, 2) % n) === vm1) {
            return i;
        }
    }

    return 0;
}

export const generateR = (n: number) => Math.ceil(Math.random() * n);
export const calculateY = (r: number, s: number, n: number) => (r * s) % n; 