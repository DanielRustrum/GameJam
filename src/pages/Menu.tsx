import {FC, useEffect, useRef, useState} from 'react'

import { useNavigate } from 'react-router-dom'
import { useInitPlayerStats } from '../services/stats'
import { setPermission, setVolume, useSoundEffect } from '../hooks/useSoundEffect'
import { useLocalStorageBucket } from '../hooks/useLocalStorage'
import { useMusic } from '../hooks/useBackgroundMusic'

type MenuPage = FC<{}>

export const Menu: MenuPage = () => {
    const navigate = useNavigate()
    const initPlayer = useInitPlayerStats()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")
    const [getSetting] = useLocalStorageBucket("settings")
    const [sound_state, setSoundState] = useState(getSetting("sound_permission"))
    const {trigger, start, set, rate} = useMusic()

    useEffect(() => {
        // if(checkSetting("sound_permission")) {
        dialogRef.current?.showModal();
        // } else {
            
        // }
    }, [])
    
    return (
        <>
            <dialog ref={dialogRef} className='mar-auto'>
                <div className='ui--container flex columns space-between v-centered ui--pad
                        span-width-50 mar-auto span-height-30'>
                    <h2>Do you want to play with sound?</h2>

                    <div className='flex columns full-width'>
                        <button
                            className='ui--button-interact-2 mar-top-20px full-width pad-15px bg-color-none border-round-4px text-bold'
                            onClick={() => {
                                setVolume(1)
                                start()
                                setPermission(true)
                                playClick()
                                trigger()
                                set(0.1)
                                rate(0.8)
                                dialogRef.current?.close()
                            }}
                        >Yes!</button>
                        <button
                            className='ui--button-interact-2 mar-top-20px full-width pad-15px bg-color-none border-round-4px text-bold'
                            onClick={() => {
                                setVolume(1)
                                setPermission(false)
                                dialogRef.current?.close()
                            }}
                        >No</button>
                    </div>
                </div>
            </dialog>
            <div className='mar-auto flex columns v-centered h-centered full-height pad-bottom-100px gap-50px'>
                <h1>Dragon Fish</h1>
                <div className='flex columns gap-10px'>
                    <button
                        onMouseEnter={() => {playClickEnter()}}
                        style={{padding: "10px 80px"}}
                        className='ui--button-interact-2 ui--container text-bold'
                        onClick={() => {
                            initPlayer()
                            playClick()
                            navigate("/upgrade")  
                        }}
                    >
                        Start
                    </button>
                    <button
                        onMouseEnter={() => {playClickEnter()}}
                        style={{padding: "10px 80px"}}
                        className='ui--button-interact-2 ui--container text-bold'
                        onClick={() => {
                            playClick()
                            navigate("/tutorial")  
                        }}
                    >
                        See Tutorial
                    </button>
                </div>
            </div>
        </>
    )
}