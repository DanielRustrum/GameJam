import {FC} from 'react'

import { useBackgroundMusic } from '../hooks/useBackgroundMusic'


import placeholder_music from '../assets/sounds/placeholder_music.mp3'

type MenuPage = FC<{}>

export const Menu: MenuPage = () => {
    const [initiate_music, toggle_music] = useBackgroundMusic(placeholder_music, .25)

    return (
        <div onClick={initiate_music} style={{width: "100vw", height: "100vh"}}>
            <h1>Game Name</h1>
            <button>Start</button>
            <button>Settings</button>
            <button onClick={toggle_music}>Mute Music</button>
        </div>
    )
}