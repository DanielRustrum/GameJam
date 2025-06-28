import { useRef, useState } from "react"
import { tick, timer, interpolate } from "@/engine/animation.timing"

export const useTick = (tick_args: Parameters<typeof tick>[0]) => {
    const timerRef = useRef(tick(tick_args))
    return timerRef.current
}

export const useTimer = (timer_args: Parameters<typeof timer>[0]) => {
    const [time, setTime] = useState(timer_args.timer.start_time)
    let timerObject = timer_args.timer

    const timerRef = useRef(
        timer({
            ...timer_args,
            timer: timerObject,
            onUpdate: (remaining: number) => setTime(remaining)
        })
    )

    const set = (time: number) => {
        setTime(time)
        timerRef.current.set(time)
    }

    const start = () => {
        setTime(timerObject.start_time)
        timerRef.current.start()
    }

    const update = (timer_arg: Parameters<typeof timer>[0]["timer"]) => {
        timerObject = timer_arg
        timerRef.current.update(timer_arg)
    }

    const reset = () => {
        
        timerRef.current = timer({
            ...timer_args,
            timer: timerObject,
            onUpdate: (remaining: number) => setTime(remaining)
        })
        // timerRef.current.set(time)
    }

    return {
        time,
        methods: { ...timerRef.current, set, start, update, reset }
    }
}

export const useInterpolation = (interpolate_args: Parameters<typeof interpolate>[0]) => {
    const [data, setData] = useState(0)

    const animationRef = useRef(
        interpolate({
            ...interpolate_args,
            onUpdate: (step) => setData(step),
        })
    )

    return {data, methods: { ...animationRef.current }}

}
// const useSeries = () => { }