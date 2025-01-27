import {FC} from 'react'
import { setupBattleField } from '../services/battle';
import { getPlayerStats, useInitPlayerStats, usePlayerRounds } from '../services/stats';
import { useNavigate } from 'react-router-dom';
import { getEnemyStats } from '../services/enemy';

type StagePage = FC<{}>

export const Field: StagePage = () => {
    const PlayerData = getPlayerStats()
    const EnemyData = getEnemyStats()
    const redirect = useNavigate()
    const nextRound = usePlayerRounds()

    if(PlayerData === undefined) {
        redirect("/");
        return <></>
    }

    if(EnemyData === undefined) {
        return <></>
    }

    const [EnemyUI, PlayerUI, { 
        freezePlayer,
        startBattle,
        pauseBattle,
        resumeBattle
    }] = setupBattleField(
        PlayerData, 
        EnemyData,
        (victor: string) => {
            if(victor === "Player") {
                nextRound(EnemyData.reward_meat, EnemyData.reward_points)
                if(PlayerData.phase > 3) {
                    redirect("/end")
                } else {
                    redirect("/upgrade")
                }
            }

            if(victor === "Enemy") {
                redirect("/end")
            }
        }
    )

    const resetStats = useInitPlayerStats()

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
                    <button onClick={() => freezePlayer(1000)}>Freeze Player</button>
                    <button onClick={pauseBattle}>Pause Game</button>
                    <button onClick={resumeBattle}>Resume Game</button>
                    <button onClick={resetStats}>Reset Stats</button>
                    <div id="game--log">
                        <p>Log Starts Here</p>
                    </div>
                </div>
            </div>
            
        </>
    )
}