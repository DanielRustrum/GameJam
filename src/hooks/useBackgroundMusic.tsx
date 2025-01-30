import useSound from 'use-sound';
import { createContext, FC, ReactNode, useContext, useRef, useState } from 'react';
import music_file from '../assets/sounds/music.mp3'

interface MusicDataObject {
    volume: number,
    set: (set: number) => void
    rate: (set: number) => void
    stop: () => void
    start: () => void
    trigger: () => void
}

type useBackgroundMusicHook = (
) => FC<{children: ReactNode}>

const MusicContext = createContext<MusicDataObject | null>(null)

export const setupBackgroundMusic: useBackgroundMusicHook = (
) => {
    const [music_volume, setMusicVolume] = useState(0.1)
    const [music_rate, setMusicRate] = useState(1)
    const VolRef = useRef({
        is_playing: false,
        volume: music_volume,
        rate: music_rate
    })

    const [play] = useSound(music_file, {
        volume: music_volume,
        loop: true,
        playbackRate: music_rate,
        onplay: () => {
            VolRef.current.is_playing = true
        },
        onend: () => {
            play()
        }
    });

    const triggerMusic = () => {
        if(VolRef.current.is_playing) return;
        play()
    }
    const startMusic = () => {
        setMusic(VolRef.current.volume)
    }
    const stopMusic = () => {
        VolRef.current.volume = 0
        setMusicVolume(0)
    }
    const setMusic = (set: number) => {
        setMusicVolume(set)

        VolRef.current.volume = set
    }

    const setRate = (set: number) => {
        setMusicRate(set)

        VolRef.current.rate = set
    }
    
    return ({children}) => {
        return (
            <MusicContext.Provider value={{
                volume: music_volume,
                set: setMusic,
                stop: stopMusic,
                start: startMusic,
                trigger: triggerMusic,
                rate: setRate
            }}>
                {children}
            </MusicContext.Provider>
        )
    }
}

export const useMusic = () => {
    return useContext(MusicContext) ?? {
        volume: 0,
        set: (_: number) => {},
        rate: (_: number) => {},
        stop: () => {},
        start: () => {},
        trigger: () => {},
    }
}