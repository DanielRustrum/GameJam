import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { GameController } from './engine/game'
import { Component } from './types/component'

const panels = Object.fromEntries(
  Object.values(
    import.meta.glob(
      '@panels/*.tsx',
      {eager: true}
    )
  ).map((mod: any) => {
      return [mod.name, mod.Panel]
  })
) as {[key: string]: Component}



const Error = ({}) => <></>

const Global = () => <GameController 
    entry_panel='menu'
    PanelErrorComponent={Error}
    panels={panels}
  >
  </GameController>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global />
  </StrictMode>,
)