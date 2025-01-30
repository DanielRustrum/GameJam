import { getPlayerStats } from "../../services/stats"
import red_dragon from '../../assets/sprites/Dragon_02_Red.png'
import blue_dragon from '../../assets/sprites/Dragon_02_Blue.png'
import green_dragon from '../../assets/sprites/Dragon_02_Green.png'
import { memo } from "react"

export const EnemySprite = memo(() => {
    const PlayerData = getPlayerStats()

    const classes = 'animate-floating-2 sprite--entity'

    switch(PlayerData("phase")) {
        case 1:
            return <img className={classes} src={red_dragon} />
        case 2:
            return <img className={classes} src={blue_dragon} />
        case 3:
            return <img className={classes} src={green_dragon} />
        default:
            return <></>
    }
})