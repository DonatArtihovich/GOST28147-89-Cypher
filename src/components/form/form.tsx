import { useEffect, useState, type FormEvent } from 'react'
import cls from './form.module.css'
import { Generator } from '../generator';
import { ParallelGenerator } from '../parallel-generator';
import tickChecked from '../../assets/images/checkmark-checked.svg'
import tickUnchecked from '../../assets/images/checkmark-unchecked.svg'

export const Form = () => {
    const [numberP, setNumberP] = useState<number>(37);
    const [numberQ, setNumberQ] = useState<number>(41);
    const [isParallel, setIsParallel] = useState<boolean>(false);

    const [data, setData] = useState<null | { p: number; q: number; }>(null);

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setData({ p: numberP, q: numberQ });
    }

    useEffect(() => {
        console.log('is parallel: ', isParallel);
    }, [isParallel]);

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

                <label htmlFor="is_parallel" className={cls.parallelLabel}>
                    <p className={cls.labelText}>Параллельное</p>
                    <img
                        src={isParallel ? tickChecked : tickUnchecked}
                        className={cls.checkboxImage}
                    />
                    <input
                        id='is_parallel'
                        type="checkbox"
                        className={cls.checkboxInput}
                        onChange={_ => { setIsParallel(!isParallel) }}
                    />
                </label>

                <button
                    className={cls.button}
                    type='submit'
                >
                    Генерировать
                </button>
            </form>
            {data && (isParallel
                ? <ParallelGenerator {...data} />
                : <Generator {...data} />
            )}
        </div>
    )
}