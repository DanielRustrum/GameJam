import { FC, useImperativeHandle, useMemo, useRef, useState } from "react"

type ToggleButtonComponent = FC<{}>

type useToggleButtonHook = (
    button_name: string,
    onClick?: () => void
) => [
    ToggleButtonComponent,
    {
        getToggleState: () => boolean
        forceToggle: (new_state:boolean) => void
        disableButton: () => void
        enableButton: () => void
    }
]

export const useToggleButton: useToggleButtonHook = (
    button_name,
    onClick = () => {}
) => {
    const ButtonRef = useRef<{
        toggle_state?: boolean
        setToggleState?: (toggle: boolean) => void
        setIsDisabled?: (toggle: boolean) => void
    }>({
        
    })

    const getToggleState = () => {
        return ButtonRef.current?.toggle_state ?? false;
    }

    const forceToggle = (new_state:boolean) => {
        if(ButtonRef.current?.setToggleState)
            ButtonRef.current?.setToggleState(new_state);
    }

    const disableButton = () => {
        if(ButtonRef.current?.setIsDisabled)
            ButtonRef.current?.setIsDisabled(true);
    }

    const enableButton = () => {
        if(ButtonRef.current?.setIsDisabled)
            ButtonRef.current?.setIsDisabled(false);
    }
    
    const ToggleButton: ToggleButtonComponent = ({}) => {
        const [toggle_state, setToggleState] = useState(false)
        const [is_disabled, setIsDisabled] = useState(false)

        useImperativeHandle(ButtonRef, () => ({
            toggle_state,
            setToggleState,
            setIsDisabled
        }))

        return (<button 
            onClick={() => {
                setToggleState(!toggle_state)
                onClick()
            }}
            disabled={is_disabled}
        >
            {button_name}
        </button>)
    }

    const actions = useMemo(
        () => ({ getToggleState, forceToggle, disableButton, enableButton }),
        [],
    );

    return [ToggleButton, actions]
}