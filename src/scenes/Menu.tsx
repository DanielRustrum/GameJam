import { usePanelNavigation } from "../engine/panel"
import { spritesheet } from "../engine/sprite"

import test_sheet from '@assets/sprites/Pink_Monster_Idle_4.png'

const Sprite = spritesheet(test_sheet, {
    tile_size: [32,32],
    frame_time: .25,
    structure: {"main": {layer: 0, length: 4}}
})

export const Panel = () =>{ 
    const navigate = usePanelNavigation()
    return <>
        <button onClick={() => navigate("test")}>test</button>
        <Sprite state="main" rate={3}/>
        <Sprite state="main" scale={4}/>
        <p className="text-xl font-bold underline">
            Hello world!
        </p>
    </>
}

export const name = "menu"
