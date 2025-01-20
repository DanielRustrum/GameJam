import { FC, useCallback, useMemo } from "react"
import { getPlayerStats } from "./stats"
import { useCountDownBar } from "../components/Field/CountDownBar"
import { useStatBar } from "../components/Field/StatBar"

const getEnemy = (_:number) => {
    return {
        max_health: 1000,
        max_attack: 50
    }
}

type setupBattleFieldFunction = (phase?: number) => [
    FC<{}>,
    FC<{}>,
    {
        freezePlayer: (duration: number) => void
    }
]

export const setupBattleField: setupBattleFieldFunction = (phase=0) => {
    const PlayerStats = getPlayerStats()
    const EnemyStats = getEnemy(phase)

    const [AttackBar, {
        freezeBar: freezeAttack,
        unfreezeBar,
        adjustRate,
        moveProgress
    }] = useCountDownBar(
        "Attack", 
        4000, 
        () => damageEnemy(PlayerStats.attack_damage),
        // (timer: number) => console.log("Attack:", timer) 
    )
    const [DefenseBar, {
        freezeBar: freezeDefence
    }] = useCountDownBar("Defense", 4000, () => damageEnemy(PlayerStats.attack_damage))
    const [LuckBar, {
        freezeBar: freezeLuck
    }] = useCountDownBar("Luck", 4000, () => damageEnemy(PlayerStats.attack_damage))

    const[PlayerHealthBar, {
        reduceValue: damagePlayer
    }] = useStatBar(
        "Player Health",
        PlayerStats.max_health,
        PlayerStats.max_health
    )

    const[EnemyHealthBar, {
        reduceValue: damageEnemy
    }] = useStatBar(
        "Enemy Health",
        PlayerStats.max_health,
        PlayerStats.max_health
    )
    
    const [EnemyAttackBar] = useCountDownBar("Attack", 4100, () => damagePlayer(EnemyStats.max_attack))
    const [EnemyFreezeBar] = useCountDownBar("Freeze", 4000, () => freezePlayer(500))
    const [EnemyDefenseBar] = useCountDownBar("Defense", 4100, () => damagePlayer(EnemyStats.max_attack))
    const [EnemyLuckBar] = useCountDownBar("Luck", 4100, () => damagePlayer(EnemyStats.max_attack))


    const freezePlayer = (duration: number) => {
        freezeAttack(duration)
        freezeDefence(duration)
        freezeLuck(duration)
    }

    const PlayerUI = () => {
        return (
            <div>
                <button>Put Up Shield</button>
                <button onClick={() => unfreezeBar()}>Unfreeze</button>
                <button onClick={() => adjustRate(2)}>SpeedUp Attack</button>
                <button onClick={() => moveProgress(2000)}>center Attack</button>
                <PlayerHealthBar />
                <AttackBar />
                <DefenseBar />
                <LuckBar />
            </div>
        )
    }

    const EnemyUI = () => {
        return (
            <div>
                <EnemyHealthBar />
                <EnemyAttackBar />
                <EnemyFreezeBar />
                <EnemyDefenseBar />
                <EnemyLuckBar />
            </div>
        )
    }

    const actions = useMemo(() => ({
        freezePlayer
    }),[])
    return [useCallback(EnemyUI,[]), useCallback(PlayerUI, []), actions]
}