import {FC} from 'react'
import './ProgressBar.scss'

type BarType = FC<{
    bar_text: string,
    max_value: number,
    current_value: number,
    backgroundColor?: string,
    textColor?: string
    barColor?: string
}>

export const ProgressBar: BarType = ({
    bar_text,
    max_value,
    current_value,
    backgroundColor= "lightblue",
    textColor = "black",
    barColor = "#c9c9c9"
}) => {

    const percentage = Math.floor((current_value/max_value) * 100)
    return (<>
        <div 
            role="progressbar"
            className='progress border-round-4px text-bold'
            style={{
                color: textColor,
                backgroundColor: barColor
            }}
            data-label={bar_text}
        >
            <span 
                className='value border-round-4px'
                style={{
                    width: `${percentage}%`,
                    backgroundColor: backgroundColor,
                }} 
            />                
        </div>
    </>)
}