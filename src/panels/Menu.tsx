import { usePanelNavigation } from "../engine/panel"
import { spritesheet } from "../engine/graphics.sprite"
import { Button } from "@/components/UI/Button"
import { Slider } from "@/components/UI/slider"

import test_sheet from '@assets/sprites/Pink_Monster_Idle_4.png'
import { memo, useRef, useState } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/UI/resizable"

const [Sprite, {shader}] = spritesheet(test_sheet, {
    tile_size: [32,32],
    frame_time: .25,
    structure: {
        "main": {type: "animated", layer: 0, length: 4},
        "tile": {type: "tile", layer: 0, length: 4},
    }
})

shader("test", (ctx, width, height) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        if (r > 110 && b > 200 && g < 100) {
            data[i] = 60
            data[i + 1] = 80
            data[i + 2] = 70
        }
    }

    ctx.putImageData(imageData, 0, 0)
})

export const RateAnimated = memo(() => {
    const [rate, setRate] = useState(1)
    
    return <div className="flex gap-10">
        <p className="text-m font-bold">Change Animation Rate: </p>
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
        <p className="text-m font-bold">Change Scale: </p>
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
        <p className="text-m font-bold">Change Scale: </p>
        <Sprite state="tile" scale={scale}/>
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

export const HueChangeStatic = memo(() => {
    const [hue, setHue] = useState(0)
    
    return <div className="flex gap-10 items-center">
        <p className="text-m font-bold">Change Hue: </p>
        <Sprite state="tile" style={{ filter: `hue-rotate(${hue}deg)` }} />
        <Slider
            defaultValue={[0]}
            min={0}
            max={360}
            step={1}
            className="w-50"
            onValueChange={value => {
                if(value[0] !== hue) setHue(value[0]);
            }}
        />
        <p>{hue}</p>
    </div>
})

export const ResizeAnimated = () => {
    const Element_Ref = useRef(null)

    return (
        <>
            <p className="text-m font-bold">Resizes to Container: </p>
            <ResizablePanelGroup
                direction="vertical"
                className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
            >
                <ResizablePanel defaultSize={25}>
                    <p>Resize the container to resize the sprite.</p>
                </ResizablePanel>
                <ResizableHandle withHandle/>
                <ResizablePanel defaultSize={75} >
                    <div className="h-full" ref={Element_Ref}>
                        <Sprite state="main" resizeTo={Element_Ref}/>
                    </div>
                </ResizablePanel>
                </ResizablePanelGroup>
        </>
    )
}

export const Panel = () =>{ 
    const navigate = usePanelNavigation()
    return <>
        <p className="text-4xl font-bold">Sprite Test</p>
        <Button onClick={() => navigate("test")}>Navigate to Test</Button>
        <p className="text-xl font-bold">Animation</p>
        <Sprite state="main" />
        <RateAnimated />
        <ScaleAnimated />
        <p className="text-xl font-bold">Static</p>
        <Sprite state="tile" tile={2} />
        <ScaleStatic />
        <HueChangeStatic />
        <ResizeAnimated />
        <Sprite state="main" use_shader="test" scale={3}/>
    </>
}

export const name = "menu"