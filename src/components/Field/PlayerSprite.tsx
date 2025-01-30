
import player from '../../assets/sprites/Ship_01_draft.png'
import { memo } from "react"

export const PlayerSprite = memo(() => {
    return <img className='animate-floating sprite--entity' src={player} />
})