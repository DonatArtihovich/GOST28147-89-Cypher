import {
    convertToBinaryString,
    convertToEncodeKeyString,
    sDivision,
    transform4chars,
    xorIter
} from '../../utils';
import { PayloadItem } from '../payload-item';
import cls from './index.module.css'
import { XorStep } from '../xor-step/xor-step';
import { decode } from 'windows-1251';

type EncoderProps = EncodeData;

export const Encoder = ({ payload, encodeKey, itersCount }: EncoderProps) => {
    const payloadBinaryString = convertToBinaryString(payload).trim();
    const fullKey = convertToEncodeKeyString(encodeKey).trim();

    const cypherKey = 0b00110000001100000011000000110000;
    const iterResults: string[] = Array.from({ length: itersCount })
        .reduce((prev: string[], _) => {
            const res = xorIter(prev.at(-1) as string, cypherKey);
            return [...prev, res.n2Xored + res.n1];
        }, [payloadBinaryString]);

    const n1 = payloadBinaryString
        .slice(0, Math.ceil(payloadBinaryString.length / 2))
        .replaceAll(' ', '')

    const n2 = payloadBinaryString
        .slice(Math.ceil(payloadBinaryString.length / 2))
        .replaceAll(' ', '')

    return (
        <div className={cls.wrapper}>
            <PayloadItem header='Шифруемое сообщение: ' payload={payload} />
            <PayloadItem header='Шифруемое сообщение кодом: ' payload={convertToBinaryString(payload)} />

            <PayloadItem header='Ключ шифрования: ' payload={encodeKey.toString()} />
            <PayloadItem header='Ключ шифрования целиком: ' payload={fullKey} />

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
            <ul className={cls.blocksList}>
                {fullKey.split(' ').map((keyBlock, i) => (
                    <li key={`block${i}`}>
                        <PayloadItem
                            header={`${i + 1} блок ${keyBlock} разбиваем на восемь 32-битных блоков`}
                            payload={transform4chars(keyBlock)}
                        />
                    </li>
                ))}
            </ul>

            <ul className={cls.blocksList}>
                {Array.from({ length: itersCount })
                    .map((_, index) => index)
                    .map((i) => (
                        <XorStep
                            key={`iter${i}`}
                            input={iterResults.at(i)}
                            cypherKey={cypherKey}
                            stepStart={2 + 2 * i}
                        />
                    ))}
            </ul>

            <PayloadItem
                header='В десятичной системе:'
                payload={sDivision(iterResults.at(-1) as string, 8)
                    .map(s => parseInt(s, 2).toString(10)).join(' ')}
            />
            <PayloadItem
                header='По таблице ASCII:'
                payload={decode(
                    new Uint8Array(
                        sDivision(iterResults.at(-1) as string, 8)
                            .map(s => parseInt(s, 2))) as unknown as string)
                    .split('')
                    .join(' ')
                }
            />
        </div>
    )
}