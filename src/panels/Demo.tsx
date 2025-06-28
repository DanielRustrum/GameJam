import { Button } from "@/components/UI/button"
import { usePanelNavigation } from "@engine/panel"

export const Panel = () =>{ 
    const navigate = usePanelNavigation()

    return <>
        <p className="text-4xl font-bold text-center">Sprite/Sprite Sheet Demo</p>
        <Button onClick={() => navigate("audio")}>Navigate to Audio</Button>
        <Button onClick={() => navigate("worker")}>Navigate to Worker</Button>
        <Button onClick={() => navigate("timing")}>Navigate to Timing</Button>
        <Button onClick={() => navigate("sprite")}>Navigate to Sprite</Button>
    </>
}

export const name = "demo"