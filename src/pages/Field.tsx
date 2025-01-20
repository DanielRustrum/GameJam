import {FC} from 'react'
import { setupBattleField } from '../services/battle';

type StagePage = FC<{}>

export const Field: StagePage = () => {
    const [EnemyUI, PlayerUI] = setupBattleField()

    return (
        <>
            <div id="game--ui">
                <div>
                    <button>View Ship Stats</button>
                </div>
                <p>Player Actions:</p>
                <PlayerUI />
                <p>Enemy Actions:</p>
                <EnemyUI />
                <div>
                    <p>Dev Actions:</p>
                    <button>Start Game</button>
                    <button>Pause Game</button>
                    <button>Resume Game</button>
                    <div id="game--log">
                        <p>Log Starts Here</p>
                    </div>
                </div>
            </div>
            
        </>
    )
}