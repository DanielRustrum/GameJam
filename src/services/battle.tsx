import { FC, useCallback, useMemo, useEffect } from "react"
import { getPlayerStats } from "./stats"
import { useCountDownBar } from "../components/Field/CountDownBar"
import { useStatBar } from "../components/Field/StatBar"
import { useShieldButton } from "../components/Field/ShieldButton"
import { useFocusButton } from "../components/Field/FocusButton"

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
        adjustRate: adjustAttack,
    }] = useCountDownBar(
        "Attack", 
        4000, 
        () => damageEnemy(PlayerStats.attack_damage),
    )
    const [DefenseBar, {
        freezeBar: freezeDefence,
        adjustRate: adjustDefense,

    }] = useCountDownBar("Defense", 4000, () => damageEnemy(PlayerStats.attack_damage))
    const [LuckBar, {
        freezeBar: freezeLuck,
        adjustRate: adjustLuck,
    }] = useCountDownBar("Luck", 4000, () => damageEnemy(PlayerStats.attack_damage))
    
    const [
        _,
        [
            AttackFocusButton,
            DefenseFocusButton,
            LuckFocusButton
        ]
    ] = useFocusButton([
        "Attack",
        "Defense",
        "Luck",
    ], "Attack",
    (stat) => {
        console.log(stat)
        switch(stat) {
            case "Attack":
                adjustAttack(2)
                adjustDefense(1)
                adjustLuck(1)
                break
            case "Defense":
                adjustAttack(1)
                adjustDefense(2)
                adjustLuck(1)
                break
            case "Luck":
                adjustAttack(1)
                adjustDefense(1)
                adjustLuck(2)
                break
            default:
                adjustAttack(1)
                adjustDefense(1)
                adjustLuck(1)
                break
        }
    })

    const [ShieldButton, { getToggleState }] = useShieldButton(1000, 2000)

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
        if(!getToggleState()) {
            freezeAttack(duration)
            freezeDefence(duration)
            freezeLuck(duration)
        }
    }

    const PlayerUI = () => {
        return (
            <div>
                <ShieldButton />
                <PlayerHealthBar />
                <AttackBar />
                <AttackFocusButton/>
                <DefenseBar />
                <DefenseFocusButton />
                <LuckBar />
                <LuckFocusButton />
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