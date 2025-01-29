import {FC, useState} from 'react'
import { usePlayerBucket, usePlayerRounds } from '../services/stats'
import { useNavigate } from 'react-router-dom'

type TownPage = FC<{}>

type useTraderHook = () => [
    number,
    (cost: number, transaction: string) => void
]

const useTrader: useTraderHook = () => {
    const [PlayerData, setPlayerData] = usePlayerBucket()
    if (PlayerData === undefined) return [0, (_, __) => {}]

    const [current_meat, setCurrentMeat] = useState(PlayerData("meat_count"))


    const heal = (amount: number) => {
        const new_current = amount + PlayerData("current_health")

        if (new_current >= PlayerData("current_health")) {
            setPlayerData("current_health", PlayerData("max_health"))
        } else {
            setPlayerData("current_health", new_current)
        }
    }

    return [
        current_meat,
        (meat_cost: number, transaction: string) => {
            if(meat_cost > PlayerData("meat_count")) return;

            setCurrentMeat(meat => meat - meat_cost)
            setPlayerData("meat_count", PlayerData("meat_count") - meat_cost)
            if(transaction === "heal")
                heal(200);
            if(transaction === "upgrade")
                setPlayerData("upgrade_points", PlayerData("upgrade_points") + 1);

        }
    ]
    
}

export const Town: TownPage = () => {
    const [stock, trade] = useTrader()
    const [PlayerData, _] = usePlayerBucket()
    const redirect = useNavigate()
    const next_round = usePlayerRounds()
    const [current_health, setCurrentHealth] = useState(PlayerData("current_health"))

    if(PlayerData === undefined) return <></>
    return (
        <div className='mar-auto flex columns v-centered h-centered gap-25px full-height ui--span-page'>
            <div className='ui--container full-width'>
                <h1 className='text-centered'>Welcome to Town!</h1>
                <h2 className='text-centered'>Do you want to trade for anything?</h2>
                <p className='text-centered pad-top-25px'>Meat Available for Trade: {stock}</p>
            </div>
            <div className='flex space-between full-width gap-25px'>
                <button
                    className='ui--container fill-width text-bold'
                    disabled={stock < 3}
                    onClick={() => {
                        trade(3, "heal")
                        const new_current = 200 + PlayerData("current_health")

                        if (new_current >= PlayerData("current_health")) {
                            setCurrentHealth( PlayerData("max_health"))
                        } else {
                            setCurrentHealth(new_current)
                        }
                    }}
                >
                    Ship Repair <br/>
                    Health: {current_health} / {PlayerData("max_health")}
                    <br /><br />
                    Repair the Ship by 200 at the cost of 3 Meat
                </button>
                <button
                    className='ui--container fill-width text-bold'
                    disabled={stock < 2}
                    onClick={() => {
                        trade(2, "upgrade")
                    }}
                >
                    Stat Point  <br /><br />
                    Get 1 stat point at the cost of 2 Meat
                </button>
                <button 
                    className='ui--container fill-width text-bold'
                    onClick={() => {
                        next_round(0,0,PlayerData("current_health"))
                        redirect("/upgrade")
                    }}
                >All Done!</button>
            </div>
        </div>
    )
}