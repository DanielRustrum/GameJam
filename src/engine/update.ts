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
 
const animationLoop: AnimationLoopFunction = ({
    onInit, onTick, endCondition, onEnd
}) => {
    let loop_id: null | number = null
    let init_loop = false

    const loop = (timestamp: number) => {
        if(!init_loop) {
            if(onInit !== undefined) onInit(timestamp);
            init_loop = true
        }
        
        onTick(timestamp);
    
        if(endCondition !== undefined && endCondition(timestamp)) {
            if(onEnd !== undefined) onEnd();
        } else {
            loop_id = window.requestAnimationFrame(loop);
        }
    }

    const start = () => {
        loop_id = window.requestAnimationFrame(loop);
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

export const timer = (
    duration: number, 
    interval: number,
    onUpdate?: (remainning_time: number) => void
) => {
    let current_time = 0
    let start_time = 0
    let elapsed_time = 0
    
    const Loop = animationLoop({
        onInit: (timestamp) => {
            start_time = timestamp
            elapsed_time = timestamp
        },
        onTick: (timestamp) => {
            const reduced_time_interval = Math.min(
                interval, 
                (current_time || Infinity)
            )

            if((timestamp - elapsed_time) >= reduced_time_interval) {
                current_time -= reduced_time_interval
            }

            if(onUpdate) onUpdate(current_time)
        },
        endCondition: (timestamp) => {
            return timestamp - start_time < duration
        },
        onEnd: () => {
            current_time = 0
        }
    })

    const start = () => {
        current_time = duration;
        
        Loop.reset()
        Loop.start()
    }
    
    const stop = () => {
        Loop.stop()

        Loop.reset()
        current_time = duration;
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


    return {
        start, stop, pause, resume, set
    }
}

export const tick = (
    tick_amount: number,
    onUpdate?: (tick: number) => void,
    onFinish?: () => void
) => {
    let current_tick: number = 0

    const Loop = animationLoop({
        onTick: () => {
            current_tick += 1
            if(onUpdate !== undefined) onUpdate(current_tick);
        },
        endCondition: () => {
            return (current_tick === tick_amount || current_tick > tick_amount)
        },
        onEnd: () => {
            if(onFinish !== undefined) onFinish();
        }
    })

    const start = () => {
        Loop.start()
    }

    const reset = () => {
        Loop.stop()
        current_tick = 0
    }

    return { start, reset }
}