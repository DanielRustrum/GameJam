type AnimationLoopFunction = (arg: {
    onTick: (timestamp: number) => void
    onEnd?: () => void
    onInit?: (timestamp: number) => void
    endCondition?: (timestamp: number) => boolean
    throttle?: number
}) => {
    start: () => void
    stop: () => void
    reset: () => void
    rate: (throttle: number) => void
}

export const tick: AnimationLoopFunction = ({
    onInit, onTick, endCondition, onEnd, throttle
}) => {
    let loop_id: null | number = null
    let init_loop = false
    let last_recorded_timestamp: number = 0
    let interval = throttle


    const loop = (timestamp: number) => {
        if (!init_loop) {
            if (onInit !== undefined) onInit(timestamp);
            init_loop = true
            last_recorded_timestamp = timestamp
        }

        if (interval === undefined) {
            onTick(timestamp)
        }
        else if (timestamp - last_recorded_timestamp >= interval) {
            last_recorded_timestamp = timestamp
            onTick(timestamp)
        }


        if (endCondition !== undefined && endCondition(timestamp)) {
            if (onEnd !== undefined) onEnd();
        } else {
            loop_id = window.requestAnimationFrame(loop);
        }
    }

    const start = () => {
        if (loop_id === null) {
            loop_id = window.requestAnimationFrame(loop);
        }
    }

    const stop = () => {
        if (loop_id !== null) window.cancelAnimationFrame(loop_id);
        loop_id = null
    }

    const reset = () => {
        init_loop = false
        stop()
    }

    const rate = (throttle: number) => {
        interval = throttle
    }

    return { start, stop, reset, rate }
}


// Time Based
type TimerTypes = {
    type: "constrained"
    start_time: number
    stop_time: number
} | {
    type: "unconstrained"
    start_time: number
    duration: number
    direction: "up" | "down"
}

export const timer = <T extends TimerTypes>(
    args: {
        timer: T
        interval?: number
        onUpdate?: (remaining_time: number) => void,
        onEnd?: () => void,
    }
) => {
    let current_time = 0
    let timer_data = args.timer
    let last_recorded_timestamp: null | number = null


    const getTickMethods = () => {
        if (timer_data.type === "constrained") {
            const direction_vector = timer_data.start_time < timer_data.stop_time ? 1 : -1

            return tick({
                throttle: args.interval,
                onInit: (timestamp) => {
                    current_time = timer_data.start_time
                    last_recorded_timestamp = timestamp
                },
                onTick: (timestamp) => {
                    const delta = timestamp - (last_recorded_timestamp ?? 0)
                    current_time = current_time + (direction_vector * delta)
                    last_recorded_timestamp = timestamp
                    const rounded_time = Math.round(Math.max(current_time, 0) / (args.interval ?? 0)) * (args.interval ?? 0)
                    if (args.onUpdate) args.onUpdate(rounded_time);
                },
                endCondition: () => {
                    if (timer_data.type === "unconstrained") return true; //? This is here because Typescript freaked out

                    return timer_data.start_time < timer_data.stop_time ?
                        current_time >= timer_data.stop_time :
                        current_time <= timer_data.stop_time
                },
                onEnd: () => {
                    if (timer_data.type === "unconstrained") return; //? This is here because Typescript freaked out

                    if (args.onUpdate) args.onUpdate(timer_data.stop_time);
                    if (args.onEnd) args.onEnd();
                }
            })
        } else {
            const direction_vector = timer_data.direction === "up" ? 1 : -1
            let last_recorded_timestamp: null | number = null

            return tick({
                throttle: args.interval,
                onInit: (timestamp) => {
                    current_time = timer_data.start_time
                    last_recorded_timestamp = timestamp
                },
                onTick: (timestamp) => {
                    const delta = timestamp - (last_recorded_timestamp ?? 0)
                    current_time = current_time + (direction_vector * delta)
                    last_recorded_timestamp = timestamp
                    const rounded_time = Math.round(Math.max(current_time, 0) / (args.interval ?? 0)) * (args.interval ?? 0)
                    if (args.onUpdate) args.onUpdate(rounded_time);
                },
                endCondition: () => {
                    if (timer_data.type === "constrained") return true; //? This is here because Typescript freaked out

                    return timer_data.direction === "up" ?
                        current_time >= timer_data.start_time + timer_data.duration :
                        current_time <= (timer_data.start_time - timer_data.duration || 0)
                },
                onEnd: () => {
                    if (timer_data.type === "constrained") return; //? This is here because Typescript freaked out

                    const stop_time = timer_data.direction === "up" ?
                        timer_data.start_time + timer_data.duration :
                        timer_data.start_time - timer_data.duration > 0 ?
                            timer_data.start_time - timer_data.duration :
                            0

                    if (args.onUpdate) args.onUpdate(stop_time);
                    if (args.onEnd) args.onEnd();
                }
            })
        }
    }

    const Loop = getTickMethods()

    const start = () => {
        Loop.reset()
        Loop.start()
    }

    const stop = () => {
        Loop.stop()
        Loop.reset()
    }

    const pause = () => Loop.stop()

    const resume = () => {
        last_recorded_timestamp = performance.now()
        Loop.start()
    }
    
    const interval = (interval: number) => Loop.rate(interval)

    const set = (time: number) => { current_time = time }

    const update = (timer: T) => { timer_data = timer }

    return { start, stop, pause, resume, set, update, interval }
}

