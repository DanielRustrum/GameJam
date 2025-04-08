import { createContext, useContext, useEffect, useState } from "react"
import { Component } from "../types/component"

const scenes = Object.values(import.meta.glob(
    '@scenes/*.tsx',
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

const SceneMap = new Map<string, Component>()

type SceneControllerComponent = Component<{
    SceneErrorComponent: Component,
    entry_scene: string
}>
type GlobalSceneMethods = {
    changeScene: (name: string) => void
}

const GlobalSceneContext = createContext<GlobalSceneMethods | null>(null)

export const SceneController: SceneControllerComponent = ({entry_scene, SceneErrorComponent, children}) => {
    const [current_scene, setCurrentScene] = useState(entry_scene)
    const Scene = SceneMap.get(current_scene)

    if(Scene === undefined) return <SceneErrorComponent />;

    return <GlobalSceneContext.Provider value={{
        changeScene: (name) => setCurrentScene(name)
    }}>
        <Scene>
            {children}
        </Scene>
    </GlobalSceneContext.Provider>
}

export const useSceneNavigation = () => {
    const GameObject = useContext(GlobalSceneContext)
    return (name: string) => GameObject?.changeScene(name)
}

//? Needs to be called last because addScene needs to be defined
scenes.map((mod: any) => {
    SceneMap.set(mod.name, mod.Scene)
})