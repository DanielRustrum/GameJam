import { useCallback, useEffect, useState } from 'react';
import {useCountDown} from '../hooks/useCountDown';

type useIntervalHook = (
    triggerCallback: () => void,
    duration: number,
    interval: number
) => [
    number, 
    {
        start: (ttc?: number) => void,
        pause: () => void,
        resume: () => void,
        reset: () => void,
        augmentDuration: (new_duration: number) => void
    }
]

export const useInterval:useIntervalHook = (
    triggerCallback, 
    duration, 
    interval
) => {
    const [timeLeft, {start: cdStart, reset, pause, resume}] = useCountDown(duration, interval)
    const [is_active, setIsActive] = useState(false)

    const start = useCallback((ttc?: number) => {
        setIsActive(true)
        cdStart(ttc)
    }, [])

    const augmentDuration = useCallback((_: number) => {
        // const completion_ratio = timeLeft/duration
        // const new_duration = duration * scale
        // adjust(50)
        // move(new_duration)
    }, [])

    useEffect(()=>{
        if(timeLeft == 0 && is_active) {
            triggerCallback()
            cdStart()
        }
    }, [timeLeft])

    return [timeLeft, {start, reset, pause, resume, augmentDuration}]
}