import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTimer } from './useTimer';

type useIntervalHook = (
    triggerCallback: () => void,
    duration: number,
    interval: number
) => [
    {
        duration: number,
        time_remaining: number,
        rate: number
    },
    {
        start: (new_durration?: number) => void,
        pause: () => void,
        resume: () => void,
        reset: () => void,
        adjust: (new_rate: number) => void
        move: (new_rate: number) => void
    }
]

export const useInterval:useIntervalHook = (
    triggerCallback, 
    duration, 
    interval
) => {
    const [current_rate, setCurrentRate] = useState(1)
    const [
        timeLeft, 
        {
            start: startTimer, 
            reset, 
            pause, 
            resume, 
            move
        }
    ] = useTimer(duration, interval)

    const [is_active, setIsActive] = useState(false)

    const start = useCallback((new_duration?: number) => {
        setIsActive(true)
        startTimer(new_duration?? duration * current_rate)
    }, [])

    const adjust = (new_rate: number) => {
        const rate = 1 / new_rate
        setCurrentRate(rate)
        const current_time = timeLeft
        start(duration * current_rate)
        move(current_time * rate)
    }

    useEffect(()=>{
        if(timeLeft == 0 && is_active) {
            triggerCallback()
            startTimer(duration * current_rate)
        }
    }, [timeLeft])

    const data = useMemo(() => ({
        duration: duration * current_rate,
        time_remaining: timeLeft,
        rate: current_rate
    }), [timeLeft, current_rate])

    return [data, {start, reset, pause, resume, adjust, move}]
}