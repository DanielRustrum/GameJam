import { useLocalStorageBucket } from "../hooks/useLocalStorage"

export interface PlayerBucketData {
    max_health: number
    max_health_step: number
    current_health: number
    attack_damage_step: number
    attack_damage: number
    attack_cooldown: number
    attack_cooldown_step: number
    defense_base: number
    defense_base_step: number
    defense_build: number
    defense_build_step: number
    defense_cooldown: number
    defense_cooldown_step: number
    luck_base: number
    luck_base_step: number
    luck_build: number
    luck_build_step: number
    luck_cooldown: number
    luck_cooldown_step: number
    meat_count: number
    upgrade_points: number
    phase: number
    round: number
}

export const usePlayerBucket = () => useLocalStorageBucket<PlayerBucketData>("Player")
const upgradeAlgo = (upgrade_step: number) => {
    const Denominator = Math.pow(Math.pow(10, upgrade_step - 6) / .6, .2)
    return Math.floor(1 + (4.5 / (1 + Denominator)))
}


export const useInitPlayerStats = () => {
    const [_, setPlayerData] = usePlayerBucket()
    return () => setPlayerData({
        max_health: 200,
        max_health_step: 0,
        current_health: 200,
        attack_damage: 20,
        attack_damage_step: 0,
        attack_cooldown: 10000,
        attack_cooldown_step: 0,
        defense_base: 5,
        defense_base_step: 0,
        defense_build: 5,
        defense_build_step: 0,
        defense_cooldown: 10000,
        defense_cooldown_step: 0,
        luck_base: 0,
        luck_base_step: 0,
        luck_build: 1,
        luck_build_step: 0,
        luck_cooldown: 10000,
        luck_cooldown_step: 0,
        meat_count: 0,
        upgrade_points: 5,
        phase: 1,
        round: 1
    })
}

export const getPlayerStats = () => {
    return usePlayerBucket()[0]
}

export const upgradePlayerStat = (onUpdate?: (
    stat: string,
    value: number
) => void) => {
    const [player_data, setPlayerData] = usePlayerBucket()
    if (player_data === undefined) return (_: string) => { };

    return (stat: string) => {
        if (player_data.upgrade_points === 0) return;

        const setStat = (stat: string, value: number) => setPlayerData((set: PlayerBucketData) => {
            return { ...set, [stat]: value }
        })

        let stat_change;

        switch (stat) {
            case "max_health":
                stat_change = 50 * upgradeAlgo(player_data.max_health_step)
                setStat("max_health", player_data.max_health + stat_change)
                setStat("current_health", player_data.current_health + stat_change)
                setStat("max_health_step", player_data.max_health_step + 1)
                if (onUpdate) {
                    onUpdate("max_health", player_data.max_health + stat_change);
                    onUpdate("current_health", player_data.current_health + stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "attack_damage":
                stat_change = 5 * upgradeAlgo(player_data.attack_damage_step)
                setStat("attack_damage", player_data.attack_damage + stat_change)
                setStat("attack_damage_step", player_data.attack_damage_step + 1)
                if (onUpdate) {
                    onUpdate("attack_damage", player_data.attack_damage + stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "attack_cooldown":
                stat_change = 150 * upgradeAlgo(player_data.attack_cooldown_step)
                if (stat_change < 150) return;
                setStat("attack_cooldown", player_data.attack_cooldown - stat_change)
                setStat("attack_cooldown_step", player_data.attack_cooldown_step + 1)
                if (onUpdate) {
                    onUpdate("attack_cooldown", player_data.attack_cooldown - stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "defense_base":
                stat_change = 5 * upgradeAlgo(player_data.defense_base_step)

                setStat("defense_base", player_data.defense_base + stat_change)
                setStat("defense_base_step", player_data.defense_base_step + 1)
                if (onUpdate) {
                    onUpdate("defense_base", player_data.defense_base + stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "defense_build":
                stat_change = 1 * upgradeAlgo(player_data.defense_build_step)
                setStat("defense_build", player_data.defense_build + stat_change)
                setStat("defense_build_step", player_data.defense_build_step + 1)
                if (onUpdate) {
                    onUpdate("defense_build", player_data.defense_build + stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "defense_cooldown":
                stat_change = 150 * upgradeAlgo(player_data.defense_cooldown_step)
                if (stat_change < 150) return;
                setStat("defense_cooldown", player_data.defense_cooldown - stat_change)
                setStat("defense_cooldown_step", player_data.defense_cooldown_step + 1)
                if (onUpdate) {
                    onUpdate("defense_cooldown", player_data.defense_cooldown - stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "luck_base":
                stat_change = 5 * upgradeAlgo(player_data.luck_base_step)
                setStat("luck_base", player_data.luck_base + stat_change)
                setStat("luck_base_step", player_data.luck_base_step + 1)
                if (onUpdate) {
                    onUpdate("luck_base", player_data.luck_base + stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "luck_build":
                stat_change = 1 * upgradeAlgo(player_data.luck_build_step)
                setStat("luck_build", player_data.luck_build + stat_change)
                setStat("luck_build_step", player_data.luck_build_step + 1)
                if (onUpdate) {
                    onUpdate("luck_build", player_data.luck_build + stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
            case "luck_cooldown":
                stat_change = 150 * upgradeAlgo(player_data.luck_cooldown_step)
                if (stat_change < 150) return;
                setStat("luck_cooldown", player_data.luck_cooldown - stat_change)
                setStat("luck_cooldown_step", player_data.luck_cooldown_step + 1)
                if (onUpdate) {
                    onUpdate("luck_cooldown", player_data.luck_cooldown - stat_change);
                    onUpdate("upgrade_points", player_data.upgrade_points - 1);
                }
                break
        }

        setStat("upgrade_points", player_data.upgrade_points - 1)

    }

}

export const useHealPlayer = () => {
    const [player_data, setPlayerData] = usePlayerBucket()
    if (player_data === undefined) return (_: number) => { };

    const setStat = (stat: string, value: number) => setPlayerData((set: PlayerBucketData) => {
        return { ...set, [stat]: value }
    })

    return (amount: number) => {
        const new_current = amount + player_data.current_health

        if (new_current >= player_data.current_health) {
            setStat("current_health", player_data.max_health)
        } else {
            setStat("current_health", new_current)

        }
    }
}


export const usePlayerRounds = () => {
    const [player_data, setPlayerData] = usePlayerBucket()
    if (player_data === undefined) return (_: number, __: number) => { }

    const max_rounds = 5
    const max_phase = 3

    const setStat = (stat: string, value: number) => setPlayerData((set: PlayerBucketData) => {
        return { ...set, [stat]: value }
    })

    return (meat: number, points: number) => {
        const current_phase =
           player_data.phase < max_phase && player_data.round === max_rounds ?
                player_data.phase + 1 :
                player_data.phase
        const current_round =
            player_data.round < max_rounds ?
                player_data.round + 1 :
                0
        setStat("phase", current_phase)
        setStat("round", current_round)
        setStat("meat_count", player_data.meat_count + meat)
        setStat("upgrade_points", player_data.upgrade_points + points)
    }
}