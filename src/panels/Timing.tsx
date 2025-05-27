import { interpolate, timer } from "@/engine/animation.timing"
import { CSSProperties, useState } from "react"

export const Panel = () => {
    const [time, setTime] = useState(1000)
    const [position, setPosition] = useState(0)
    
    const test_timer = timer(10000, 1000, (rem) => setTime(rem))
    const box_animation = interpolate({
        range: [0, 500],
        significant_figure: 10,
        onUpdate: (step) => {
            setPosition(step)
        }
    })

    box_animation.seek(500)

    const boxStyle:CSSProperties = {
        backgroundColor: "red",
        position: "relative",
        top: "300px",
        left: `${position}px`,
        width: "100px",
        height: "100px"
    }

    return <div>
        <p>{time}</p>
        <button onClick={() => test_timer.start()}>Start</button>
        <button onClick={() => box_animation.start()}>Start Animation</button>
        <div style={boxStyle}></div>
    </div>
}

export const name = "timing"
