import { useState, type FormEvent } from 'react'
import cls from './form.module.css'
import { Generator } from '../generator';

export const Form = () => {
    const [numberP, setNumberP] = useState<number>(37);
    const [numberQ, setNumberQ] = useState<number>(41);

    const [data, setData] = useState<null | { p: number; q: number; }>(null);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setData({ p: numberP, q: numberQ });
    }

    return (
        <div className={cls.wrapper}>
            <form
                onSubmit={onSubmit}
                className={cls.form}
            >
                <label htmlFor="number_p">
                    <p className={cls.labelText}>Простое число P:</p>
                    <input
                        id='number_p'
                        type='number'
                        className={cls.input}
                        onChange={(e) => setNumberP(+e.target.value)}
                        value={numberP}
                    />
                </label>

                <label htmlFor="number_q">
                    <p className={cls.labelText}>Простое число Q:</p>
                    <input
                        id='number_q'
                        type='number'
                        className={cls.input}
                        onChange={(e) => setNumberQ(+e.target.value)}
                        value={numberQ}
                    />
                </label>

                <button
                    className={cls.button}
                    type='submit'
                >
                    Генерировать
                </button>
            </form>
            {data &&
                <Generator
                    p={data.p}
                    q={data.q}
                />}
        </div>
    )
}