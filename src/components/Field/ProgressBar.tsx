import {FC} from 'react'


type BarType = FC<{
    bar_name: string,
    max_value: number,
    current_value: number,
    onClick?: () => void,
}>

export const ProgressBar: BarType = ({
    bar_name,
    max_value,
    current_value,
}) => {


    return (<>
        <label htmlFor={`#ui--${bar_name}`}>
            {bar_name}:{` ${current_value}/${max_value}`}
        </label>
        <progress id={`#ui--${bar_name}`} max={max_value} value={current_value} />
    </>)
}