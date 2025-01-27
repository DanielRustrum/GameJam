import {FC, useState} from 'react'
import { PlayerBucketData, usePlayerBucket } from '../services/stats'
import { useNavigate } from 'react-router-dom'

type TownPage = FC<{}>

type useTraderHook = () => [
    number,
    (cost: number, transaction: string) => void
]

const useTrader: useTraderHook = () => {
    const [PlayerData, setPlayerData] = usePlayerBucket()
    if (PlayerData === undefined) return [0, (_, __) => {}]

    const [current_meat, setCurrentMeat] = useState(PlayerData.meat_count)

    const setStat = (stat: string, value: number) => setPlayerData((set: PlayerBucketData) => {
        return { ...set, [stat]: value }
    })

    const heal = (amount: number) => {
        const new_current = amount + PlayerData.current_health

        if (new_current >= PlayerData.current_health) {
            setStat("current_health", PlayerData.max_health)
        } else {
            setStat("current_health", new_current)

        }
    }

    return [
        current_meat,
        (meat_cost: number, transaction: string) => {
            if(meat_cost > PlayerData.meat_count) return;

            setCurrentMeat(meat => meat - meat_cost)
            setStat("meat_count", PlayerData.meat_count - meat_cost)
            if(transaction === "heal")
                heal(200);
            if(transaction === "upgrade")
                setStat("upgrade_points", PlayerData.upgrade_points + 1);

        }
    ]
    
}

export const Town: TownPage = () => {
    const [stock, trade] = useTrader()
    const redirect = useNavigate()
    return (
        <div>
            <button
                disabled={stock < 3}
                onClick={() => {
                    trade(3, "heal")
                }}
            >
                Ship Repair (Costs 3 Meat)
            </button>
            <button
                disabled={stock < 2}
                onClick={() => {
                    trade(2, "upgrade")
                }}
            >
                Stat Point (Costs 2 Meat)
            </button>
            <button 
                onClick={() => {redirect("/upgrade")}}
            >Leave Town</button>
        </div>
    )
}