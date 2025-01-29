import {FC, useState} from 'react'
import { getPlayerStats, upgradePlayerStat } from '../services/stats'
import { useNavigate } from 'react-router-dom'
import { useSoundEffect } from '../hooks/useSoundEffect'

type StrongholdPage = FC<{}>

export const Stronghold: StrongholdPage = () => {
    const PlayerData = getPlayerStats()
    
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")

    let [upgrade_points, setUpgradePoints] = useState(PlayerData("upgrade_points"))
    let [max_health, setMaxHealth] = useState(PlayerData("max_health"))
    let [attack_damage, setAttackDamage] = useState(PlayerData("attack_damage"))
    let [attack_cooldown, setAttackCooldown] = useState(PlayerData("attack_cooldown"))
    let [defense_base, setDefenseBase] = useState(PlayerData("defense_base"))
    let [defense_build, setDefenseBuild] = useState(PlayerData("defense_build"))
    let [defense_cooldown, setDefenseCooldown] = useState(PlayerData("defense_cooldown"))
    let [luck_base, setLuckBase] = useState(PlayerData("luck_base"))
    let [luck_build, setLuckBuild] = useState(PlayerData("luck_build"))
    let [luck_cooldown, setLuckCooldown] = useState(PlayerData("luck_cooldown"))

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
            <>
                <div 
                    className='flex space-between pad-vert-10px ui--stack v-centered'
                >
                    <p className='text-bold ui--centered-text'>{name}: {stat}</p>
                    <button 
                        onMouseEnter={() => {playClickEnter()}}
                        className='ui--button-interact bg-color-none border-round-4px text-bold'
                        onClick={() => {
                            onClick()
                            
                            if (PlayerData("upgrade_points") === 0) return;
                            playClick()
                        }}
                    >
                        Upgrade
                    </button>
                </div>
            </>
        )
    
    return (
        <div className='ui--span-page flex columns v-centered h-centered full-height gap-25px span-width-50 mar-auto'>
            <div className='ui--container full-width'>
                <h1 className='text-centered'>Stronghold</h1>
                <p className='text-centered'>Available Stat Points: {upgrade_points}</p>
            </div>
            <div className='flex space-between full-width ui--gap'>
                <div className='ui--container fill-width'>
                    <h2 className='text-centered'>Offense</h2>
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
                </div>
                <div className='ui--container fill-width'> 
                    <h2 className='text-centered'>Defense</h2>
                    <TempUpgrade 
                        name="Max Health" 
                        stat={max_health}
                        onClick={() => upgradeStat("max_health")}
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
                </div>
                <div className='ui--container fill-width'>
                    <h2 className='text-centered'>Crit</h2>
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
                </div>
                
                
                
                
            </div>
            <div className='ui--container flex full-width h-centered'>
                <button
                    onMouseEnter={() => {playClickEnter()}}
                    className='ui--button-interact pad-15px bg-color-none border-round-4px text-bold' 
                    onClick={() => {
                        playClick()
                        navigate("/explore")
                    }}
                >
                    Go to Navigation
                </button>
            </div>
        </div>
    )
}