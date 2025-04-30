import { Component } from "../types/component"
import { PanelController } from "./panel"

type GameControllerComponent = Component<{
    PanelErrorComponent: Component,
    entry_panel: string
    panels:  {
        [key: string]: Component;
    }
}>

export const GameController: GameControllerComponent = ({
    entry_panel, PanelErrorComponent, children, panels
}) => {
    return <PanelController 
        entry_panel={entry_panel} 
        PanelErrorComponent={PanelErrorComponent}
        panels={panels}
    >
        {children}
    </PanelController>
}