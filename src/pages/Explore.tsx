import {FC} from 'react'
import { generateEnemy } from '../services/enemy'
import { useNavigate } from 'react-router-dom'
import { getPlayerStats } from '../services/stats'

type ExplorePage = FC<{}>

export const Explore: ExplorePage = () => {
    const genEnemy = generateEnemy()
    const navigate = useNavigate()
    const PlayerData = getPlayerStats()

    return (
        <div className='flex columns mar-auto span-width-50 h-centered full-height gap-25px'>
            <div className='ui--container'>
                <h1 className='text-centered'>Navigation</h1>
                <h2 className='text-centered'>What do you want to do Next?</h2>
            </div>
            <div className='flex space-between gap-25px'>
                <button
                    className='ui--container text-bold fill-width'
                    disabled={PlayerData && PlayerData("round") === 5}
                    onClick={() => navigate("/town")}
                >
                    Go to Town <br/>
                    (Will take up 1 round)
                </button>
                <button
                    className='ui--container text-bold fill-width'
                    disabled={PlayerData && PlayerData("round") === 5}
                    onClick={() => {
                        genEnemy(false)
                        navigate("/field")
                    }}
                >
                    Fight Small Dragon
                </button>
                <button
                    className='ui--container text-bold fill-width'
                    onClick={() => {
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