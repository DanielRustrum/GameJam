import { useLocalStorageBucket } from "../hooks/useLocalStorage"
import { getPlayerStats } from "./stats"

export interface EnemyBucketData {
    max_health: number
    attack_damage: number
    attack_cooldown: number
    defense_base: number
    defense_build: number
    defense_cooldown: number
    luck_base: number
    luck_build: number
    luck_cooldown: number
    reward_points: number
    reward_meat: number
}

const useEnemyBucket = () => useLocalStorageBucket<EnemyBucketData>("Enemy")

export const getEnemyStats = () => {
    const [enemy_data] = useEnemyBucket()
    return enemy_data
}

export const generateEnemy = ():((is_large: boolean) => EnemyBucketData) => {
    const PlayerData = getPlayerStats()
    const [_, setEnemyBucket] = useEnemyBucket()

    const [round, phase] = 
        PlayerData === undefined? 
        [1,1]: 
        [PlayerData.round, PlayerData.phase]

    return (is_large = false) => {
        const size_mult = is_large? 3: 1

        const enemy = {
            max_health: (200 * (phase * 2) + (50 * round)) * size_mult, 
            attack_damage: (10 * ((phase-1) * 2) + (5 * round)) * size_mult,
            attack_cooldown: 6000 / phase - (100 * round),
            defense_base: (200 * (phase * 2) + (50 * round)) * size_mult,
            defense_build: 1 * (phase * 2) + (5 * round),
            defense_cooldown: 6000 / phase - (100 * round),
            luck_base: 200 * (phase * 2) + (50 * round),
            luck_build: 1 * (phase * 2) + (5 * round),
            luck_cooldown: 6000 / phase - (100 * round),
            reward_points: (1 * phase  + (1 * round)) * size_mult,
            reward_meat: (1 * phase  + (1 * round)) * size_mult,
        }

        setEnemyBucket(enemy)

        return enemy
    }
}

export const useSetNextEnemy = () => {
    const [enemy_data, setEnemyBucket] = useEnemyBucket()
    if(enemy_data === undefined) return (_:EnemyBucketData) => {};

    return (enemy: EnemyBucketData) => {
        setEnemyBucket(enemy)
    }
}