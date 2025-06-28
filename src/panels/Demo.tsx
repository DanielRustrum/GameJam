import { Button } from "@/components/UI/button"
import { usePanelNavigation } from "@engine/panel"

export const Panel = () =>{ 
    const navigate = usePanelNavigation()

    return <div className="mt-10">
        <h1 className="text-4xl font-bold text-center">Demo Menu</h1>
        <div className="grid grid-cols-4 justify-center pt-20 gap-10 w-[50%] mx-auto">
            <Button onClick={() => navigate("audio")}>Navigate to Audio</Button>
            <Button onClick={() => navigate("worker")}>Navigate to Worker</Button>
            <Button onClick={() => navigate("timing")}>Navigate to Timing</Button>
            <Button onClick={() => navigate("sprite")}>Navigate to Sprite</Button>
        </div>
    </div>
}

export const name = "demo"