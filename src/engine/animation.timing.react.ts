import { useEffect, useRef, useState } from "react"
import { timer } from "@/engine/animation.timing"

// const useTick = () => { }

const activeTimers = new Set<{ stop: () => void }>()

export type UseTimerHook = (
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
            update: (duration: number) => void
        }
    ]

export const useTimer: UseTimerHook = (initialDuration, initialSigFig) => {
    const [time, setTime] = useState(initialDuration)
    const durationRef = useRef(initialDuration)
    const sigFigRef = useRef(initialSigFig)

    const timerRef = useRef(
        timer(durationRef.current, sigFigRef.current, (remaining) => setTime(remaining))
    )

    useEffect(() => {
        const instance = timerRef.current
        activeTimers.add(instance)

        return () => {
            instance.stop()
            activeTimers.delete(instance)
        }
    }, [])

    if (import.meta.hot) {
        import.meta.hot.dispose(() => {
            for (const t of activeTimers) t.stop()
            activeTimers.clear()
        })

        import.meta.hot.accept(() => {
            const newTimer = timer(durationRef.current, sigFigRef.current, (remaining) => setTime(remaining))
            timerRef.current.stop()
            timerRef.current = newTimer
            timerRef.current.start()
        })
    }

    return [
        time,
        {
            start: () => {
                timerRef.current.set(durationRef.current)
                timerRef.current.start()
            },
            stop: timerRef.current.stop,
            pause: timerRef.current.pause,
            resume: timerRef.current.resume,
            set: (value: number) => {
                setTime(value)
                timerRef.current.set(value)
            },
            update: (newDuration: number) => {
                durationRef.current = newDuration
                timerRef.current.update(newDuration)
            }
        }
    ]
}

// const useInterval = () => { }
// const useInterpolation = () => { }
// const useSeries = () => { }