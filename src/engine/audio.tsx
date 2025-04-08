import {Howl} from 'howler';
import { Gt as GreaterThan, Lt as LessThan } from "ts-arithmetic";
import { localStore } from './state';
import { timer } from './update';
import { createImportMap } from './utils';

const effects = createImportMap(import.meta.glob(
    '@assets/sounds/effects/*?url',
    {eager: true}
))

const musics = createImportMap(import.meta.glob(
    '@assets/sounds/music/*?url',
    {eager: true}
))

const ambiences = createImportMap(import.meta.glob(
    '@assets/sounds/ambiences/*?url',
    {eager: true}
))


const transitionVolume = (
    source: Howl, 
    transition_to: number, 
    options?:{
        step?: number
        onEnd?: () => void
    }
) => {
    let current_volume = parseFloat(source.volume().toFixed(2))
    const direction = current_volume > transition_to? -1: 1
    const step = (options?.step ?? 0.10)

    return timer(
        10000, 
        step, 
        (time) => {
            current_volume += direction * step
            console.log(direction, current_volume, step, direction)
            console.log(time)
            // source.volume(current_volume)
        }
    )

}


type soundEffectFunction = (
    effect_name: string, 
    options?: {
        volume: LessThan<number, 1> & GreaterThan<0, number>
    }
) => [
    play: () => void,
    methods: {
        rate: (rate: number) => void,
        volume: (level: number, abrupt?: boolean) => void
    }
]

export const soundEffect: soundEffectFunction = (effect_name, options) => {
    const SoundEffect = new Howl({src: [effects[effect_name]]})
    let sound_id: number | null = null

    return [
        () => { 
            if(sound_id !== null) sound_id = SoundEffect.play(); 
        },
        {
            rate: (rate) => {
                if(sound_id !== null)
                    SoundEffect.rate(rate, sound_id);
            },
            volume: (level, abrupt = false) => {
                if (abrupt){
                    console.log(SoundEffect)

                    if(sound_id !== null) SoundEffect.volume(level, sound_id);
                    else SoundEffect.volume(level);
                }
                else
                    transitionVolume(SoundEffect, level).start();
            }
        }
    ]
}

export const musicControl = () => {

    return {
        swap_music: (song_name: string) => {},
        volume: (level: number) => {},
    }
}

export const InitAudio = () => {
    const audioLevelStore = localStore("audio.volume", Number)
    
    const musicLevelSetting = audioLevelStore.get("music", 0.5)
    const ambienceLevelSetting = audioLevelStore.get("ambience", 0.5)
    const effectLevelSetting = audioLevelStore.get("effect", 0.5)
}


export const globalAudioControl = () => {return {
    volume: {
        music: (level: number, fade = true) => {
            localStore("audio.volume", Number).set("music", level)
        },
        ambience: (level: number, fade = true) => {
            localStore("audio.volume", Number).set("ambience", level)
        },
        effect: (level: number, fade = true) => {
            localStore("audio.volume", Number).set("effect", level)
        }
    },
    mute: (mute_audio = true) => {}
} }