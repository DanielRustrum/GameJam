import useSound from 'use-sound';
import { usePageVisibility } from 'react-page-visibility';
import { useEffect, useState } from 'react';

type useBackgroundMusicHook = (
    file: string,
    max_volume?: number,
    ease?: number
) => [() => void, () => void]

export const useBackgroundMusic:useBackgroundMusicHook = (
    file, 
    volume = 1,
    _ = 1000
) => {
    const [play, { pause, sound }] = useSound(file, {
        volume: volume,
        loop: true
    });
    const page_is_visible = usePageVisibility()
    const [page_activated, setPageActivated] = useState(false)
    const [music_playing, setMusicPlaying] = useState(true)

    const playMusic = () => {
        if(sound !== null) {
            play()
            setMusicPlaying(true)
        }
    }

    const pauseMusic = () => {
        if(sound !== null) {
            pause()
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