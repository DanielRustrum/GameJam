import useSound from "use-sound"
import { useLocalStorageBucket } from "./useLocalStorage"

import button_click_sound from '../assets/sounds/button_click.mp3'
import button_enter_sound from '../assets/sounds/button_enter.mp3'
import cooldown_sound from '../assets/sounds/cooldown_complete.wav'
import dragon_attack_sound from '../assets/sounds/dragon_attack.wav'
import player_attack_sound from '../assets/sounds/player_attack.wav'
import freeze_attack_sound from '../assets/sounds/freeze_attack.wav'
import { useRef } from "react"


const SoundMap:{[key: string]: string} = {
    "click": button_click_sound,
    "enter": button_enter_sound,
    "cooldown": cooldown_sound,
    "dragon_attack": dragon_attack_sound,
    "player_attack": player_attack_sound,
    "freeze_attack": freeze_attack_sound
}

export const setPermission = (response: boolean) => {
    const [_, setSetting] = useLocalStorageBucket("settings")
    setSetting("sound_permission", response)
}

export const setVolume = (volume: number = 1) => {
    const [_, setSetting] = useLocalStorageBucket("settings")
    setSetting("sound_volume", volume)
}

export const useSoundEffect = (sound: string, allow_overlap: boolean = false) => {
    const [getSettings] = useLocalStorageBucket("settings")
    const SoundData = useRef({
        is_playing: false
    })

    const [playSoundEffect] = useSound(SoundMap[sound], {
        volume: getSettings("sound_volume") as number,
        onend: () => {
            SoundData.current.is_playing = false
        }
    })

    return () => {
        if((!SoundData.current.is_playing || allow_overlap) && getSettings("sound_permission")) {
            playSoundEffect()
            SoundData.current.is_playing = true
        }
    }
}