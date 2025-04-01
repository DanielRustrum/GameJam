import { FC, useEffect } from "react"
import {Howl} from 'howler';
import { Gt as GreaterThan, Lt as LessThan } from "ts-arithmetic";

import test_sound from '../assets/sounds/shield-stop.wav'

type AudioControllerComponent = FC<{

}>

export const AudioController: AudioControllerComponent = ({}) => {
    useEffect(() => {}, [])
    return (<></>)
}

type useSoundEffectHook = (
    audio_file: string, 
    options: {
        volume: LessThan<number, 1> & GreaterThan<0, number>,
    }
) => [
    () => void,
    {

    }
]

export const useSoundEffect: useSoundEffectHook = (audio_file, options) => {
    const SoundEffect = new Howl({src: [test_sound]})
    
    return [
        SoundEffect.play,
        {

        }
    ]
}


export const globalAudioControl = {
    volume: {
        music: (level, fade = true) => {},
        effect: (level, fade = true) => {}
    },
    set: (allow_sound = true) => {}
}