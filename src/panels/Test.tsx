import { useEffect, useState } from "react"
import { soundEffect } from "../engine/audio"

const [click, {volume, rate}] = soundEffect("shield-stop")


export const Panel = () => {
    const [click_volume, setClickVolume] = useState(0.5)

    useEffect(() => {
        volume(0, true)
        rate(0.01)
        click()
    }, [])

    return <div onClick={() => {
        volume(click_volume, true)
        setClickVolume(click_volume === 0.1? 0.5: 0.1)
    }}>This is a Test {click_volume}</div>
}

export const name = "test"
