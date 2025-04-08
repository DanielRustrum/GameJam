import { Component } from "../types/component"
import { SceneController } from "./scene"

type GameControllerComponent = Component<{
    SceneErrorComponent: Component,
    entry_scene: string
}>

export const GameController: GameControllerComponent = ({
    entry_scene, SceneErrorComponent, children
}) => {
    return <SceneController 
        entry_scene={entry_scene} 
        SceneErrorComponent={SceneErrorComponent}
    >
        {children}
    </SceneController>
}