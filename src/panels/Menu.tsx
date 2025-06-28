import { MenuBackground } from "@/components/Game/Background"
import { Button } from "@/components/UI/button"
import { usePanelNavigation } from "@/engine/panel"
import GeneralText from "@assets/text/general.json"

export const Panel = () => {
    const navigate = usePanelNavigation()

    return <MenuBackground className="flex flex-col justify-center items-center h-dvh overflow-hidden gap-20 pb-[10%]">
        <h1 className="text-4xl font-bold">{GeneralText.title}</h1>
        <div className="flex flex-col gap-3 w-[10%]">
            <Button onClick={() => navigate("demo")}>Start</Button>
            <Button onClick={() => navigate("credits")}>About</Button>
            <Button onClick={() => navigate("settings")}>Settings</Button>
        </div>
    </MenuBackground>
}

export const name = "menu"