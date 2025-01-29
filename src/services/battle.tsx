import { FC, memo, useMemo, useRef } from "react"
import { useCountDownBar } from "../components/Field/CountDownBar"
import { useStatBar } from "../components/Field/StatBar"
import { useShieldButton } from "../components/Field/ShieldButton"
import { useFocusButton } from "../components/Field/FocusButton"
import { getPlayerStats } from "./stats"
import { getEnemyStats } from "./enemy"


type setupBattleFieldFunction = (
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
    return stat >= 100 || chance < stat

}

export const setupBattleField: setupBattleFieldFunction = (
    onBattleEnd=()=>{}
) => {
    const PlayerData = getPlayerStats()
    const EnemyData = getEnemyStats()

    const battlefieldDataRef = useRef({
        player_defense_stack: PlayerData("defense_base"),
        enemy_defense_stack: EnemyData("defense_base"),
        player_luck_stack: PlayerData("luck_base"),
        enemy_luck_stack: EnemyData("luck_base"),
        player_current_health: PlayerData("current_health"),
        has_ended: false
    })

    const endRoundWin = (current_health: number) => {
        if(current_health < 1) {
            freezePlayer(Infinity)
            freezeEnemy(Infinity)
            if(!battlefieldDataRef.current.has_ended) {
                setEnemyHealthBar(0)
                onBattleEnd("Player", battlefieldDataRef.current.player_current_health)
                battlefieldDataRef.current.has_ended = true
            }
        }
    }

    const endGameLose = () => {
        if(battlefieldDataRef.current.player_current_health < 1) {
            freezePlayer(Infinity)
            freezeEnemy(Infinity)
            if(!battlefieldDataRef.current.has_ended){
                onBattleEnd("Opponent", 0)
                battlefieldDataRef.current.has_ended = true
            }
        }
    }

    //* Player Stat Bars
    const [AttackBar, {
        freezeBar: freezeAttack,
        unfreezeBar: unfreezeAttack,
        adjustRate: adjustAttack,
        startCountdown: startPlayerAttack
    }] = useCountDownBar("Attack", PlayerData("attack_cooldown"), () => {
        const damage_calc = PlayerData("attack_damage") - battlefieldDataRef.current.enemy_defense_stack
        const actual_damage = damage_calc < 0? 0: damage_calc


        const critted = isCrit(battlefieldDataRef.current.player_luck_stack)
        const mult = critted? 1.2: 1
        damageEnemy(actual_damage * mult)
        battlefieldDataRef.current.enemy_defense_stack = EnemyData("defense_base")
        
        if(critted)
            battlefieldDataRef.current.player_luck_stack = PlayerData("luck_base");

    })
    const [DefenseBar, {
        freezeBar: freezeDefence,
        unfreezeBar: unfreezeDefense,
        adjustRate: adjustDefense,
        startCountdown: startPlayerDefense
    }] = useCountDownBar("Defense", PlayerData("defense_cooldown"), () => {
        const critted = isCrit(battlefieldDataRef.current.player_luck_stack)
        const mult = critted? 1.2: 1

        battlefieldDataRef.current.player_defense_stack += PlayerData("defense_build") * mult
        if(critted)
            battlefieldDataRef.current.player_luck_stack = PlayerData("luck_base");
    })
    const [LuckBar, {
        freezeBar: freezeLuck,
        unfreezeBar: unfreezeLuck,
        adjustRate: adjustLuck,
        startCountdown: startPlayerLuck
    }] = useCountDownBar("Luck", PlayerData("luck_cooldown"), () => {
        battlefieldDataRef.current.player_luck_stack += PlayerData("luck_build")
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
                adjustDefense(1.5)
                adjustLuck(1)
                break
            case "Luck":
                adjustAttack(1)
                adjustDefense(1)
                adjustLuck(1.8)
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
        PlayerData("current_health"),
        PlayerData("max_health"),
        (_) => {
            endGameLose()
        }
    )


    //* Enemy Stat Bars 
    
    const [EnemyAttackBar, {
        freezeBar:freezeEnemyAttack,
        unfreezeBar: unfreezeEnemyAttack,
        startCountdown: startEnemyAttack
    }] = useCountDownBar("Attack", EnemyData("attack_cooldown"), () => {
        const damage_calc = EnemyData("attack_damage") - battlefieldDataRef.current.player_defense_stack
        const critted = isCrit(battlefieldDataRef.current.enemy_luck_stack)
        const actual_damage = damage_calc < 0? 0: damage_calc
        const mult = critted? 1.2: 1

        

        damagePlayer(actual_damage * mult)
        battlefieldDataRef.current.player_current_health = 
            battlefieldDataRef.current.player_current_health - 
            (actual_damage * mult)
        battlefieldDataRef.current.player_defense_stack = PlayerData("defense_base")


        if(critted)
            battlefieldDataRef.current.enemy_luck_stack = EnemyData("luck_base");
    })
    const [EnemyFreezeBar, {
        freezeBar:freezeEnemyFreeze,
        unfreezeBar: unfreezeEnemyFreeze,
        startCountdown: startEnemyFreeze
    }] = useCountDownBar("Freeze", EnemyData("freeze_cooldown"), () => {
            if(!getIsActive())
                freezePlayer(EnemyData("freeze_duration"));
        })
    const [EnemyDefenseBar, {
        freezeBar:freezeEnemyDefense,
        unfreezeBar: unfreezeEnemyDefense,
        startCountdown: startEnemyDefense
    }] = useCountDownBar("Defense", EnemyData("defense_cooldown"), () => () => {
        const critted = isCrit(battlefieldDataRef.current.enemy_luck_stack)
        const mult = critted? 1.2: 1

        battlefieldDataRef.current.enemy_defense_stack += EnemyData("defense_build") * mult

        if(critted)
            battlefieldDataRef.current.enemy_luck_stack = EnemyData("luck_base");
    })
    const [EnemyLuckBar, {
        freezeBar:freezeEnemyLuck,
        unfreezeBar: unfreezeEnemyLuck,
        startCountdown: startEnemyLuck
    }] = useCountDownBar("Luck", EnemyData("luck_cooldown"), () => {
        battlefieldDataRef.current.enemy_luck_stack += EnemyData("luck_build")
    })

    const[EnemyHealthBar, {
        reduceValue: damageEnemy,
        setBar: setEnemyHealthBar
    }] = useStatBar(
        "Enemy Health",
        PlayerData("max_health"),
        PlayerData("max_health"),
        (current_health) => {
            console.log(current_health)
            endRoundWin(current_health)
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
            <div className="flex ui--mobile-full-width ui--stack ui--gap">
                <div className="ui--container fill-width flex columns gap-10px">
                    <PlayerHealthBar />
                    <div className="flex gap-15px ui--mobile-full-width span-width-30 ui--stack">
                        <AttackBar />
                        <AttackFocusButton />
                    </div>
                    <div className="flex gap-15px space-between ui--stack">
                        <DefenseBar />
                        <DefenseFocusButton />
                    </div>
                    <div className="flex gap-15px ui--stack">
                        <LuckBar />
                        <LuckFocusButton />
                    </div>
                </div>
                <ShieldButton />
            </div>
        )
    }

    const EnemyUI = () => {
        return (
            <div className="ui--container ui--mobile-full-width flex columns gap-10px span-width-30">
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