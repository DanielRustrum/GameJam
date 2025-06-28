import { useEffect } from "react"
import GeneralText from "@assets/text/general.json"
import GeneralData from "@data/general.json"
import { usePanelNavigation } from "@/engine/panel"
import { MenuBackground } from "@/components/Game/Background"

export const Panel = () => {
    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox")
    const navigate = usePanelNavigation()

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate("menu")
        }, GeneralData.intro_timeout_length)

        return () => clearTimeout(timeout)
    }, [])

    return <MenuBackground>
        <p>Logo Goes Here</p>
        {isFirefox ?
                <p>{ GeneralText.error_messages.using_firefox }</p> :
                <></>
        }
    </MenuBackground>
}

export const name = "intro"