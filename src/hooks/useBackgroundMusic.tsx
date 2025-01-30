// import useSound from 'use-sound';
// import { usePageVisibility } from 'react-page-visibility';
// import { createContext, useEffect, useState } from 'react';

// interface MusicDataObject {
//     volume: number,
//     setVolume: (set: number) => void
//     stop: () => void
//     start: () => void
// }

// type useBackgroundMusicHook = (
//     file: string,
//     max_volume?: number,
//     ease?: number
// ) => typeof MusicContext

// const MusicContext = createContext<Partial<MusicDataObject>>({})

// export const useBackgroundMusic: useBackgroundMusicHook = (
//     file, 
//     volume = 1,
//     _ = 1000
// ) => {
//     const [play, { pause, sound }] = useSound(file, {
//         volume: volume,
//         loop: true
//     });
//     const is_visible = usePageVisibility()
//     const [page_activated, setPageActivated] = useState(false)
//     const [music_playing, setMusicPlaying] = useState(true)
    

//     return () => (<M)
// }