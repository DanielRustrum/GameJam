import { createContext, useContext, useEffect, useState } from "react"
import { Component } from "../types/component"

const panels = Object.values(import.meta.glob(
    '@panels/*.tsx',
    {eager: true}
))


export const useWindowFocus = () => {
    const [is_focused, setIsFocused] = useState(true)
  
    useEffect(() => {
      const handleFocus = () => setIsFocused(true)
      const handleBlur = () => setIsFocused(false)
  
      window.addEventListener('focus', handleFocus)
      window.addEventListener('blur', handleBlur)
  
      return () => {
        window.removeEventListener('focus', handleFocus)
        window.removeEventListener('blur', handleBlur)
      }
    }, [])
  
    return is_focused
}

const PanelMap = new Map<string, Component>()

type PanelControllerComponent = Component<{
    PanelErrorComponent: Component,
    entry_panel: string
}>
type GlobalPanelMethods = {
    changePanel: (name: string) => void
}

const GlobalPanelContext = createContext<GlobalPanelMethods | null>(null)

export const PanelController: PanelControllerComponent = ({entry_panel, PanelErrorComponent, children}) => {
    const [current_panel, setCurrentPanel] = useState(entry_panel)
    const Panel = PanelMap.get(current_panel)

    if(Panel === undefined) return <PanelErrorComponent />;

    return <GlobalPanelContext.Provider value={{
        changePanel: (name) => setCurrentPanel(name)
    }}>
        <Panel>
            {children}
        </Panel>
    </GlobalPanelContext.Provider>
}

export const usePanelNavigation = () => {
    const GameObject = useContext(GlobalPanelContext)
    return (name: string) => GameObject?.changePanel(name)
}

//? Needs to be called last because addPanel needs to be defined
panels.map((mod: any) => {
    PanelMap.set(mod.name, mod.Panel)
})