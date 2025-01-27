import { FC, memo, useMemo, useRef } from "react"
import { PlayerBucketData } from "./stats"
import { useCountDownBar } from "../components/Field/CountDownBar"
import { useStatBar } from "../components/Field/StatBar"
import { useShieldButton } from "../components/Field/ShieldButton"
import { useFocusButton } from "../components/Field/FocusButton"
import { EnemyBucketData } from "./enemy"


type setupBattleFieldFunction = (
    PlayerStats: PlayerBucketData,
    EnemyStats: EnemyBucketData,
    onBattleEnd?: (victor: "Player" | "Opponent") => void
) => [
    FC<{}>,
    FC<{}>,
    {
        freezePlayer: (duration: number) => void
        startBattle: () => void
        pauseBattle: () => void
        resumeBattle: () => void
    }
]

const isCrit = (stat: number) => {
    const chance = Math.random() * 100
    return stat >= 1 || chance < stat

}

export const setupBattleField: setupBattleFieldFunction = (
    PlayerStats,
    EnemyStats, 
    onBattleEnd=()=>{}
) => {

    const battlefieldDataRef = useRef({
        player_defense_stack: 0,
        enemy_defense_stack: 0,
        player_luck_stack: 0,
        enemy_luck_stack: 0,
        has_ended: false
    })

    //* Player Stat Bars
    const [AttackBar, {
        freezeBar: freezeAttack,
        unfreezeBar: unfreezeAttack,
        adjustRate: adjustAttack,
        startCountdown: startPlayerAttack
    }] = useCountDownBar("Attack", 4000, () => {
        const damage_calc = PlayerStats.attack_damage - battlefieldDataRef.current.enemy_defense_stack
        const actual_damage = damage_calc < 0? 0: damage_calc

        const critted = isCrit(battlefieldDataRef.current.player_luck_stack)
        const mult = critted? 1.2: 1
        damageEnemy(actual_damage * mult)
        battlefieldDataRef.current.enemy_defense_stack = 0
        
        if(critted)
            battlefieldDataRef.current.player_luck_stack = 0;

    })
    const [DefenseBar, {
        freezeBar: freezeDefence,
        unfreezeBar: unfreezeDefense,
        adjustRate: adjustDefense,
        startCountdown: startPlayerDefense
    }] = useCountDownBar("Defense", 1000, () => {
        const critted = isCrit(battlefieldDataRef.current.player_luck_stack)
        const mult = critted? 1.2: 1

        battlefieldDataRef.current.player_defense_stack += 5 * mult
        if(critted)
            battlefieldDataRef.current.player_luck_stack = 0;
    })
    const [LuckBar, {
        freezeBar: freezeLuck,
        unfreezeBar: unfreezeLuck,
        adjustRate: adjustLuck,
        startCountdown: startPlayerLuck
    }] = useCountDownBar("Luck", 4000, () => {
        battlefieldDataRef.current.player_luck_stack += 1
    })
    
    const [
        _,
        [
            AttackFocusButton,
            DefenseFocusButton,
            LuckFocusButton
        ],
        forceActivation
    ] = useFocusButton([
        "Attack",
        "Defense",
        "Luck",
    ], null,
    (stat) => {
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

    const [ShieldButton, { getIsActive }] = useShieldButton(1000, 2000)

    const[PlayerHealthBar, {
        reduceValue: damagePlayer
    }] = useStatBar(
        "Player Health",
        PlayerStats.max_health,
        PlayerStats.max_health,
        (current_health) => {
            if(current_health < 1) {
                freezePlayer(Infinity)
                freezeEnemy(Infinity)
                if(!battlefieldDataRef.current.has_ended){
                    onBattleEnd("Opponent")
                    battlefieldDataRef.current.has_ended = true
                }

            }
        }
    )


    //* Enemy Stat Bars 
    
    const [EnemyAttackBar, {
        freezeBar:freezeEnemyAttack,
        unfreezeBar: unfreezeEnemyAttack,
        startCountdown: startEnemyAttack
    }] = useCountDownBar("Attack", 4100, () => {
        const damage_calc = EnemyStats.attack_damage - battlefieldDataRef.current.player_defense_stack
        const actual_damage = damage_calc < 0? 0: damage_calc
        damagePlayer(actual_damage)
        battlefieldDataRef.current.player_defense_stack = 0
    })
    const [EnemyFreezeBar, {
        freezeBar:freezeEnemyFreeze,
        unfreezeBar: unfreezeEnemyFreeze,
        startCountdown: startEnemyFreeze
    }] = useCountDownBar("Freeze", 4000, () => {
            if(!getIsActive())
                freezePlayer(500);
        })
    const [EnemyDefenseBar, {
        freezeBar:freezeEnemyDefense,
        unfreezeBar: unfreezeEnemyDefense,
        startCountdown: startEnemyDefense
    }] = useCountDownBar("Defense", 4100, () => () => {
        battlefieldDataRef.current.enemy_defense_stack += 50
    })
    const [EnemyLuckBar, {
        freezeBar:freezeEnemyLuck,
        unfreezeBar: unfreezeEnemyLuck,
        startCountdown: startEnemyLuck
    }] = useCountDownBar("Luck", 4100, () => {
        battlefieldDataRef.current.enemy_luck_stack += 1
    })

    const[EnemyHealthBar, {
        reduceValue: damageEnemy
    }] = useStatBar(
        "Enemy Health",
        PlayerStats.max_health,
        PlayerStats.max_health,
        (current_health) => {
            if(current_health < 1) {
                freezePlayer(Infinity)
                freezeEnemy(Infinity)
                if(!battlefieldDataRef.current.has_ended) {
                    onBattleEnd("Player")
                    battlefieldDataRef.current.has_ended = true
                }
            }
        }
    )

    //* Battlefield Operastions

    const freezePlayer = (duration: number) => {
        freezeAttack(duration)
        freezeDefence(duration)
        freezeLuck(duration)
    }

    const freezeEnemy = (duration: number) => {
        freezeEnemyAttack(duration)
        freezeEnemyFreeze(duration)
        freezeEnemyDefense(duration)
        freezeEnemyLuck(duration)
    }

    const startBattle = () => {
        startPlayerAttack()
        startPlayerDefense()
        startPlayerLuck()
        startEnemyAttack()
        startEnemyFreeze()
        startEnemyDefense()
        startEnemyLuck()
        forceActivation()
    }

    const pauseBattle = () => {
        freezePlayer(Infinity)
        freezeEnemy(Infinity)
    }
    const resumeBattle = () => {
        unfreezeAttack()
        unfreezeDefense()
        unfreezeLuck()
        unfreezeEnemyAttack()
        unfreezeEnemyFreeze()
        unfreezeEnemyDefense()
        unfreezeEnemyLuck()
    }

    // * Battle Field UI
    const PlayerUI = () => {
        return (
            <div>
                <ShieldButton />
                <PlayerHealthBar />
                <AttackBar />
                <AttackFocusButton />
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

    //* Wrap up

    const actions = useMemo(() => ({
        freezePlayer,
        startBattle,
        pauseBattle,
        resumeBattle
    }),[])
    return [memo(EnemyUI), memo(PlayerUI), actions]
}