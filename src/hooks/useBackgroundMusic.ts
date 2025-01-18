import useSound from 'use-sound';
import { usePageVisibility } from 'react-page-visibility';
import { useEffect, useState } from 'react';

type useBackgroundMusicHook = (
    file: string,
    max_volume?: number,
    rate?: number
) => [() => void, () => void]

export const useBackgroundMusic:useBackgroundMusicHook = (
    file, 
    volume = 1
) => {
    const [_, { pause, sound }] = useSound(file, {
        volume: volume,
        loop: true
    });
    const page_is_visible = usePageVisibility()
    const [page_activated, setPageActivated] = useState(false)
    const [music_playing, setMusicPlaying] = useState(true)
    let id: unknown = null 

    const playMusic = () => {
        if(sound !== null) {
            id = sound.play()
            sound.fade(0, 1, 3000, id)
            setMusicPlaying(true)
        }
    }

    const pauseMusic = () => {
        if(sound !== null || id !== null) {
            sound.once('fade', () => sound.pause(id), id)
            sound.fade(1, 0, 3000, id)
            console.log("play")
            setMusicPlaying(false)
        }
    }

    useEffect(() => {
        if(page_is_visible && page_activated) {
            playMusic()
        } else {
            pauseMusic()
        }
    }, [page_is_visible]);

    return [
        () => {
            if(!page_activated) {
                playMusic()
                setPageActivated(true)
            }
        },
        () => (
            page_activated && !music_playing? 
                playMusic(): 
                pauseMusic()
        )
    ]
}