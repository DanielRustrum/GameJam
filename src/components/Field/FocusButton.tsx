import { FC, useCallback, useEffect, useRef, useState } from "react"
import { useTimer } from "../../hooks/useTimer"

export const useFocusButton = (
    stats: Array<string>,
    default_focus: string | null,
    onActive = (_:string | null) => {}
): [
    string | null,
    Array<FC<{}>>,
    () => void
] => {
    const Buttons: Array<FC<{}>> = []
    const FocusRef = useRef<{
        current_focus: string | null,
        is_disabled: boolean
        buttons: {
            [key: string]: (set: boolean) => void
        }
    }>({
        current_focus: default_focus,
        is_disabled: false,
        buttons: {}
    })

    const forceActivation = useCallback(() => {
        onActive(FocusRef.current.current_focus)
    }, [])

    const setIsDisableForALL = (set: boolean) => {
        for(const stat in FocusRef.current.buttons) {
            FocusRef.current.buttons[stat](set)
        }
    } 


    for (const stat of stats) {
        Buttons.push(({}) => {
            const [disabled_time_remaining, {start}] = useTimer(1000, 100)
            const [is_disabled, setIsDisabled] = useState(false)

            useEffect(() => {
                if(disabled_time_remaining === 0 && FocusRef.current.is_disabled) {
                    setIsDisableForALL(false)
                    FocusRef.current.is_disabled = false
                }
            }, [disabled_time_remaining])

            FocusRef.current.buttons[stat] = (set: boolean) => {
                setIsDisabled(set)
            }
            return <button 
                disabled={is_disabled}
                onClick={() => {
                    if(!FocusRef.current.is_disabled) {
                        if(FocusRef.current.current_focus === stat)
                            FocusRef.current.current_focus = null;
                        else
                            FocusRef.current.current_focus = stat;
                        onActive(FocusRef.current.current_focus)
                        setIsDisableForALL(true)
                        start()
                        FocusRef.current.is_disabled = true
                    }
                }}
            >
                {stat}
            </button>
        })
    }

    return [FocusRef.current.current_focus, Buttons, forceActivation]
}