// Interpolations
type InterpolateFunction = (args: {
    range: [number, number],
    significant_figure: number,
    ease?: (progress: number) => number,
    onUpdate?: (step: number) => void,
    onFinish?: () => void,
    duration?: number,
    throttle?: number
}) => {
    start: () => void,
    stop: () => void,
    reset: () => void,
    seek: (position: number) => void,
}

export const interpolate: InterpolateFunction = ({
    range,
    significant_figure,
    ease = (x: number) => x,
    onUpdate,
    onFinish,
    duration = 1000,
    throttle,
}) => {
    const [startVal, endVal] = range
    let start_time = 0
    let isStopped = false
    const distance = Math.abs(endVal - startVal)
    const step_direction = startVal < endVal ? 1 : -1
    let internalTimestamp = 0

    const Loop = tick({
        throttle: throttle,
        onInit: (timestamp) => {
            start_time = timestamp
            internalTimestamp = 0
            isStopped = false
        },
        onTick: (timestamp) => {
            if (isStopped) return
            const elapsed = internalTimestamp || (timestamp - start_time)
            const progress = Math.min(elapsed / duration, 1)
            const eased = ease(progress)
            const raw_value = startVal + distance * eased
            const interpolated = step_direction > 0 ? raw_value : startVal - (raw_value - startVal)
            const rounded_value = Math.round(interpolated / significant_figure) * significant_figure

            if (onUpdate) onUpdate(rounded_value)

            if (progress >= 1) {
                if (onUpdate) onUpdate(endVal)
                if (onFinish) onFinish()
                isStopped = true
            }
        },
        endCondition: () => isStopped
    })

    const start = () => {
        Loop.reset()
        Loop.start()
    }

    const stop = () => {
        isStopped = true
        Loop.stop()
    }

    const reset = () => {
        isStopped = false
        internalTimestamp = 0
        Loop.reset()
    }

    const seek = (position: number) => {
        internalTimestamp = position
        Loop.reset()
        Loop.start()
    }

    return {
        start,
        stop,
        reset,
        seek
    }
}

type SeriesFunction = () => {
    animate: (animation: ReturnType<InterpolateFunction> | ReturnType<InterpolateFunction>[]) => ReturnType<SeriesFunction>
    delay: (duration: number) => ReturnType<SeriesFunction>
    reset: () => ReturnType<SeriesFunction>
    trigger: (callback: () => void) => ReturnType<SeriesFunction>
    init: () => {
        start: () => void
        stop: () => void
        reset: () => void
        seek: (duration: number) => void
    }
}

export const series: SeriesFunction = () => {
    type Step = {
        type: 'animate' | 'delay' | 'trigger',
        duration: number,
        start: () => Promise<void>,
        seek?: (position: number) => void
    }

    const steps: Step[] = []
    let isRunning = false
    let stopSignal = false
    let currentIndex = 0

    const runNext = async () => {
        if (stopSignal || currentIndex >= steps.length) {
            isRunning = false
            return
        }

        const step = steps[currentIndex++]
        await step.start()
        runNext()
    }

    const api = {
        animate: (animations: ReturnType<InterpolateFunction> | ReturnType<InterpolateFunction>[]) => {
            const group = Array.isArray(animations) ? animations : [animations]

            steps.push({
                type: 'animate',
                duration: 1000,
                start: () => new Promise((resolve) => {
                    let completed = 0
                    const total = group.length

                    group.forEach(anim => {
                        const originalReset = anim.reset
                        anim.reset = () => {
                            if (originalReset) originalReset()
                            completed++
                            if (completed === total) resolve()
                        }
                        anim.start()
                    })
                }),
                seek: (position: number) => {
                    group.forEach(anim => anim.seek(position))
                }
            })
            return api
        },

        delay: (duration: number) => {
            steps.push({
                type: 'delay',
                duration,
                start: () => new Promise((resolve) => {
                    setTimeout(resolve, duration)
                }),
                seek: (position: number) => {
                    setTimeout(() => { }, duration - position)
                }
            })
            return api
        },

        trigger: (callback: () => void) => {
            steps.push({
                type: 'trigger',
                duration: 0,
                start: () => new Promise((resolve) => {
                    callback()
                    resolve()
                })
            })
            return api
        },

        reset: () => {
            stopSignal = true
            return series()
        },

        init: () => ({
            start: () => {
                if (!isRunning) {
                    stopSignal = false
                    isRunning = true
                    currentIndex = 0
                    runNext()
                }
            },
            stop: () => {
                stopSignal = true
            },
            reset: () => {
                stopSignal = true
                steps.length = 0
                currentIndex = 0
            },
            seek: (duration: number) => {
                let accumulated = 0
                currentIndex = 0

                for (let i = 0; i < steps.length; i++) {
                    const step = steps[i]
                    if (accumulated + step.duration > duration) {
                        currentIndex = i
                        const withinStep = duration - accumulated
                        if (step.seek) step.seek(withinStep)
                        break
                    }
                    accumulated += step.duration
                }
            }
        })
    }

    return api
} 
