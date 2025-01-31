import { getPlayerStats } from "../../services/stats"
import red_dragon from '../../assets/sprites/Dragon_02_Red.png'
import boss_red_dragon from '../../assets/sprites/Boss_Dragon_01_Red.png'
import blue_dragon from '../../assets/sprites/Dragon_02_Blue.png'
import boss_blue_dragon from '../../assets/sprites/Boss_Dragon_01_Blue.png'
import green_dragon from '../../assets/sprites/Dragon_02_Green.png'
import boss_green_dragon from '../../assets/sprites/Boss_Dragon_01_Green.png'
import { memo } from "react"

export const EnemySprite = memo(() => {
    const PlayerData = getPlayerStats()

    const classes = 'animate-floating-2 sprite--entity'

    switch(PlayerData("phase")) {
        case 1:
            if(PlayerData("round") === 5)
                return (<img className={classes} src={boss_red_dragon} />);
            else
                return (<img className={classes} src={red_dragon} />);
        case 2:
            if(PlayerData("round") === 5)
                return (<img className={classes} src={boss_blue_dragon} />);
            else
                return (<img className={classes} src={blue_dragon} />);
        case 3:
            if(PlayerData("round") === 5)
                return (<img className={classes} src={boss_green_dragon} />);
            else
                return (<img className={classes} src={green_dragon} />);
        default:
            return <></>
    }
})