export type InputString = string

const BUTTON_MAP: Record<string, number> = {
    A: 0, B: 1, X: 2, Y: 3,
    LB: 4, RB: 5, LT: 6, RT: 7,
    Select: 8, Start: 9, LS: 10, RS: 11,
    DUp: 12, DDown: 13, DLeft: 14, DRight: 15,
}

type InputMode = "pressed" | "release" | number

interface OnInputOptions {
    mode?: InputMode
    deadzone?: number
}

type AnalogInputState = {
    axes: {
        "Controller:LT"?: number
        "Controller:RT"?: number
        "Controller:LS"?: [number, number]
        "Controller:RS"?: [number, number]
    }
}

type AnalogCallback = (inputState: AnalogInputState) => void

export function onInput(
    inputs: InputString[],
    callback: AnalogCallback,
    options: OnInputOptions = {}
) {
    const { mode = "pressed", deadzone = 0.1 } = options

    const keyCombos: string[][] = []
    const buttonCombos: number[][] = []

    for (const raw of inputs) {
        const parts = raw.split(" + ").map(p => p.trim())
        const deviceType = parts[0]?.split(":")[0]

        if (!parts.every(p => p.startsWith(deviceType))) continue;

        if (deviceType === "Keyboard") {
            keyCombos.push(parts.map(p => p.slice("Keyboard:".length).toLowerCase()))
        } else if (deviceType === "Controller") {
            const buttons = parts.map(p => {
                const label = p.slice("Controller:".length)
                const index = isNaN(Number(label)) ? BUTTON_MAP[label] : parseInt(label, 10)
                if (isNaN(index)) throw new Error(`Invalid controller input: ${p}`);
                return index
            })
            buttonCombos.push(buttons)
        }
    }

    const heldKeys = new Set<string>()
    const heldButtons = new Set<number>()
    const triggeredCombos = new Set<string>()
    const activeTimers = new Map<string, ReturnType<typeof setInterval>>()

    function applyDeadzone(value: number): number {
        return Math.abs(value) < deadzone ? 0 : value
    }

    function getAxisState(gp: Gamepad | null): AnalogInputState {
        const axes = gp?.axes ?? []
        return {
            axes: {
                "Controller:LT": applyDeadzone(gp?.buttons[6]?.value ?? axes[2] ?? 0),
                "Controller:RT": applyDeadzone(gp?.buttons[7]?.value ?? axes[5] ?? 0),
                "Controller:LS": [applyDeadzone(axes[0] ?? 0), applyDeadzone(axes[1] ?? 0)],
                "Controller:RS": [applyDeadzone(axes[2] ?? 0), applyDeadzone(axes[3] ?? 0)],
            },
        }
    }

    function triggerOnce(comboId: string, gp: Gamepad | null) {
        if (!triggeredCombos.has(comboId)) {
            triggeredCombos.add(comboId)
            callback(getAxisState(gp))
        }
    }

    function clearTrigger(comboId: string) {
        triggeredCombos.delete(comboId)
        if (activeTimers.has(comboId)) {
            clearInterval(activeTimers.get(comboId)!)
            activeTimers.delete(comboId)
        }
    }

    const checkKeyCombos = (gp: Gamepad | null) => {
        for (const combo of keyCombos) {
            const id = `keyboard:${combo.join("+")}`
            const isPressed = combo.every(k => heldKeys.has(k))

            if (isPressed) {
                if (mode === "pressed") {
                    triggerOnce(id, gp)
                } else if (typeof mode === "number") {
                    if (!activeTimers.has(id)) {
                        callback(getAxisState(gp))
                        const intervalId = setInterval(() => callback(getAxisState(gp)), mode)
                        activeTimers.set(id, intervalId)
                    }
                }
            } else {
                if (mode === "release" && triggeredCombos.has(id)) {
                    callback(getAxisState(gp))
                }
                clearTrigger(id)
            }
        }
    }

    const pollGamepad = () => {
        const gp = navigator.getGamepads()[0]
        if (gp) {
            heldButtons.clear()
            gp.buttons.forEach((btn, i) => {
                if (btn.pressed) heldButtons.add(i)
            })

            for (const combo of buttonCombos) {
                const id = `controller:${combo.join("+")}`
                const isPressed = combo.every(i => heldButtons.has(i))

                if (isPressed) {
                    if (mode === "pressed") {
                        triggerOnce(id, gp)
                    } else if (typeof mode === "number") {
                        if (!activeTimers.has(id)) {
                            callback(getAxisState(gp))
                            const intervalId = setInterval(() => callback(getAxisState(gp)), mode)
                            activeTimers.set(id, intervalId)
                        }
                    }
                } else {
                    if (mode === "release" && triggeredCombos.has(id)) {
                        callback(getAxisState(gp))
                    }
                    clearTrigger(id)
                }
            }
        }

        rafId = requestAnimationFrame(pollGamepad)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        heldKeys.add(e.key.toLowerCase())
        checkKeyCombos(navigator.getGamepads()[0])
    }

    const onKeyUp = (e: KeyboardEvent) => {
        heldKeys.delete(e.key.toLowerCase())
        checkKeyCombos(navigator.getGamepads()[0])
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    let rafId = requestAnimationFrame(pollGamepad)

    return () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
        for (const timer of activeTimers.values()) {
            clearInterval(timer)
        }
        activeTimers.clear()
    }
}


import { useEffect, useRef, useState } from "react"

export function useInput(
    inputs: InputString[],
    onTrigger?: (state: AnalogInputState) => void,
    options?: {
        mode?: "pressed" | "release" | number
        deadzone?: number
    }
): {
    isActive: boolean
    lastState: AnalogInputState | null
} {
    const [isActive, setIsActive] = useState(false)
    const [lastState, setLastState] = useState<AnalogInputState | null>(null)
    const activeCombos = useRef<Set<string>>(new Set())

    useEffect(() => {
        const stop = onInput(
            inputs,
            (inputState) => {
                setLastState(inputState)
                onTrigger?.(inputState)
            },
            {
                ...options,
            }
        )

        return () => stop()
    }, [inputs.join(" + "), options?.mode, options?.deadzone])

    useEffect(() => {
        // Track state through polling logic for isActive accuracy
        const checkActive = () => {
            setIsActive(activeCombos.current.size > 0)
            requestAnimationFrame(checkActive)
        }
        const raf = requestAnimationFrame(checkActive)
        return () => cancelAnimationFrame(raf)
    }, [])

    return {
        isActive,
        lastState,
    }
}
