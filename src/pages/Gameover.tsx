import {FC} from 'react'
import { getPlayerStats, useInitPlayerStats } from '../services/stats'
import { useNavigate } from 'react-router-dom'

type EndPage = FC<{}>

export const End: EndPage = () => {
    const navigate = useNavigate()
    const initPlayer = useInitPlayerStats()
    const PlayerData = getPlayerStats()

    const message = (PlayerData && PlayerData("phase") > 3)? 
        "Congrats! You Made it to the End!":
        "You have encountered an unforunate fate..."

    return (
        <div className='mar-auto flex columns span-width-50 v-centered h-centered full-height pad-bottom-100px gap-50px'>
            <div className='ui--container span-width-50'>
                <h1 className='text-centered'>{message}</h1>
                <p className='text-centered'>Thanks For Playing!</p>
            </div>
            <div className='flex space-between gap-25px span-width-50'>
                <button
                    className='ui--container fill-width text-bold'
                    onClick={() => {
                        initPlayer()
                        navigate("/upgrade")  
                    }}
                >
                    Play Again!
                </button>
                <button
                    className='ui--container fill-width text-bold'
                    onClick={() => {
                        navigate("/")  
                    }}
                >
                    Return To Main Menu
                </button>
            </div>
        </div>
    )

}