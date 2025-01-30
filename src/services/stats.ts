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

export const usePlayerBucket = () => useLocalStorageBucket<number>(
    "Player", Number
)
const upgradeAlgo = (upgrade_step: number) => {
    const Denominator = Math.pow(Math.pow(10, upgrade_step - 6) / .6, .2)
    return Math.floor(1 + (4.5 / (1 + Denominator)))
}


export const useInitPlayerStats = () => {
    const [_, setPlayerData] = usePlayerBucket()
    return () => {
        setPlayerData("max_health", 200)
        setPlayerData("max_health_step", 0)
        setPlayerData("current_health", 200)
        setPlayerData("attack_damage", 50)
        setPlayerData("attack_damage_step", 0)
        setPlayerData("attack_cooldown", 10000)
        setPlayerData("attack_cooldown_step", 0)
        setPlayerData("defense_base", 0)
        setPlayerData("defense_base_step", 0)
        setPlayerData("defense_build", 1)
        setPlayerData("defense_base_step", 0)
        setPlayerData("defense_cooldown", 10000)
        setPlayerData("defense_cooldown_step", 0)
        setPlayerData("luck_base", 0)
        setPlayerData("luck_base_step", 0)
        setPlayerData("luck_build", 1)
        setPlayerData("luck_build_step", 0)
        setPlayerData("luck_cooldown", 10000)
        setPlayerData("luck_cooldown_step", 0)
        setPlayerData("meat_count", 0)
        setPlayerData("upgrade_points", 5)
        setPlayerData("phase", 1)
        setPlayerData("round", 1)
    }
}

export const getPlayerStats = () => {
    return usePlayerBucket()[0]
}

export const upgradePlayerStat = (onUpdate?: (
    stat: string,
    value: number
) => void) => {
    const [player_data, setPlayerData] = usePlayerBucket()

    return (stat: string) => {
        if (player_data("upgrade_points") === 0) return;

        let stat_change;

        switch (stat) {
            case "max_health":
                stat_change = 50 * upgradeAlgo(player_data("max_health_step"))
                setPlayerData("max_health", player_data("max_health") + stat_change)
                setPlayerData("current_health", player_data("current_health") + stat_change)
                setPlayerData("max_health_step", player_data("max_health_step") + 1)
                if (onUpdate) {
                    onUpdate("max_health", player_data("max_health") );
                    onUpdate("current_health", player_data("current_health") );
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "attack_damage":
                stat_change = 2 * upgradeAlgo(player_data("attack_damage_step"))
                setPlayerData("attack_damage", player_data("attack_damage") + stat_change)
                setPlayerData("attack_damage_step", player_data("attack_damage_step") + 1)
                if (onUpdate) {
                    onUpdate("attack_damage", player_data("attack_damage") );
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "attack_cooldown":
                stat_change = 150 * upgradeAlgo(player_data("attack_cooldown_step"))
                if (stat_change < 150 || player_data("attack_cooldown") < 1000) return;
                setPlayerData("attack_cooldown", player_data("attack_cooldown") - stat_change)
                setPlayerData("attack_cooldown_step", player_data("attack_cooldown_step") + 1)
                if (onUpdate) {
                    onUpdate("attack_cooldown", player_data("attack_cooldown"));
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "defense_base":
                stat_change = 3 * upgradeAlgo(player_data("defense_base_step"))

                setPlayerData("defense_base", player_data("defense_base") + stat_change)
                setPlayerData("defense_base_step", player_data("defense_base_step") + 1)
                if (onUpdate) {
                    onUpdate("defense_base", player_data("defense_base") );
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "defense_build":
                stat_change = 2 * upgradeAlgo(player_data("defense_build_step"))
                setPlayerData("defense_build", player_data("defense_build") + stat_change)
                setPlayerData("defense_build_step", player_data("defense_build_step") + 1)
                if (onUpdate) {
                    onUpdate("defense_build", player_data("defense_build") );
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "defense_cooldown":
                stat_change = 150 * upgradeAlgo(player_data("defense_cooldown_step"))
                if (stat_change < 150 || player_data("attack_cooldown") < 1000) return;
                setPlayerData("defense_cooldown", player_data("defense_cooldown") - stat_change)
                setPlayerData("defense_cooldown_step", player_data("defense_cooldown_step") + 1)
                if (onUpdate) {
                    onUpdate("defense_cooldown", player_data("defense_cooldown"));
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "luck_base":
                stat_change = 2 * upgradeAlgo(player_data("luck_base_step"))
                if(player_data("luck_base") > 50) return;
                setPlayerData("luck_base", player_data("luck_base") + stat_change)
                setPlayerData("luck_base_step", player_data("luck_base_step") + 1)
                if (onUpdate) {
                    onUpdate("luck_base", player_data("luck_base") );
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "luck_build":
                stat_change = 1 * upgradeAlgo(player_data("luck_build_step"))
                setPlayerData("luck_build", player_data("luck_build") + stat_change)
                setPlayerData("luck_build_step", player_data("luck_build_step") + 1)
                if (onUpdate) {
                    onUpdate("luck_build", player_data("luck_build"));
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
            case "luck_cooldown":
                stat_change = 150 * upgradeAlgo(player_data("luck_cooldown_step"))
                if (stat_change < 150 || player_data("attack_cooldown") < 1000) return;
                setPlayerData("luck_cooldown", player_data("luck_cooldown") - stat_change)
                setPlayerData("luck_cooldown_step", player_data("luck_cooldown_step") + 1)
                if (onUpdate) {
                    onUpdate("luck_cooldown", player_data("luck_cooldown"));
                    onUpdate("upgrade_points", player_data("upgrade_points") - 1);
                }
                break
        }

        setPlayerData("upgrade_points", player_data("upgrade_points") - 1)

    }

}

export const useHealPlayer = () => {
    const [player_data, setPlayerData] = usePlayerBucket()

    return (amount: number) => {
        const new_current = amount + player_data("current_health")

        if (new_current >= player_data("current_health")) {
            setPlayerData("current_health", player_data("max_health"))
        } else {
            setPlayerData("current_health", new_current)

        }
    }
}


export const usePlayerRounds = () => {
    const [player_data, setPlayerData] = usePlayerBucket()

    const max_rounds = 5

    return (meat: number, points: number, current_health: number) => {
        const current_phase =
            player_data("round") === max_rounds ?
                player_data("phase") + 1 :
                player_data("phase")
        const current_round =
            player_data("round") < max_rounds ?
                player_data("round") + 1 :
                1

        setPlayerData("phase", current_phase)
        setPlayerData("round", current_round)
        setPlayerData("current_health", current_health)
        setPlayerData("meat_count", player_data("meat_count") + meat)
        setPlayerData("upgrade_points", player_data("upgrade_points") + points)
    }
}