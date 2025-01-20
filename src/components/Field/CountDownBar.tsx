import { FC, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useInterval } from "../../hooks/useInterval"
import { ProgressBar } from "./ProgressBar"
import { useTimer } from "../../hooks/useTimer"

type CountDownBarComponent = FC<{}>

type useCountDownBarHook = (
    bar_name: string,
    duration: number,
    onFinish: () => void,
    onUpdate?: (current_time: number) => void,
) => [
    CountDownBarComponent,
    {
        freezeBar: (duration: number) => void
        unfreezeBar: () => void
        adjustRate: (new_rate: number) => void
        moveProgress: (new_rate: number) => void
    }
]

export const useCountDownBar: useCountDownBarHook = (
    bar_name,
    duration,
    onFinish,
    onUpdate = () => {}
) => {
    
    const BarRef = useRef<{
        freezeBar?: (duration?: number) => void,
        unfreezeBar?: () => void
        adjustRate?: (new_rate: number) => void
        moveProgress?: (new_rate: number) => void
    }>()

    const freezeBar = (duration: number) => {
        if(BarRef.current?.freezeBar){
            BarRef.current.freezeBar(duration)
        }
    }

    const unfreezeBar = () => {
        if(BarRef.current?.unfreezeBar){
            BarRef.current.unfreezeBar()
        }
    }

    const adjustRate = (new_rate: number) => {
        if(BarRef.current?.adjustRate){
            BarRef.current?.adjustRate(new_rate)
        }
    }

    const moveProgress = (new_rate: number) => {
        if(BarRef.current?.moveProgress){
            BarRef.current?.moveProgress(new_rate)
        }
    }

    const CountDownBar: CountDownBarComponent = ({
    }) => {
        const [{
            time_remaining, 
            duration:timer_duration,
            rate
        }, { start, pause, resume, adjust, move }] = useInterval(
            onFinish, 
            duration, 
            100
        )

        const [is_frozen, setIsFrozen] = useState(false)
        const [freeze_timer, {start: startFreezeTimer}] = useTimer(0, 100)
        const [freeze_timer_active, setFreezeTimerActive] = useState(false)


        useImperativeHandle(BarRef, () => ({
            freezeBar: (duration = Infinity) => {
                if(duration !== Infinity) {
                    startFreezeTimer(duration)
                    setFreezeTimerActive(true)
                }

                pause()
                setIsFrozen(true)
            },
            unfreezeBar: () => {
                if(is_frozen){
                    resume()
                    setFreezeTimerActive(false)
                }
            },
            adjustRate: adjust,
            moveProgress:(set_time_remaining: number) => {
                move(set_time_remaining * rate)
            } 
        }))

        useEffect(()=>{
            if(freeze_timer === 0 && freeze_timer_active) {
                if(time_remaining === timer_duration) {
                    start(duration * rate)
                } else{
                    resume()
                }
                setFreezeTimerActive(false)
            }
        }, [freeze_timer])

        onUpdate(time_remaining)
            
        useEffect(() => {
            start()
        }, [])


        return <ProgressBar 
            bar_name={bar_name}
            max_value={timer_duration * 1/rate} 
            current_value={(timer_duration - time_remaining) * 1/rate}
        />
    }

    const actions = useMemo(
        () => ({ freezeBar, unfreezeBar, adjustRate, moveProgress }),
        [],
    );

    return [memo(CountDownBar), actions]
}