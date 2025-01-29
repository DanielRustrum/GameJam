import {FC, useEffect, useRef} from 'react'
import { setupBattleField } from '../services/battle';
import { getPlayerStats, usePlayerRounds } from '../services/stats';
import { useNavigate } from 'react-router-dom';
import { getEnemyStats } from '../services/enemy';
import { EnemySprite } from '../components/Field/EnemySprite';
import { useSoundEffect } from '../hooks/useSoundEffect';

type StagePage = FC<{}>

export const Field: StagePage = () => {
    const PlayerData = getPlayerStats()
    const EnemyData = getEnemyStats()
    const redirect = useNavigate()
    const nextRound = usePlayerRounds()
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")

    const startDialog = useRef<HTMLDialogElement>(null)
    const endDialog = useRef<HTMLDialogElement>(null)
    

    useEffect(() => {
        startDialog.current?.showModal()
    }, [])

    const [EnemyUI, PlayerUI, { 
        startBattle,
    }] = setupBattleField(
        (victor: string, health: number) => {
            if(victor === "Player") {
                nextRound(EnemyData("reward_meat"), EnemyData("reward_points"), health)
                endDialog.current?.showModal()
            }

            if(victor === "Opponent") {
                redirect("/end-game")
            }
        }
    )

    return (
        <>
            <dialog 
                ref={startDialog}
                className='mar-auto'
            >
                <div
                    className='
                        ui--container flex columns space-between v-centered ui--pad
                        span-width-50 mar-auto span-height-30
                    '
                >
                    <div>
                        <h2 className='text-centered'>Round {PlayerData("round")}</h2>
                        <h3 className='text-centered'>Phase {PlayerData("phase")}</h3>
                    </div>
                    <button 
                        onMouseEnter={() => {playClickEnter()}}
                        className='ui--button-interact-2 mar-top-20px full-width pad-15px bg-color-none border-round-4px text-bold'
                        onClick={() => {
                            startBattle()
                            playClick()
                            startDialog.current?.close()
                        }}
                    >Start!</button>
                </div>
            </dialog>
            <dialog 
                className='mar-auto'
                ref={endDialog}
            >
                <div
                    className='
                        ui--container flex columns space-between v-centered ui--pad
                        span-width-30 mar-auto span-height-30 ui--mobile-full-width
                    '
                >
                    <div>
                        <h2 className='text-centered pad-bottom-25px'>You have Defeated the Dragon!</h2>
                        <h3 className='text-centered pad-bottom-5px'>You Get:</h3>
                        <p className='text-centered'>{EnemyData("reward_meat")} Dragon Meat</p>
                        <p className='text-centered'>{EnemyData("reward_points")} Stat Points</p>
                    </div>
                    <button 
                        onMouseEnter={() => {playClickEnter()}}
                        className='ui--button-interact-2 full-width pad-15px bg-color-none border-round-4px text-bold'
                        onClick={() => {
                            playClick()
                            if(PlayerData("phase") > 3) {
                                redirect("/end-game")
                            } else {
                                redirect("/upgrade")
                            }
                        }}
                    >
                        Go to Stronghold
                    </button>
                </div>
            </dialog>
            <div id="game--ui" className='flex full-height ui--stack space-between v-end pad-10px'>
                <PlayerUI />
                <EnemyUI />
            </div>
            <div 
                className="sprite--entities mar-auto flex v-centered space-between span-width-100 pad-25px" 
            >
                <p>Player Goes Here</p>
                <EnemySprite />
            </div>
        </>
    )
}