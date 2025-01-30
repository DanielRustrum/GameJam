import {FC} from 'react'
import { generateEnemy } from '../services/enemy'
import { useNavigate } from 'react-router-dom'
import { getPlayerStats } from '../services/stats'
import { useSoundEffect } from '../hooks/useSoundEffect'

type ExplorePage = FC<{}>

export const Explore: ExplorePage = () => {
    const genEnemy = generateEnemy()
    const navigate = useNavigate()
    const PlayerData = getPlayerStats()
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")

    return (
        <div className='flex columns mar-auto ui--span-page h-centered full-height gap-25px'>
            <div className='ui--container'>
                <h1 className='text-centered'>Navigation</h1>
                <h2 className='text-centered pad-bottom-20px'>What do you want to do Next?</h2>
                <p className='text-centered pad-bottom-10px'>Current Round: {PlayerData("round")}</p>
            </div>
            <div className='flex space-between ui--gap full-width'>
                <button
                    onMouseEnter={() => {playClickEnter()}}
                    className='ui--button-interact-2 ui--container text-bold fill-width'
                    disabled={PlayerData && PlayerData("round") === 5}
                    onClick={() => {
                        playClick()
                        navigate("/town")
                    }}
                >
                    Go to Town <br/>
                    (Will take up 1 round)
                </button>
                <button
                    onMouseEnter={() => {playClickEnter()}}
                    className='ui--button-interact-2 ui--container text-bold fill-width'
                    disabled={PlayerData && PlayerData("round") === 5}
                    onClick={() => {
                        playClick()
                        genEnemy(false)
                        navigate("/field")
                    }}
                >
                    Fight Small Dragon
                </button>
                <button
                    onMouseEnter={() => {playClickEnter()}}
                    className='ui--button-interact-2 ui--container text-bold fill-width'
                    onClick={() => {
                        playClick()
                        genEnemy(true)
                        navigate("/field")
                    }}
                >
                    Fight Large Dragon <br/> 
                    (3 times stronger than a Small Dragon)
                </button>
            </div>
        </div>
    )
}