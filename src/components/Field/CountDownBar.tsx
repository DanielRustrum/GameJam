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
        startCountdown: () => void
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
        startCountdown?: () => void
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

    const startCountdown = () => {
        if(BarRef.current?.startCountdown){
            BarRef.current.startCountdown()
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
                    setIsFrozen(false)
                }
            },
            adjustRate: adjust,
            moveProgress:(set_time_remaining: number) => {
                move(set_time_remaining * rate)
            },
            startCountdown: () => {
                start()
            }
        }))

        useEffect(()=>{
            if(freeze_timer === 0 && freeze_timer_active) {
                if(time_remaining === timer_duration) {
                    start(duration * rate)
                } else{
                    resume()
                }

                setIsFrozen(false)
                setFreezeTimerActive(false)
            }
        }, [freeze_timer])

        onUpdate(time_remaining)
            
        const max_value = timer_duration * 1/rate
        const current_value = (timer_duration - time_remaining) * 1/rate

        const bar_text = is_frozen? 
            `Frozen! ${freeze_timer !== 0? freeze_timer: ""}`: 
            `${bar_name}`

        const bar_color = is_frozen? 
            "#c3dde7": 
                rate > 1? 
                "#978248": 
                    rate < 1?
                    "#d1675a":
                    "#398eb2"


        return <ProgressBar 
            bar_text={bar_text}
            max_value={max_value} 
            current_value={current_value}
            backgroundColor={bar_color}
            barColor={is_frozen? "#c3dde7": "#978248"}
        />
    }

    const actions = useMemo(
        () => ({ 
            freezeBar, 
            unfreezeBar, 
            adjustRate, 
            moveProgress, 
            startCountdown 
        }),
        [],
    );

    return [memo(CountDownBar), actions]
}