import { encode } from "windows-1251";

export const xorStep = (n1: number, x: number) => (
    (n1 ^ x) >>> 0
);

export const sDivision = (nstr: string, divTo = 4) => {
    const res = [];

    for (let i = 0; i < nstr.length; i += divTo) {
        res.push(nstr.slice(i, i + divTo));
    }

    return res;
}

export const rightShift11 = (nstr: string) => nstr.slice(11) + nstr.slice(0, 11);

export const transform4chars = (nstr: string) => (
    ('1|' + sDivision(
        nstr
            .split('')
            .map(s => (+encode(s)[0])
                .toString(2)
                .padStart(8, '0'))
            .join(''))
        .join('|') + '|8\n')
        .repeat(3)
    + '8|' + sDivision(
        nstr
            .split('')
            .map(s => (+encode(s)[0])
                .toString(2)
                .padStart(8, '0'))
            .join(''))
        .reverse()
        .join('|') + '|1\n'
)