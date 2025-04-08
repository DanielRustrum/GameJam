import { useSceneNavigation } from "../engine/scene"
import test from '../assets/sprites/Boss_Dragon_01_Green.png'
import { spritesheet } from "../engine/sprite"
const Sprite = spritesheet(test)

export const Scene = () =>{ 
    const navigate = useSceneNavigation()
    return <>
        <button onClick={() => navigate("test")}>test</button>
        <Sprite />
    </>
}

export const name = "menu"
