import upgrade_tut_img from '../assets/Tutorial/upgrades.png'
import ui_tut_img from '../assets/Tutorial/ui.png'
import { useNavigate } from 'react-router-dom'

export const Tutorial = () => {
    const navigate = useNavigate()

    return (
        <div className='flex columns margin-auto v-centered pad-25px'>
            <div className='ui--container ui--span-page'>
                <h1 className='text-centered'>Learn how to play!</h1>
                <h2 className='text-centered mar-bottom-25px'>Upgrading you ship</h2>
                <img 
                    className="float-left span-width-40 auto-height mar-right-20px mar-top-10px border-round-10px" 
                    src={upgrade_tut_img} 
                />
                <p>
                    The First thing you will encounter is the upgrade system. 
                    There are a couple things to know before using the upgrade system. 
                    The Upgrades are non-linear and have diminishing returns, meaning 
                    that when you upgrade a stat, the next upgrade might not increase 
                    said stat as much as the previous time. Therefore, focusing on increasing 
                    most or all of your stats will yield better results than only focusing on a few.
                    <br/><br/>
                    You may also have noticed the base vs build mechanic. The base stat is the stat that 
                    you will start off with or reset to, whereas the build stat will add upon the base 
                    stat every time the stat cooldown bar is finished. The cooldown stat will help 
                    increase the build interval allowing you to stack the stat much quicker.
                    <br/><br/>
                    The Luck stat will increase the chance of critting your attack or defense (a 1.5 times multiplier). Once you have critted, 
                    it will be reset to the base luck stat and then you start building again.
                    <br/><br/>
                    Another thing to keep in mind is that your defense is reset every time you take damage from a dragon. 
                    So having a high base stat here might be better than having a high defense build.
                </p>
                <h2 className='text-centered mar-bottom-25px'>Fights!</h2>
                <img 
                    className="float-right span-width-40 auto-height mar-left-20px mar-top-10px border-round-10px" 
                    src={ui_tut_img} 
                />
                <p>
                    During fights, there are 2 unique mechanics to keep an eye on, the focus mechanic and the shield mechanic. 
                    The focus mechanic will allow you to speed up the cooldown bar of a selected stat by 1.2. 
                    The enemy, however, can freeze your bar, making your focus all useless. To avoid this, 
                    you need to time your shields to the completion of the enemy freeze. Doing so will block their freeze 
                    entirely. You win the game after 15 rounds of fighting.
                    <br/><br/>
                    <b>Note:</b> I wouild recommend fighting the large dragons as much as possible as they drop 3 times the loot in excange for fighting 3 times more difficult opponent.
                    <br/><br/>
                    Well, that should be everything you will need to know,so <b>Enjoy</b> and <b>Good Luck!</b>
                </p>
                <div className='pad-top-25px flex centered'>
                    <button
                        style={{padding: "10px 80px"}}
                        className='bg-color-none border-round-4px text-bold'
                        onClick={() => {
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