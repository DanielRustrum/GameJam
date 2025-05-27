type AnimationLoopFunction = (arg: {
    onTick: (timestamp: number) => void
    onEnd?: () => void
    onInit?: (timestamp: number) => void
    endCondition?: (timestamp: number) => boolean
}) => {
    start: () => void
    stop: () => void
    reset: () => void
}

export const tick: AnimationLoopFunction = ({
    onInit, onTick, endCondition, onEnd
}) => {
    let loop_id: null | number = null
    let init_loop = false

    const loop = (timestamp: number) => {
        if (!init_loop) {
            if (onInit !== undefined) onInit(timestamp);
            init_loop = true
        }

        onTick(timestamp)

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

    return { start, stop, reset }
}


// Time Based

export const timer = (
    duration: number,
    significant_figure: number,
    onUpdate?: (remaining_time: number) => void
) => {
    let start_time = 0
    let last_tick_time = 0
    let current_time = duration
    let timer_duration = duration

    const Loop = tick({
        onInit: (timestamp) => {
            start_time = timestamp
            last_tick_time = timestamp
        },
        onTick: (timestamp) => {
            const delta = timestamp - last_tick_time
            if (delta >= significant_figure) {
                current_time -= delta
                last_tick_time = timestamp
                const rounded_time = Math.floor(Math.max(current_time, 0) / significant_figure) * significant_figure
                if (onUpdate) onUpdate(rounded_time)
            }
        },
        endCondition: (timestamp) => {
            return (timestamp - start_time) >= timer_duration
        },
        onEnd: () => {
            current_time = 0
            if (onUpdate) onUpdate(0)
        }
    })

    const start = () => {
        current_time = timer_duration;
        Loop.reset()
        Loop.start()
    }

    const stop = () => {
        Loop.stop()
        Loop.reset()
        current_time = timer_duration;
    }

    const pause = () => {
        Loop.stop()
    }

    const resume = () => {
        Loop.start()
    }

    const set = (time: number) => {
        current_time = time
    }

    const update = (duration: number) => {
        timer_duration = duration
    }

    return { start, stop, pause, resume, set, update }
}

export const interval = (
    duration: number,
    significant_figure: number,
    onUpdate?: (remaining_time: number) => void,
    onReset?: () => void
) => {
    const IntervalTimer = timer(duration, significant_figure, (remaining_time) => {
        if(onReset !== undefined && remaining_time <= 0) {
            onReset();
            IntervalTimer.start()
        }

        if(onUpdate !== undefined) onUpdate(remaining_time);
    })

    const start = () => {
        IntervalTimer.start();
    }

    const stop = () => {
        IntervalTimer.stop();
    }

    const pause = () => {
        IntervalTimer.pause();
    }

    const resume = () => {
        IntervalTimer.resume();
    }

    const set = (time: number) => {
        IntervalTimer.set(time);
    }

    const update = (time: number) => {
        IntervalTimer.update(time);
    }

    return { start, stop, pause, resume, set, update }
}

// Interpolations

type InterpolateArgsBase = {
  range: [number, number],
  significant_figure: number,
  ease?: (progress: number) => number,
  onUpdate?: (step: number) => void,
  onFinish?: () => void,
  duration?: number,
}

type InterpolateArgsThrottled = InterpolateArgsBase & {
  throttle: true,
  throttle_ms: number
}

type InterpolateArgsUnthrottled = InterpolateArgsBase & {
  throttle?: false,
  throttle_ms?: undefined
}

type InterpolateFunction = (args: InterpolateArgsThrottled | InterpolateArgsUnthrottled) => {
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
    throttle = false,
    throttle_ms = 100
}) => {
    const [startVal, endVal] = range
    let start_time = 0
    let last_output_time: number | null = null
    let isStopped = false
    const distance = Math.abs(endVal - startVal)
    const step_direction = startVal < endVal ? 1 : -1
    let internalTimestamp = 0

    const Loop = tick({
        onInit: (timestamp) => {
            start_time = timestamp
            last_output_time = timestamp
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

            if (!throttle || (last_output_time === null || timestamp - last_output_time >= throttle_ms)) {
                last_output_time = timestamp
                if (onUpdate) onUpdate(rounded_value)
            }

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
                    setTimeout(() => {}, duration - position)
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
