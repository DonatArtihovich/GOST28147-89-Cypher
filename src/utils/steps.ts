import { encode } from "windows-1251";
import { sTable } from "../const";

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

export const xorIter = (input: string, cypherKey: number) => {
    const n1 = input.slice(0, Math.ceil(input.length / 2)).replaceAll(' ', '').padStart(32, '0')
    const n2 = input.slice(Math.ceil(input.length / 2)).replaceAll(' ', '').padStart(32, '0')

    const n1Xored = xorStep(parseInt(n1, 2), cypherKey).toString(2).padStart(32, '0');

    const n1XoredDivided = sDivision(n1Xored);
    const n1XoredDividedSTable = n1XoredDivided
        .map((s, i) => sTable[i][parseInt(s, 2) >>> 0]);
    const n1XoredDividedSTableBinary = n1XoredDividedSTable
        .map(n => n
            .toString(2)
            .padStart(4, '0'));
    const shifted11 = sDivision(rightShift11(n1XoredDividedSTableBinary.join('')));
    const n2Xored = xorStep(parseInt(shifted11.join(''), 2), parseInt(n2, 2)).toString(2);

    return { n1, n2, n1Xored, n1XoredDivided, n1XoredDividedSTable, n1XoredDividedSTableBinary, shifted11, n2Xored };
}