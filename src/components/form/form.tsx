import { useState, type FormEvent } from 'react'
import cls from './form.module.css'
import { Encoder } from '../encoder';

export const Form = () => {
    const [lastname, setLastname] = useState<EncodeData['payload']>('');
    const [variant, setVariant] = useState<EncodeData['encodeKey']>(0)
    const [data, setData] = useState<EncodeData>({ payload: '', encodeKey: 0 });
    const [error, setError] = useState<string>('');

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!variant || variant < 0 || variant > 40) {
            setError('Введен некорректный номер варианта.');
            return;
        }

        if (!lastname.trim()) {
            setError('Введите корректную фамилию');
            return;
        }

        setError('');
        setData({
            payload: lastname.trim().padEnd(8, '0').slice(0, 8),
            encodeKey: variant,
        })
    }

    return (
        <div className={cls.wrapper}>
            <form
                onSubmit={onSubmit}
                className={cls.form}
            >
                <label htmlFor="variant">
                    <p className={cls.labelText}>Номер в журнале:</p>
                    <input
                        id='variant'
                        type='number'
                        className={cls.input}
                        onChange={(e) => setVariant(+e.target.value)}
                        value={variant}
                    />
                </label>

                <label htmlFor="lastname">
                    <p className={cls.labelText}>Фамилия:</p>
                    <input
                        id='lastname'
                        type='text'
                        max={8}
                        className={cls.input}
                        onChange={(e) => setLastname(e.target.value)}
                        value={lastname}
                    />
                </label>

                <p className={cls.error}>{error}</p>

                <button
                    className={cls.button}
                    type='submit'
                >
                    Генерировать
                </button>
            </form>
            {data.payload && <Encoder {...data} />}
        </div>
    )
}