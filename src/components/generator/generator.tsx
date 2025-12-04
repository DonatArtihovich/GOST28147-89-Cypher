import {
    calculateS,
    calculateVm1,
    calculateY,
    generateR,
    generateV0,
    generateV1,
    generateV2,
    generateV3
} from '../../utils';
import { PayloadItem } from '../payload-item';
import cls from './index.module.css'

type GeneratorProps = {
    q: number;
    p: number;
}

export const Generator = ({ q, p }: GeneratorProps) => {
    const n = p * q;

    const v1 = generateV1(n);
    const v2 = generateV2(v1);
    const v3 = generateV3(v2, p, q);
    const v0 = generateV0(v3); //49
    const vm1 = calculateVm1(v0, n);
    const s = calculateS(n, vm1);
    const r = generateR(n); //39
    const x = Math.pow(r, 2) % n;
    const y = calculateY(r, s, n);

    const auth_r = generateR(n - 1); //82
    const auth_x = Math.pow(auth_r, 2) % n;
    const auth_y = (auth_r * s) % n;

    const auth_b_x = (auth_r ** 2) % n;
    const auth_b_x2 = (Math.pow(auth_y, 2) * v0) % n;

    return (
        <div className={cls.wrapper}>
            <PayloadItem payload={'p = ' + p.toString()} />
            <PayloadItem payload={'q = ' + q.toString()} />
            <PayloadItem payload={'n = ' + n.toString()} />
            <PayloadItem
                header={'V1: '}
                payload={v1.join(',')}
            />
            <PayloadItem
                header={'Убираем повторения, V2: '}
                payload={v2.join(',')}
            />
            <PayloadItem
                header={'Убираем числа, которые делятся нацело на p или q, V3: '}
                payload={v3.join(',')}
            />
            <PayloadItem
                header={`Пусть V0 = ${v0}`}
                payload={`V0 * V^-1 mod n = 1\n${v0} * V^-1 mod ${n} = 1\nV^-1 = ${vm1}`}
                formatting
            />

            <PayloadItem
                header={`Найдем закрытый ключ S, S^2modn=V-1`}
                payload={`S^2mod${n}=${vm1}\nV0 = ${v0}(открытый ключ)\nS=${s}(закрытый ключ)`}
                formatting
            />

            <h2 className={cls.stepHeader}>Идентификация</h2>

            <PayloadItem
                header={`Сторона А выбирает некоторое случайное число r, r < n`}
                payload={`r = ${r}`}
                formatting
            />

            <PayloadItem
                header={`Затем она вычисляет x: x = r^2 mod n`}
                payload={`x = ${Math.pow(r, 2)}mod${n} = ${x}`}
                formatting
            />

            <PayloadItem
                header={`Если b = 1, то A отправляет стороне B y = r * S mod n`}
                payload={`y = ${r} * ${s} mod${n} = ${y}`}
                formatting
            />

            <PayloadItem
                header={`Проверка: равно ли x1=x(x1=r^2modn)`}
                payload={`x1 = ${Math.pow(r, 2)} mod ${n} = ${Math.pow(r, 2) % n}\n`
                    + `x1 = x(Проверка пройдена успешно)`}
                formatting
            />

            <PayloadItem
                header={`Сторона A отправляет стороне B y = r * S mod n.`}
                payload={`x1 = y^2 V0 mod n\n`
                    + `x1 = ${Math.pow(y, 2)} * ${v0} mod${n} = ${(Math.pow(y, 2) * v0) % n} \n`
                    + `x1 = x(Проверка пройдена успешно)`}
                formatting
            />

            <h2 className={cls.stepHeader}>Аутентификация</h2>

            <PayloadItem
                header={`Сторона A выбирает случайное r, где r < n-1`}
                payload={`r = ${auth_r}`}
            />

            <PayloadItem
                header={`Сторона A вычисляет x = r^2 mod n`}
                payload={`x = ${auth_r}^2 mod ${n} = ${auth_x}\n` +
                    `Сторона A отправляет стороне B x(${auth_x})`}
                formatting
            />

            <PayloadItem
                header={`Сторона B посылает стороне A случайный бит b.`}
                payload={
                    `Если b = 0, то сторона A посылает стороне B значение r(${auth_r})\n` +
                    `Если b = 1, то сторона A посылает стороне B значение y = r * S mod n\n` +
                    `y = ${auth_r} * ${s} mod ${n} = ${auth_y}`
                }
                formatting
            />

            <PayloadItem
                header={`Проверка со стороны B`}
                payload={
                    `Если b = 0, то B проверяет, что x = r^2 mod n\n` +
                    `x = ${auth_r}^2 mod ${n} = ${auth_b_x}\n` +
                    `Если b = 1, то сторона B проверяет, что x = y^2 * V mod n\n` +
                    `x = ${auth_y}^2 * ${v0} mod ${n} = ${auth_b_x2}`
                }
                formatting
            />
        </div>
    );
}