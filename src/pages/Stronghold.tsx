import {FC, useState} from 'react'
import { getPlayerStats, upgradePlayerStat } from '../services/stats'
import { useNavigate } from 'react-router-dom'

type StrongholdPage = FC<{}>

export const Stronghold: StrongholdPage = () => {
    const PlayerData = getPlayerStats()
    if(PlayerData === undefined) return <></>;
    
    let [upgrade_points, setUpgradePoints] = useState(PlayerData.upgrade_points)
    let [max_health, setMaxHealth] = useState(PlayerData.max_health)
    let [attack_damage, setAttackDamage] = useState(PlayerData.attack_damage)
    let [attack_cooldown, setAttackCooldown] = useState(PlayerData.max_health)
    let [defense_base, setDefenseBase] = useState(PlayerData.defense_base)
    let [defense_build, setDefenseBuild] = useState(PlayerData.defense_build)
    let [defense_cooldown, setDefenseCooldown] = useState(PlayerData.defense_cooldown)
    let [luck_base, setLuckBase] = useState(PlayerData.luck_base)
    let [luck_build, setLuckBuild] = useState(PlayerData.luck_build)
    let [luck_cooldown, setLuckCooldown] = useState(PlayerData.luck_cooldown)

    const StatMap:{[key: string]: (set: number) => void} = {
        "upgrade_points": setUpgradePoints,
        "max_health": setMaxHealth,
        "current_health": () => {},
        "attack_damage": setAttackDamage,
        "attack_cooldown": setAttackCooldown,
        "defense_base": setDefenseBase,
        "defense_build": setDefenseBuild,
        "defense_cooldown": setDefenseCooldown,
        "luck_base": setLuckBase,
        "luck_build": setLuckBuild,
        "luck_cooldown": setLuckCooldown,
    }

    const upgradeStat = upgradePlayerStat((stat, change) => {
        StatMap[stat](change)
    })

    const navigate = useNavigate()
    
    const TempUpgrade: 
        FC<{name: string, stat: number, onClick: () => void}> = 
        ({name, stat, onClick}) => (
            <div>
                <p>{name}: {stat}</p>
                <button onClick={onClick}>Upgrade</button>
            </div>
        )
    
    return (
        <div>
            <p>Stat Points: {upgrade_points}</p>
            <div>
                <p>Health: {max_health}</p>
                <button onClick={() => upgradeStat("max_health")}>Upgrade</button>
            </div>
            <TempUpgrade 
                name="Attack Damage" 
                stat={attack_damage}
                onClick={() => upgradeStat("attack_damage")}
            />
            <TempUpgrade 
                name="Attack Cooldown" 
                stat={attack_cooldown}
                onClick={() => upgradeStat("attack_cooldown")}
            />
            <TempUpgrade 
                name="Defense Base" 
                stat={defense_base}
                onClick={() => upgradeStat("defense_base")}
            />
            <TempUpgrade 
                name="Defense Build" 
                stat={defense_build}
                onClick={() => upgradeStat("defense_build")}
            />
            <TempUpgrade 
                name="Defense Cooldown" 
                stat={defense_cooldown}
                onClick={() => upgradeStat("defense_cooldown")}
            />
            <TempUpgrade 
                name="Luck Base" 
                stat={luck_base}
                onClick={() => upgradeStat("luck_base")}
            />
            <TempUpgrade 
                name="Luck Build" 
                stat={luck_build}
                onClick={() => upgradeStat("luck_build")}
            />
            <TempUpgrade 
                name="Luck Cooldown" 
                stat={luck_cooldown}
                onClick={() => upgradeStat("luck_cooldown")}
            />
            <button onClick={() => {
                navigate("/explore")
            }}>Finshed: Go to Next Round</button>
        </div>
    )
}