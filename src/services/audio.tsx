import { FC } from "react"
import {Howl} from 'howler';

import test_sound from '../assets/sounds/shield-stop.wav'

type AudioControllerComponent = FC<{

}>

export const AudioController: AudioControllerComponent = ({}) => {
    return (<></>)
}

type useSoundEffectHook = (
    audio_file: string, 
    options: {

    }
) => [
    ()=> void, 
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


export const contolBackgroundMusic = () => {}
