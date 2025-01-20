import { FC, useEffect } from "react"
import { useInterval } from "../../hooks/useInterval"
import { ProgressBar } from "./ProgressBar"

type CountDownBarComponent = FC<{
    bar_name: string,
    duration: number,
    onFinish: () => void,
    is_frozen?: boolean
}>
export const CountDownBar: CountDownBarComponent = ({
    bar_name,
    duration,
    onFinish,
    is_frozen = false
}) => {
    const [timer, { start, pause, resume }] = useInterval(
        onFinish, 
        duration, 
        100
    )
    
    useEffect(() => {
        start()
        console.log("clicked")
    }, [])
     
    if(is_frozen) {
        pause()
    } else {
        resume()
    }

    return <ProgressBar 
        bar_name={bar_name}
        max_value={duration} 
        current_value={duration - timer}
    />
}