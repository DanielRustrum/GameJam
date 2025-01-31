import { useNavigate } from 'react-router-dom'
import { useSoundEffect } from '../hooks/useSoundEffect'

export const Tutorial = () => {
    const navigate = useNavigate()
    const playClickEnter = useSoundEffect("enter", true)
    const playClick = useSoundEffect("click")

    return (
        <div className='flex columns margin-auto v-centered pad-25px'>
            <div className='ui--container ui--span-page'>
                <h2>Our Team</h2>
                <p>Rusty - Programmer and UX/UI Designer</p>
                <p>Temruog - Artist</p>
                <p>Sikali and Madison - Musician</p>
                    
                <h2>SFX Accreditation</h2>
                <p>Thank you to the following people for letting us <br /> use their SFX in our game!</p>
                <a href="https://freesound.org/people/GameAudio/">GameAudio</a>
                <a href="https://freesound.org/people/lotteria001/">lotteria001</a>
                <a href="https://freesound.org/people/joseegn/">joseegn</a>
                <a href="https://freesound.org/people/HighPixel/">HighPixel</a>
                <a href="https://freesound.org/people/Isaac200000/">Isaac200000</a>
                <a href="https://freesound.org/people/LittleRobotSoundFactory/">LittleRobotSoundFactory</a>
                <a href="https://freesound.org/people/ilm0player/">ilm0player</a>
                <a href="https://freesound.org/people/JoelAudio/">JoelAudio</a>
                <a href="https://freesound.org/people/Debsound/">Debsound</a>
                <a href="https://freesound.org/people/MadPanCake/">MadPanCake</a>
                <a href="https://freesound.org/people/StormwaveAudio/">StormwaveAudio</a>
                <a href="https://freesound.org/people/Osvoldon/">Osvoldon</a>
                <a href="https://freesound.org/people/MaxDemianAGL/">MaxDemianAGL</a>

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