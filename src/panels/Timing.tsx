import { Button } from "@ui/button"
import { interpolate } from "@/engine/animation.timing"
import { useInterpolation, useTimer } from "@/engine/animation.timing.react"
import { CSSProperties, useRef, useState } from "react"
import { Component } from "@/engine/types/component"

const Demo: Component<{ name: string }> = ({ name, children, className }) => {
    const [display_demo, setDisplayDemo] = useState(false)

    return <div>
        <div className="flex gap-10 w-full justify-center">
            <h2 className="font-bold text-2xl">{name}</h2>
            <Button onClick={() => setDisplayDemo(val => !val)}>{display_demo ? "hide" : "show"}</Button>
        </div>

        {display_demo ?
            <div className={className}>
                {children}
            </div> :
            <></>
        }
    </div>
}

const TickDemo = () => {
    return <Demo name="Tick">
        demo
    </Demo>
}

const TimerDemo = () => {
    const { time, methods: timer } = useTimer({
        timer: {
            type: "constrained",
            start_time: 10000,
            stop_time: 1000
        },
        interval: 1000
    })

    return <Demo name="Timer" className="flex justify-center p-20 gap-10">
        <p>Timer: {time}</p>
        <Button onClick={() => timer.start()}> Start Timer </Button>
    </Demo>
}

const InterpolationDemo = () => {
    const { data: position, methods: { start, seek } } = useInterpolation({
        range: [0, 500],
        significant_figure: 10,
    })

    const boxStyle: CSSProperties = {
        backgroundColor: "red",
        position: "relative",
        marginLeft: `${position}px`,
        width: "100px",
        height: "100px"
    }

    return <Demo name="Interpolation">
        <Button onClick={() => start()}> Start Animation </Button>
        <Button onClick={() => seek(50)}> Seek Animation </Button>
        <div style={boxStyle}></div>
    </Demo>
}


const SeriesDemo = () => {
    return <Demo name="Series">
        demo
    </Demo>
}


export const Panel = () => {
    return (
        <div className="flex flex-col gap-10 p-10">
            <TickDemo />
            <TimerDemo />
            <InterpolationDemo />
            <SeriesDemo />
        </div>
    )
}


export const name = "timing"
