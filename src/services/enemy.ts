import { useLocalStorageBucket } from "../hooks/useLocalStorage"
import { getPlayerStats } from "./stats"

export interface EnemyBucketData {
    max_health: number
    attack_damage: number
    attack_cooldown: number
    freeze_duration: number
    freeze_cooldown: number
    defense_base: number
    defense_build: number
    defense_cooldown: number
    luck_base: number
    luck_build: number
    luck_cooldown: number
    reward_points: number
    reward_meat: number
}

const useEnemyBucket = () => useLocalStorageBucket<number>("Enemy", Number)

export const getEnemyStats = () => {
    const [enemy_data] = useEnemyBucket()
    return enemy_data
}

export const generateEnemy = ():((is_large: boolean) => void) => {
    const PlayerData = getPlayerStats()
    const [_, setEnemyBucket] = useEnemyBucket()

    const [round, phase] = [PlayerData("round"), PlayerData("phase")]

    return (is_large = false) => {
        const size_mult = is_large? 3: 1

        setEnemyBucket("max_health", (200 * (phase * 2) + (50 * round)) * size_mult) 
        setEnemyBucket("attack_damage", (10 * ((phase-1) * 2) + (5 * round)) * size_mult)
        setEnemyBucket("attack_cooldown", 6000 / phase - (100 * round))
        setEnemyBucket("freeze_duration", (200 * phase  + (50 * round)) * size_mult)
        setEnemyBucket("freeze_cooldown", 10000 / phase - (100 * round))
        setEnemyBucket("defense_base", (3 * (phase-1 * 2) + (5 * round-1)) * size_mult)
        setEnemyBucket("defense_build", 1 * (phase * 2) + (5 * round))
        setEnemyBucket("defense_cooldown", 6000 / phase - (100 * round))
        setEnemyBucket("luck_base", 1 * (phase * 2) + (5 * round))
        setEnemyBucket("luck_build", 1 * (phase * 2) + (5 * round))
        setEnemyBucket("luck_cooldown", 6000 / phase - (100 * round))
        setEnemyBucket("reward_points", (1 * phase  + (1 * round)) * size_mult)
        setEnemyBucket("reward_meat", (1 * phase  + (1 * round)) * size_mult)

    }
}