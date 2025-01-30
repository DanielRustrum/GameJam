import useSound from 'use-sound';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
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
    const [set_value, setMusicMax] = useState(1)
    const [music_rate, setMusicRate] = useState(1)
    const [is_playing, setIsPlaying] = useState(false)

    const [play] = useSound(music_file, {
        volume: music_volume,
        loop: true,
        playbackRate: music_rate,
        onplay: () => {
            setIsPlaying(true)
        }
    });

    const triggerMusic = () => {
        if(is_playing) return;
        play()
    }
    const startMusic = () => {
        setMusic(set_value)
    }
    const stopMusic = () => {
        setMusicVolume(0)
    }
    const setMusic = (set: number) => {
        
        setMusicMax(set)
        setMusicVolume(set)
        
    }

    const setRate = (set: number) => {
        setMusicRate(set)
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