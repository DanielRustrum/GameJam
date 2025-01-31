import { FC, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useTimer } from "../../hooks/useTimer"
import { useSoundEffect } from "../../hooks/useSoundEffect"

export const useShieldButton = (
    active_duration: number = 1000,
    charge_duration: number = 1000
): [FC<{}>, {getIsActive: () => boolean}] => {
    const ShieldRef = useRef<{is_active?: boolean}>()

    const getIsActive = () => {
        if(ShieldRef.current?.is_active){
            return ShieldRef.current?.is_active;
        }
        return false
    }

    const SheldButtonWrapper = () => {
        const playClickEnter = useSoundEffect("enter", true)
        const playShield = useSoundEffect("shield")
        const [ active_time_remaining, {start: startActiveTimer} ] = useTimer(active_duration, 100)
        const [ disabled_time_remaining, {start: startDisabledTimer} ] = useTimer(charge_duration, 100)
        const [is_disabled, setIsDisabled] = useState(false)
        const [is_active, setIsActive] = useState(false)


        useImperativeHandle(ShieldRef, () => ({
            is_active 
        }))

        useEffect(()=>{
            if(active_time_remaining == 0 && is_active) {
                startDisabledTimer()
                setIsActive(false)
            }
        }, [active_time_remaining])
    
        useEffect(()=>{
            if(disabled_time_remaining == 0 && !is_active) {
                setIsDisabled(false)
            }
        }, [disabled_time_remaining])

        return <button
            className="ui--button-interact-2 ui--container ui--shield-button-mobile" 
            style={{
                backgroundColor: is_active? "#80acaa": "#d8cc7d"
            }}
            onMouseEnter={() => {playClickEnter()}}
            disabled={is_disabled}
            onClick={() => {
                playShield()
                setIsDisabled(true)
                setIsActive(true)
                startActiveTimer()
            }}
        >Shield</button>
    }

    const actions = useMemo(() => (
        {getIsActive}
    ),[])

    return [SheldButtonWrapper, actions]
}