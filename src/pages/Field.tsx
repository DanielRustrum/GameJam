import {FC, useEffect, useRef} from 'react'
import { setupBattleField } from '../services/battle';
import { getPlayerStats, usePlayerRounds } from '../services/stats';
import { useNavigate } from 'react-router-dom';
import { getEnemyStats } from '../services/enemy';

type StagePage = FC<{}>

export const Field: StagePage = () => {
    const PlayerData = getPlayerStats()
    const EnemyData = getEnemyStats()
    const redirect = useNavigate()
    const nextRound = usePlayerRounds()

    console.log(PlayerData, EnemyData)

    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        dialogRef.current?.showModal()
    }, [])


    if(PlayerData === undefined) {
        redirect("/");
        return <></>
    }

    if(EnemyData === undefined) {
        return <></>
    }

    const [EnemyUI, PlayerUI, { 
        startBattle,
    }] = setupBattleField(
        PlayerData, 
        EnemyData,
        (victor: string, health: number) => {
            console.log(victor)
            if(victor === "Player") {
                nextRound(EnemyData.reward_meat, EnemyData.reward_points, health)
                if(PlayerData.phase > 3) {
                    redirect("/end")
                } else {
                    redirect("/upgrade")
                }
            }

            if(victor === "Opponent") {
                redirect("/end-game")
            }
        }
    )

    return (
        <>
            <dialog ref={dialogRef}>
                <button onClick={() => {
                    startBattle()
                    dialogRef.current?.close()
                }}>Start Game</button>
            </dialog>
            <div id="game--ui">
                <p>Player Actions:</p>
                <PlayerUI />
                <p>Enemy Actions:</p>
                <EnemyUI />
            </div>
            
        </>
    )
}