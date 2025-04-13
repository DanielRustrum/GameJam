import { Component } from "../types/component"
import { PanelController } from "./panel"

type GameControllerComponent = Component<{
    PanelErrorComponent: Component,
    entry_panel: string
}>

export const GameController: GameControllerComponent = ({
    entry_panel, PanelErrorComponent, children
}) => {
    return <PanelController 
        entry_panel={entry_panel} 
        PanelErrorComponent={PanelErrorComponent}
    >
        {children}
    </PanelController>
}