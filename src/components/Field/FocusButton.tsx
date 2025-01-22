import { FC, useCallback, useRef } from "react"

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
        current_focus: string | null
    }>({
        current_focus: default_focus
    })

    const forceActivation = useCallback(() => {
        onActive(FocusRef.current.current_focus)
    }, [])


    for (const stat of stats) {
        Buttons.push(({}) => {
            return <button onClick={() => {
                if(FocusRef.current.current_focus === stat)
                    FocusRef.current.current_focus = null;
                else
                    FocusRef.current.current_focus = stat;
                onActive(FocusRef.current.current_focus)
            }}>
                {stat}
            </button>
        })
    }

    return [FocusRef.current.current_focus, Buttons, forceActivation]
}