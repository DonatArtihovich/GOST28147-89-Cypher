import { encode } from 'windows-1251'

export const convertToBinaryString = (str: string, sep: string = ' '): string => {
    return str
        .split('')
        .map(s =>
            (+encode(s)[0])
                .toString(2)
                .padStart(8, '0')
                .slice(-8)
        )
        .join(sep)
}