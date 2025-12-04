import cls from './index.module.css'

type PayloadItemProps = {
    header?: string;
    payload: string;
    formatting?: boolean;
}

export const PayloadItem = ({ header, payload, formatting = false }: PayloadItemProps) => {
    const onCopyClick = () => {
        navigator.clipboard.writeText(payload);
    }

    return (
        <div className={cls.wrapper}>
            {header && <p className={cls.header}>{header}</p>}
            <div className={cls.innerWrapper}>
                {
                    formatting
                        ? <pre className={cls.payload}>{payload}</pre>
                        : <p className={cls.payload}>{payload}</p>
                }
                <button
                    className={cls.button}
                    onClick={onCopyClick}
                >
                    Copy
                </button>
            </div>
        </div>
    )
}