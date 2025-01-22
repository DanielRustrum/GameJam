import { FC, useImperativeHandle, useMemo, useRef, useState } from "react"
import { ProgressBar } from "./ProgressBar"

type StatBarComponent = FC<{}>

type useStatBarHook = (
    bar_name: string,
    start_value: number,
    max_value: number,
    onUpdate?: (stat: number) => void
) => [
    StatBarComponent,
    {
        reduceValue: (amount: number) => void
        increaseValue: (amount: number) => void
    }
]

export const useStatBar: useStatBarHook = (
    bar_name,
    start_value,
    max_value,
    onUpdate = () => {}
) => {
    const BarRef = useRef<{
        setStat?: (set: (new_stat: number) => number) => void
    }>({})
    
    const reduceValue = (amount: number) => {
        if(BarRef.current.setStat)
            BarRef.current.setStat(
                (current_stat: number) =>{ 
                    const updated_stat = current_stat - amount
                    onUpdate(updated_stat)
                    return updated_stat
                }
            );
    } 

    const increaseValue = (amount: number) => {
        if(BarRef.current.setStat)
            BarRef.current.setStat(
                (current_stat: number) =>{ 
                    const updated_stat = current_stat + amount
                    onUpdate(updated_stat)
                    return updated_stat
                }
            );
    } 


    const StatBar: StatBarComponent = ({}) => {
        const [stat, setStat] = useState(start_value)

        useImperativeHandle(BarRef, () => ({
            setStat
        }))
        
        return <ProgressBar 
            bar_name={bar_name}
            current_value={stat}
            max_value={max_value}
        />
    }

    const actions = useMemo(
        () => ({ reduceValue, increaseValue }),
        [],
    );

    return [StatBar, actions]
}