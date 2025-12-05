import { relativelyPrime, sample, transpose } from "../../utils";
import { PayloadItem } from "../payload-item";
import cls from './index.module.css'

type ParallelGeneratorProps = {
    q: number;
    p: number;
}

export const ParallelGenerator = ({ q, p }: ParallelGeneratorProps) => {
    const n = q * p;
    const v = sample([1140, 21, 374, 1322, 1232], 5); //[1140, 21, 374, 1322, 1232]; TODO
    const vm1 = v.map(v => {
        for (let i = 0; i < n; i++) {
            if (v * i % n === 1) {
                return i;
            }
        }
        return 0;
    });
    const s = vm1.map(v => Math.round(Math.sqrt(v)));
    const transposed = transpose([v, vm1, s]);

    const r = relativelyPrime(n);

    const b = Math.floor(Math.random() * (2 ** s.length))
        .toString(2)
        .padStart(5, '0')
        .split('');

    const y = (r * (s.filter((_, i) => +b[i]).length
        ? s.filter((_, i) => +b[i])
            .reduce((p, c) => p * c, 1)
        : 1) % n);

    const x2 = ((y ** 2) * (v
        .filter((_, i) => +b[i]).length
        ? v
            .filter((_, i) => +b[i])
            .reduce((p, c) => p * c, 1)
        : 1)) % n

    return (
        <div className={cls.wrapper}>
            <PayloadItem payload={'p = ' + p.toString()} />
            <PayloadItem payload={'q = ' + q.toString()} />
            <PayloadItem payload={'n = ' + n.toString()} />

            <PayloadItem
                header={`Составим таблицу квадратичных вычетов по модулю ${n}, обратных к ним значений по модулю ${n} и их квадратных корней`}
                payload={`V\tV^-1\tS = sqrt(V^-1)\n` + transposed.map(r => r.join('\t')).join('\n')}
                formatting
            />

            <h2 className={cls.stepHeader}>Один цикл протокола идентификации:</h2>
            <PayloadItem
                header={`Сторона А выбирает случайное r = ${r} (взаимно просто с ${n}) и вычисляет`}
                payload={`x = r^2 mod n = ${r ** 2} mod ${n} = ${(r ** 2) % n}`}
            />

            <PayloadItem
                payload={`Сторона B Отправляет случайную последовательность битов b = [${b.join(', ')}]`}
            />

            <PayloadItem
                header={'Сторона А вычисляет:'}
                payload={`y = r * (S1^b1 * S2^b2 * SK^bK) mod n\n`
                    + `y = ${r} * (${s.map((sk, i) => `${sk}^${b[i]}`).join(' * ')}) mod n\n`
                    + `y = ${r} * ${s.filter((_, i) => +b[i]).length ? s.filter((_, i) => +b[i]).join(' * ') : '1'} mod n\n`
                    + `y = ${r * (s
                        .filter((_, i) => +b[i]).length
                        ? s
                            .filter((_, i) => +b[i])
                            .reduce((p, c) => p * c, 1)
                        : 1)} mod ${n}\n`

                    + `y = ${y}\n`
                }
                formatting
            />

            <PayloadItem
                header={'Сторона B проверяет, что:'}
                payload={`x = y^2 * (V1^b1 * V2^b2 * VK^bK) mod n\n`
                    + `x = ${y}^2 * (${v.map((vk, i) => `${vk}^${b[i]}`).join(' * ')}) mod n\n`
                    + `x = ${y}^2 * ${v.filter((_, i) => +b[i]).length ? v.filter((_, i) => +b[i]).join(' * ') : '1'} mod n\n`
                    + `x = ${(y ** 2) * (v
                        .filter((_, i) => +b[i]).length
                        ? v
                            .filter((_, i) => +b[i])
                            .reduce((p, c) => p * c, 1)
                        : 1)} mod ${n}\n`

                    + `x = ${x2}\n`
                }
                formatting
            />

            <h2 className={cls.stepHeader}>{(r ** 2) % n} = {x2}, значит проверка прошла успешно</h2>
        </div>
    )
}