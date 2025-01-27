import {FC} from 'react'
import { generateEnemy, useSetNextEnemy } from '../services/enemy'
import { useNavigate } from 'react-router-dom'

type ExplorePage = FC<{}>

export const Explore: ExplorePage = () => {
    const genEnemy = generateEnemy()
    const selectEnemy = useSetNextEnemy()
    const navigate = useNavigate()

    return (
        <div>
            <button onClick={() => navigate("/town")}>Town</button>
            <button
                onClick={() => {
                    selectEnemy(genEnemy(false))
                    navigate("/field")
                }}
            >Small Dragon</button>
            <button
                onClick={() => {
                    (genEnemy(true))
                    navigate("/field")
                }}
            >Large Dragon</button>
        </div>
    )
}