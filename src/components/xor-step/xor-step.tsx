import { sDivision } from '../../utils';
import { PayloadItem } from '../payload-item';
import cls from './index.module.css'
import { xorIter } from '../../utils'

type XorStepProps = {
    input?: string;
    cypherKey: number;
    stepStart: number;
}

export const XorStep = ({ input, cypherKey, stepStart }: XorStepProps) => {
    if (!input) return null;

    const {
        n1,
        n2,
        n1Xored,
        n1XoredDivided,
        n1XoredDividedSTable,
        n1XoredDividedSTableBinary,
        shifted11,
        n2Xored
    } = xorIter(input, cypherKey);

    return (
        <>
            <h2 className={cls.stepHeader}>Шаг {stepStart + 1} </h2>
            <PayloadItem
                header='XOR N(1) и X(1)'
                payload={n1 + '\n' + cypherKey.toString(2).padStart(32, '0') + '\n' + n1Xored}
            />

            <h2 className={cls.stepHeader}>Шаг {stepStart + 2} </h2>
            <PayloadItem header='Делим на S-блоки' payload={n1XoredDivided.join('|')} />
            <PayloadItem
                header='Переводим S-блоки в десятичную систему: '
                payload={
                    n1XoredDivided
                        .map(s => parseInt(s, 2) >>> 0)
                        .join(' ')}
            />
            <PayloadItem
                header='Преобразуем по таблице, результат:'
                payload={n1XoredDividedSTable.join(' ')}
            />
            <PayloadItem
                header='Переводим:'
                payload={n1XoredDividedSTableBinary.join('|')}
            />
            <PayloadItem
                header='Сдвигаем на 11 бит влево:'
                payload={shifted11.join('|')}
            />
            <PayloadItem
                header='XOR со старшей частью N2:'
                payload={shifted11.join('') + '\n' + n2 + '\n' + n2Xored.padStart(32, '0')}
            />
            <PayloadItem
                header='Сдвиг по цепочке, результат:'
                payload={sDivision(n2Xored + n1, 8).join(' ')}
            />
        </>
    );
}