import { usePanelNavigation } from "../engine/panel"
import { spritesheet } from "../engine/graphics.sprite"
import { region } from "../engine/graphics.complex"

import test_sheet from '@assets/sprites/Pink_Monster_Idle_4.png'

const Sprite = spritesheet(test_sheet, {
    tile_size: [32,32],
    frame_time: .25,
    structure: {
        "main": {type: "animated", layer: 0, length: 4},
        "tile": {type: "tile", layer: 0, length: 4},
    }
})

const Region = region("test")

export const Panel = () =>{ 
    const navigate = usePanelNavigation()
    return <>
        <button onClick={() => navigate("test")}>test</button>
        <Region style={{width: "100px", height: "100px"}} />
        <Sprite state="main" />
        <Sprite state="main" rate={.5} />
        <Sprite state="main" scale={2}/>
        <Sprite state="tile" frame={3} />
        <Sprite state="tile" scale={2} frame={1} />
        <p className="text-4xl font-bold">
            Hello world!
        </p>
    </>
}

export const name = "menu"