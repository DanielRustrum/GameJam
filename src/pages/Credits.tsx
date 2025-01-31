import { useNavigate } from 'react-router-dom'
import { useSoundEffect } from '../hooks/useSoundEffect'

export const Credits = () => {
    const navigate = useNavigate()
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")

    return (
        <div className='flex columns margin-auto v-centered pad-25px'>
            <div className='ui--container ui--span-page'>
                <h2 className="text-centered pad-bottom-10px">Our Team</h2>
                <p className="text-centered">Rusty - Programmer and UX/UI Designer</p>
                <p className="text-centered">Temruog - Artist</p>
                <p className="text-centered pad-bottom-10px">Sikali Vidal and Madison Vidal - Musician</p>
                    
                <h2 className="text-centered pad-vert-10px pad-top-25px">SFX Accreditation</h2>
                <p className="text-centered pad-bottom-10px">Thank you to the following people for letting us <br /> use their SFX in our game!</p>
                <div className='flex columns v-centered pad-vert-15px'>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/GameAudio/">GameAudio</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/lotteria001/">lotteria001</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/joseegn/">joseegn</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/HighPixel/">HighPixel</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/Isaac200000/">Isaac200000</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/LittleRobotSoundFactory/">LittleRobotSoundFactory</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/ilm0player/">ilm0player</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/JoelAudio/">JoelAudio</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/Debsound/">Debsound</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/MadPanCake/">MadPanCake</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/StormwaveAudio/">StormwaveAudio</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/Osvoldon/">Osvoldon</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/MaxDemianAGL/">MaxDemianAGL</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/PhreaKsAccount/">PhreaKsAccount</a>
                    <a className="text-no-underline text-bold" href="https://freesound.org/people/Metzik/">Metzik</a>
                </div>

                <div className='pad-top-25px flex centered'>
                    <button
                        style={{padding: "10px 80px"}}
                        className='ui--button-interact-2 bg-color-none border-round-4px text-bold'
                        onMouseEnter={() => {playClickEnter()}}
                        onClick={() => {
                            playClick()
                            navigate("/")  
                        }}
                    >
                        Back to Main Menu
                    </button>
                </div>
            </div>
        </div>
    )
}