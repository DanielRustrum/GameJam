import { interpolate } from "@/engine/animation.timing"
import { useTimer } from "@/engine/animation.timing.react"
import { CSSProperties, useRef, useState } from "react"

export const Panel = () => {
    const [position, setPosition] = useState(0)

    const dur = 11000
    const sig = 1000
    const [time, {start, set}] = useTimer(dur, sig)

    const animationRef = useRef(
        interpolate({
            range: [0, 500],
            significant_figure: 10,
            onUpdate: (step) => setPosition(step)
        })
    )

    const boxStyle: CSSProperties = {
        backgroundColor: "red",
        position: "relative",
        top: "300px",
        left: `${position}px`,
        width: "100px",
        height: "100px"
    }

    return (
        <div>
            <p>{dur}: {sig}: {time}</p>
            <button onClick={() => {
                set(10000)
                start()
            }}>Start Timer</button>
            <button onClick={() => animationRef.current.start()}>Start Animation</button>
            <button onClick={() => animationRef.current.seek(250)}>Seek Animation</button>
            <div style={boxStyle}></div>
        </div>
    )
}


export const name = "timing"
