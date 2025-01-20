import { FC, useCallback, useMemo, useState } from "react"
import { getPlayerStats } from "./stats"
import { CountDownBar } from "../components/Field/CountDownBar"
import { ProgressBar } from "../components/Field/ProgressBar"

const getEnemy = (_:number) => {
    return {
        max_health: 1000,
        max_attack: 50
    }
}

type setupBattleFieldFunction = (phase?: number) => [
    FC<{}>,
    FC<{}>,
    {}
]

export const setupBattleField: setupBattleFieldFunction = (phase=0) => {
    const [is_paused, setIsPause] = useState(false)
    const PlayerStats = getPlayerStats()
    const [player_health, setPlayerHealth] = useState(PlayerStats.max_health)
    
    const EnemyStats = getEnemy(phase)
    const [enemy_health, setEnemyHealth] = useState(EnemyStats.max_health)

    const damagePlayer = useCallback((damage: number) => {
        const new_health = player_health - damage
        setPlayerHealth(new_health)
    }, [player_health])

    const damageEnemy = useCallback((damage: number) => {
        const new_health = enemy_health - damage
        setEnemyHealth(new_health)
    }, [enemy_health])

    const togglePause = useCallback(() => {

    }, [enemy_health])

    const actions = useMemo(() => ({ 
    }),[])

    const PlayerUI = () => (<div>
        <ProgressBar 
            bar_name="Player Health"
            max_value={PlayerStats.max_health} 
            current_value={player_health}
        />
        <CountDownBar 
            bar_name="Attack" 
            duration={4 * 1000}
            onFinish={() => {
                damageEnemy(PlayerStats.attack_damage)
            }}
            is_frozen={is_paused}
        />
        <CountDownBar 
            bar_name="Defense" 
            duration={4 * 1000}
            onFinish={() => {
                damageEnemy(PlayerStats.attack_damage)
            }}
            is_frozen={is_paused}
        />
        <CountDownBar 
            bar_name="Persistence" 
            duration={4 * 1000}
            onFinish={() => {
                damageEnemy(PlayerStats.attack_damage)
            }}
            is_frozen={is_paused}
        />
        <button>Put Up Shield</button>
        <button onClick={() => {
            setIsPause(!is_paused)
        }}>Pause</button>
    </div>)

    const EnemyUI = () => (<div>
        <ProgressBar 
            bar_name="Enemy Health"
            max_value={EnemyStats.max_health} 
            current_value={enemy_health}
        />
        <CountDownBar 
            bar_name="Attack" 
            duration={4 * 1000}
            onFinish={() => {
                damagePlayer(EnemyStats.max_attack)
            }}
            is_frozen={is_paused}
        />
        <CountDownBar 
            bar_name="Freeze Attack" 
            duration={4 * 1000}
            onFinish={() => {
                damagePlayer(EnemyStats.max_attack)
            }}
            is_frozen={is_paused}
        />
        <CountDownBar 
            bar_name="Defense" 
            duration={4 * 1000}
            onFinish={() => {
                damagePlayer(EnemyStats.max_attack)
            }}
            is_frozen={is_paused}
        />
        <CountDownBar 
            bar_name="Persistence" 
            duration={4 * 1000}
            onFinish={() => {
                damagePlayer(EnemyStats.max_attack)
            }}
            is_frozen={is_paused}
        />

    </div>)
    return [EnemyUI, PlayerUI, actions]
}