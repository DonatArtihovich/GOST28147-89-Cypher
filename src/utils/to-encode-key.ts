export const convertToEncodeKeyString = (key: number): string => (
    '0000 ' + key
        .toString()
        .padStart(4, '0') + ' '
)
    .repeat(4);