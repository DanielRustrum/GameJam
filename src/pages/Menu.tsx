import {FC, useEffect, useRef} from 'react'

import { useNavigate } from 'react-router-dom'
import { useInitPlayerStats } from '../services/stats'
import { setPermission, setVolume, useSoundEffect } from '../hooks/useSoundEffect'
import { useMusic } from '../hooks/useBackgroundMusic'
import "./Menu.scss"

import decal1 from '../assets/sprites/Title_Decal_Dragon_01.png'
import decal2 from '../assets/sprites/Title_Decal_Ship_01.png'

type MenuPage = FC<{}>

export const Menu: MenuPage = () => {
    const navigate = useNavigate()
    const initPlayer = useInitPlayerStats()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")
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
            <div 
                id="page--menu"
                className='mar-auto flex columns v-centered h-centered full-height pad-bottom-100px gap-50px'
            >
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
                    <button
                        onMouseEnter={() => {playClickEnter()}}
                        style={{padding: "10px 80px"}}
                        className='ui--button-interact-2 ui--container text-bold'
                        onClick={() => {
                            playClick()
                            navigate("/credits")  
                        }}
                    >
                        Credits
                    </button>
                </div>
            </div>
            <img className="decal dragon" src={decal1} />
            <img className="decal ship" src={decal2} />
        </>
    )
}