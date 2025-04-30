import { usePanelNavigation } from "../engine/panel"
import { spritesheet } from "../engine/graphics.sprite"
import { Button } from "@/components/UI/Button"
import { Slider } from "@/components/UI/slider"

import test_sheet from '@assets/sprites/Pink_Monster_Idle_4.png'
import { memo, useState } from "react"

const Sprite = spritesheet(test_sheet, {
    tile_size: [32,32],
    frame_time: .25,
    structure: {
        "main": {type: "animated", layer: 0, length: 4},
        "tile": {type: "tile", layer: 0, length: 4},
    }
})

export const RateAnimated = memo(() => {
    const [rate, setRate] = useState(1)
    
    return <div className="flex gap-10">
        <Sprite state="main" rate={rate} />
        <Slider
            defaultValue={[1]}
            min={0}
            max={2}
            step={.1}
            className="w-50"
            onValueChange={value => {
                if(value[0] !== rate) setRate(value[0]);
            }}
        />
        <p>{rate}</p>
    </div>
})

export const ScaleAnimated = memo(() => {
    const [scale, setScale] = useState(1)
    
    return <div className="flex gap-10 items-center">
        <Sprite state="main" scale={scale} />
        <Slider
            defaultValue={[1]}
            min={.5}
            max={2}
            step={.1}
            className="w-50"
            onValueChange={value => {
                if(value[0] !== scale) setScale(value[0]);
            }}
        />
        <p>{scale}</p>
    </div>
})

export const ScaleStatic = memo(() => {
    const [scale, setScale] = useState(1)
    
    return <div className="flex gap-10 items-center">
        <Sprite state="tile" scale={scale} />
        <Slider
            defaultValue={[1]}
            min={.5}
            max={2}
            step={.1}
            className="w-50"
            onValueChange={value => {
                if(value[0] !== scale) setScale(value[0]);
            }}
        />
        <p>{scale}</p>
    </div>
})


export const Panel = () =>{ 
    const navigate = usePanelNavigation()
    return <>
        <p className="text-4xl font-bold">
            Hello world!
        </p>
        <Button onClick={() => navigate("test")}>Navigate to Test</Button>
        <Sprite state="main" />
        <RateAnimated />
        <ScaleAnimated />
        <Sprite state="tile" tile={3} />
        <ScaleStatic />
    </>
}

export const name = "menu"