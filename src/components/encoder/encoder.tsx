import { decode } from 'windows-1251';
import { sTable } from '../../const';
import { convertToBinaryString, convertToEncodeKeyString, rightShift11, sDivision, transform4chars, xorStep } from '../../utils';
import { PayloadItem } from '../payload-item';
import cls from './index.module.css'

type EncoderProps = EncodeData;

export const Encoder = ({ payload, encodeKey }: EncoderProps) => {
    const payloadBinaryString = convertToBinaryString(payload);

    const n1 = payloadBinaryString
        .slice(0, Math.ceil(payloadBinaryString.length / 2))
        .replaceAll(' ', '')

    const n2 = payloadBinaryString
        .slice(Math.ceil(payloadBinaryString.length / 2))
        .replaceAll(' ', '')
    const cypherKey = 0b00110000001100000011000000110000;

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

    return (
        <div className={cls.wrapper}>
            <PayloadItem header='Шифруемое сообщение: ' payload={payload} />
            <PayloadItem header='Шифруемое сообщение кодом: ' payload={convertToBinaryString(payload)} />

            <PayloadItem header='Ключ шифрования: ' payload={encodeKey.toString()} />
            <PayloadItem header='Ключ шифрования целиком: ' payload={convertToEncodeKeyString(encodeKey)} />

            <h2 className={cls.stepHeader}>Шаг 1</h2>
            <PayloadItem
                header='Шифруемое сообщение N1: '
                payload={n1}
            />
            <PayloadItem
                header='Шифруемое сообщение N2: '
                payload={n2}
            />

            <h2 className={cls.stepHeader}>Шаг 2 </h2>
            <PayloadItem
                header='Первый блок 0000 разбиваем на восемь 32-битных блоков'
                payload={
                    transform4chars('0000')
                }
            />
            <PayloadItem
                header={`Второй блок 00${encodeKey} разбиваем на восемь 32-битных блоков`}
                payload={
                    transform4chars(`00${encodeKey}`)
                }
            />
            <PayloadItem
                header='Третий блок 0000 разбиваем на восемь 32-битных блоков'
                payload={
                    transform4chars('0000')
                }
            />
            <PayloadItem
                header={`Четвертый блок 00${encodeKey} разбиваем на восемь 32-битных блоков`}
                payload={
                    transform4chars(`00${encodeKey}`)
                }
            />

            <h2 className={cls.stepHeader}>Шаг 3 </h2>
            <PayloadItem
                header='XOR N(1) и X(1)'
                payload={n1 + '\n' + cypherKey.toString(2).padStart(32, '0') + '\n' + n1Xored}
            />

            <h2 className={cls.stepHeader}>Шаг 4 </h2>
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
            <PayloadItem
                header='В десятичной системе:'
                payload={sDivision(n2Xored + n1, 8).map(s => parseInt(s, 2).toString(10)).join(' ')}
            />
            <PayloadItem
                header='По таблице ASCII:'
                payload={decode(
                    new Uint8Array(
                        sDivision(n2Xored + n1, 8)
                            .map(s => parseInt(s, 2))) as unknown as string)
                    .split('')
                    .join(' ')
                }
            />

        </div>
    )
}