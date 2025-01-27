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
    onBattleEnd?: (victor: "Player" | "Opponent", health: number) => void
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
        player_defense_stack: PlayerStats.defense_base,
        enemy_defense_stack: EnemyStats.defense_base,
        player_luck_stack: PlayerStats.luck_base,
        enemy_luck_stack: EnemyStats.luck_base,
        player_current_health: PlayerStats.current_health,
        has_ended: false
    })

    console.log(battlefieldDataRef.current)

    //* Player Stat Bars
    const [AttackBar, {
        freezeBar: freezeAttack,
        unfreezeBar: unfreezeAttack,
        adjustRate: adjustAttack,
        startCountdown: startPlayerAttack
    }] = useCountDownBar("Attack", PlayerStats.attack_cooldown, () => {
        const damage_calc = PlayerStats.attack_damage - battlefieldDataRef.current.enemy_defense_stack
        const actual_damage = damage_calc < 0? 0: damage_calc

        console.log(actual_damage, battlefieldDataRef.current)

        const critted = isCrit(battlefieldDataRef.current.player_luck_stack)
        const mult = critted? 1.2: 1
        damageEnemy(actual_damage * mult)
        battlefieldDataRef.current.enemy_defense_stack = EnemyStats.defense_base
        
        if(critted)
            battlefieldDataRef.current.player_luck_stack = PlayerStats.luck_base;

    })
    const [DefenseBar, {
        freezeBar: freezeDefence,
        unfreezeBar: unfreezeDefense,
        adjustRate: adjustDefense,
        startCountdown: startPlayerDefense
    }] = useCountDownBar("Defense", PlayerStats.defense_cooldown, () => {
        const critted = isCrit(battlefieldDataRef.current.player_luck_stack)
        const mult = critted? 1.2: 1

        battlefieldDataRef.current.player_defense_stack += PlayerStats.defense_build * mult
        if(critted)
            battlefieldDataRef.current.player_luck_stack = PlayerStats.luck_base;
    })
    const [LuckBar, {
        freezeBar: freezeLuck,
        unfreezeBar: unfreezeLuck,
        adjustRate: adjustLuck,
        startCountdown: startPlayerLuck
    }] = useCountDownBar("Luck", PlayerStats.luck_cooldown, () => {
        battlefieldDataRef.current.player_luck_stack += PlayerStats.luck_build
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
                adjustAttack(1.2)
                adjustDefense(1)
                adjustLuck(1)
                break
            case "Defense":
                adjustAttack(1)
                adjustDefense(1.2)
                adjustLuck(1)
                break
            case "Luck":
                adjustAttack(1)
                adjustDefense(1)
                adjustLuck(1.2)
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
        PlayerStats.current_health,
        PlayerStats.max_health,
        (_) => {
            if(battlefieldDataRef.current.player_current_health < 1) {
                freezePlayer(Infinity)
                freezeEnemy(Infinity)
                if(!battlefieldDataRef.current.has_ended){
                    onBattleEnd("Opponent", 0)
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
    }] = useCountDownBar("Attack", EnemyStats.attack_cooldown, () => {
        const damage_calc = EnemyStats.attack_damage - battlefieldDataRef.current.player_defense_stack
        const critted = isCrit(battlefieldDataRef.current.enemy_luck_stack)
        const actual_damage = damage_calc < 0? 0: damage_calc
        const mult = critted? 1.2: 1

        console.log(
            EnemyStats.attack_damage - battlefieldDataRef.current.player_defense_stack
            ,battlefieldDataRef.current.player_defense_stack
        )

        damagePlayer(actual_damage * mult)
        battlefieldDataRef.current.player_current_health = 
            battlefieldDataRef.current.player_current_health - 
            (actual_damage * mult)
        battlefieldDataRef.current.player_defense_stack = PlayerStats.defense_base


        if(critted)
            battlefieldDataRef.current.enemy_luck_stack = EnemyStats.luck_base;
    })
    const [EnemyFreezeBar, {
        freezeBar:freezeEnemyFreeze,
        unfreezeBar: unfreezeEnemyFreeze,
        startCountdown: startEnemyFreeze
    }] = useCountDownBar("Freeze", EnemyStats.freeze_cooldown, () => {
            if(!getIsActive())
                freezePlayer(EnemyStats.freeze_duration);
        })
    const [EnemyDefenseBar, {
        freezeBar:freezeEnemyDefense,
        unfreezeBar: unfreezeEnemyDefense,
        startCountdown: startEnemyDefense
    }] = useCountDownBar("Defense", EnemyStats.defense_cooldown, () => () => {
        const critted = isCrit(battlefieldDataRef.current.enemy_luck_stack)
        const mult = critted? 1.2: 1

        battlefieldDataRef.current.enemy_defense_stack += EnemyStats.defense_build * mult

        if(critted)
            battlefieldDataRef.current.enemy_luck_stack = EnemyStats.luck_base;
    })
    const [EnemyLuckBar, {
        freezeBar:freezeEnemyLuck,
        unfreezeBar: unfreezeEnemyLuck,
        startCountdown: startEnemyLuck
    }] = useCountDownBar("Luck", EnemyStats.luck_cooldown, () => {
        battlefieldDataRef.current.enemy_luck_stack += EnemyStats.luck_build
    })

    const[EnemyHealthBar, {
        reduceValue: damageEnemy
    }] = useStatBar(
        "Enemy Health",
        PlayerStats.max_health,
        PlayerStats.max_health,
        (current_health) => {
            console.log(current_health)
            if(current_health < 1) {
                freezePlayer(Infinity)
                freezeEnemy(Infinity)
                if(!battlefieldDataRef.current.has_ended) {
                    onBattleEnd("Player", battlefieldDataRef.current.player_current_health)
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