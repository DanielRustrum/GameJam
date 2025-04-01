import { createContext, useContext, useState } from "react"
import { Component } from "../types/component"

const scenes = Object.values(import.meta.glob(
    '@scenes/*.tsx',
    {eager: true}
))


type GameControllerComponent = Component<{
    SceneErrorComponent: Component,
    entry_scene: string
}>
type GlobalGameMethod = {
    changeScene: (name: string) => void
}


const SceneMap = new Map<string, Component>()
const GlobalGameContext = createContext<GlobalGameMethod | null>(null)

export const GameController: GameControllerComponent = ({
    entry_scene, SceneErrorComponent, children
}) => {
    const [current_scene, setCurrentScene] = useState(entry_scene)
    const Scene = SceneMap.get(current_scene)

    if(Scene === undefined) return <SceneErrorComponent />;

    return <GlobalGameContext.Provider value={{
        changeScene: (name) => setCurrentScene(name)
    }}>
        <Scene>
            {children}
        </Scene>
    </GlobalGameContext.Provider>
}

export const addScene = (name: string, scene: Component) => {
    SceneMap.set(name, scene)
}

export const useSceneNavigation = (name: string) => {
    const GameObject = useContext(GlobalGameContext)
    GameObject?.changeScene(name)
}


scenes.map((mod: any) => {
    mod.default()
})