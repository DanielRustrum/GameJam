import { addScene } from "../engine/game"

const Scene = () => <>test</>

export default () => {
    console.log("text")
    addScene("menu", Scene)
}