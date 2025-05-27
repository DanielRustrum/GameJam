import { useRef, useState } from "react"
import { timer } from "@/engine/animation.timing"

type UseTimerHook = (
    duration: number,
    significant_figure: number
) => [
        number,
        {
            start: () => void
            stop: () => void
            pause: () => void
            resume: () => void
            set: (time: number) => void
        }
    ]

export const useTimer: UseTimerHook = (duration, significant_figure) => {
    const [time, setTime] = useState(duration)
    const timerRef = useRef(
        timer(duration, significant_figure, (remaining) => setTime(remaining))
    )

    return [
        time,
        {
            start: () => {
                timerRef.current.set(duration)
                timerRef.current.start()
            },
            stop: timerRef.current.stop,
            pause: timerRef.current.pause,
            resume: timerRef.current.resume,
            set: (value: number) => {
                setTime(value)
                timerRef.current.set(value)
            }
        }
    ]
}

const useInterpolation = () => { }
const useSeries = () => { }