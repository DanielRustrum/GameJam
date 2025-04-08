import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import './styles/stylex.css'
import { GameController } from './engine/game'

const Error = ({}) => <></>

const Global = () => <GameController 
    entry_scene='menu'
    SceneErrorComponent={Error}
  >
  </GameController>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global />
  </StrictMode>,
)
