import { getPlayerStats } from "../../services/stats"
import red_dragon from '../../assets/sprites/Dragon_01_Red_draft.png'
import blue_dragon from '../../assets/sprites/Dragon_01_Blue_draft.png'
import green_dragon from '../../assets/sprites/Dragon_01_Green_draft.png'
import { memo } from "react"

export const EnemySprite = memo(() => {
    const PlayerData = getPlayerStats()

    switch(PlayerData("phase")) {
        case 1:
            return <img src={red_dragon} />
        case 2:
            return <img src={blue_dragon} />
        case 3:
            return <img src={green_dragon} />
        default:
            return <></>
    }
})