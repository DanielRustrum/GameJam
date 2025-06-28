import { Button } from "@/components/UI/button"
import { Component } from "@/engine/types/component"
import { usePanelNavigation } from "@engine/panel"

export const BackToDemoMenu: Component = () => {
    const navigate = usePanelNavigation()
    return <Button onClick={() => navigate("demo")}> Back to Demo Select </Button>
}