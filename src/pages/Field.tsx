import {FC} from 'react'
import { setupBattleField } from '../services/battle';

type StagePage = FC<{}>

export const Field: StagePage = () => {
    const [EnemyUI, PlayerUI, { 
        freezePlayer,
        startBattle,
        pauseBattle,
        resumeBattle
     }] = setupBattleField(0, (victor: string) => {
        console.log(victor)
     })

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
                    <button onClick={startBattle}>Start Game</button>
                    <button onClick={() => freezePlayer(1000)}>FreezePlayer</button>
                    <button onClick={pauseBattle}>Pause Game</button>
                    <button onClick={resumeBattle}>Resume Game</button>
                    <div id="game--log">
                        <p>Log Starts Here</p>
                    </div>
                </div>
            </div>
            
        </>
    )
}