import { Component } from "@/engine/types/component";

export const MenuBackground:Component = ({children, className}) => {
    return <div className={className}>{children}</div>
}