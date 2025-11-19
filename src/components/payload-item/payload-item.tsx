import cls from './index.module.css'

type PayloadItemProps = {
    header: string;
    payload: string;
}

export const PayloadItem = ({ header, payload }: PayloadItemProps) => {
    const onCopyClick = () => {
        navigator.clipboard.writeText(payload);
    }

    return (
        <div className={cls.wrapper}>
            <p className={cls.header}>{header}</p>
            <pre className={cls.payload}>{payload}</pre>
            <button
                className={cls.button}
                onClick={onCopyClick}
            >
                Copy
            </button>
        </div>
    )
}