import {FC} from 'react'
import { getPlayerStats, useInitPlayerStats } from '../services/stats'
import { useNavigate } from 'react-router-dom'
import { useSoundEffect } from '../hooks/useSoundEffect'

type EndPage = FC<{}>

export const End: EndPage = () => {
    const navigate = useNavigate()
    const initPlayer = useInitPlayerStats()
    const PlayerData = getPlayerStats()
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")

    const message = (PlayerData && PlayerData("phase") > 3)? 
        "Congrats! You Made it to the End!":
        "You have encountered an unforunate fate..."

    return (
        <div className='ui--gap mar-auto flex columns span-width-50 v-centered h-centered full-height pad-bottom-100px'>
            <div className='ui--container ui--span-page'>
                <h1 className='text-centered'>{message}</h1>
                <p className='text-centered'>Thanks For Playing!</p>
            </div>
            <div className='flex space-between ui--gap ui--span-page'>
                <button
                    className='ui--button-interact-2 ui--container fill-width text-bold'
                    onMouseEnter={() => {playClickEnter()}}
                    onClick={() => {
                        playClick()
                        initPlayer()
                        navigate("/upgrade")  
                    }}
                >
                    Play Again!
                </button>
                <button
                    className='ui--button-interact-2 ui--container fill-width text-bold'
                    onMouseEnter={() => {playClickEnter()}}
                    onClick={() => {
                        playClick()
                        navigate("/")  
                    }}
                >
                    Return To Main Menu
                </button>
            </div>
        </div>
    )

}