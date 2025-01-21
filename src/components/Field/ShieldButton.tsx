import { FC, useEffect } from "react"
import { useToggleButton } from "./ToggleButton"
import { useTimer } from "../../hooks/useTimer"

export const useShieldButton = (
    active_duration: number = 1000,
    charge_duration: number = 1000
): [FC<{}>, {getToggleState: () => boolean}] => {

    const [ active_time_remaining, {start: startActiveTimer} ] = useTimer(active_duration, 100)
    const [ disabled_time_remaining, {start: startDisabledTimer} ] = useTimer(charge_duration, 100)
    
    const [ShieldButton, {
        getToggleState, 
        forceToggle,
        disableButton,
        enableButton
    }] = useToggleButton("Shield", () => {
        disableButton()
        startActiveTimer()
    })

    useEffect(()=>{
        if(active_time_remaining == 0 && getToggleState()) {
            forceToggle(false)
            startDisabledTimer()
        }
    }, [active_time_remaining])

    useEffect(()=>{
        if(disabled_time_remaining == 0 && !getToggleState()) {
            enableButton()
        }
    }, [disabled_time_remaining])

    return [ShieldButton, { getToggleState }]
}