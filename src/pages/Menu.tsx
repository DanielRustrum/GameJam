import {FC} from 'react'

// import { useBackgroundMusic } from '../hooks/useBackgroundMusic'


// import placeholder_music from '../assets/sounds/placeholder_music.mp3'
import { useNavigate } from 'react-router-dom'
import { useInitPlayerStats } from '../services/stats'

type MenuPage = FC<{}>

export const Menu: MenuPage = () => {
    // const [initiate_music, toggle_music] = useBackgroundMusic(placeholder_music, .25)
    const navigate = useNavigate()
    const initPlayer = useInitPlayerStats()

    return (
        <div style={{width: "100vw", height: "100vh"}}>
            <h1>Game Name</h1>
            <button onClick={() => {
              initPlayer()
              navigate("/upgrade")  
            }}>Start</button>
        </div>
    )
}