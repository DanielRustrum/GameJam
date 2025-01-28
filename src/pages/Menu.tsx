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
        <div className='mar-auto flex columns v-centered h-centered full-height pad-bottom-100px gap-50px'>
            <h1>Game Name</h1>
            <div className='flex columns gap-10px'>
                <button
                    style={{padding: "10px 80px"}}
                    className='ui--container text-bold'
                    onClick={() => {
                        initPlayer()
                        navigate("/upgrade")  
                    }}
                >
                    Start
                </button>
                <button
                    style={{padding: "10px 80px"}}
                    className='ui--container text-bold'
                    onClick={() => {
                        initPlayer()
                        navigate("/tutorial")  
                    }}
                >
                    See Tutorial
                </button>
            </div>
        </div>
    )
}