export const transpose = <T = number>(m: T[][]): T[][] =>
    (Array
        .from({ length: m[0].length })
        .fill(Array
            .from({ length: m.length })
            .fill(0)
        ) as T[][]
    ).map((r, ri) =>
        r.map((_, ci) => m[ci][ri])
    );

