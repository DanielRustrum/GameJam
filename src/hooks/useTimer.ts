import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type TimerRef = {
    starting_timestamp?: number
    elapsed_timestamp?: number
    current_time?: number
    RAF_request_id?: number
    count_to_time?: number
}

type useTimerHook = (
    count_to_time?: number,
    interval?: number
) => [number, {
    start: (new_duration?: number, new_rate?: number) => void,
    pause: () => void,
    resume: () => void,
    reset: () => void,
    move: (new_duration: number) => void
}]

export const useTimer: useTimerHook = (
    count_to_time = 60 * 1000, 
    interval = 1000
) => {
    const [current_time, setCurrentTime] = useState(0);
    const timer = useRef<TimerRef>({});

    const loop = (timestamp: number) => {
        //* Initalize Loop
        if (
            !timer.current.starting_timestamp ||
            !timer.current.elapsed_timestamp
        ) {
            timer.current.starting_timestamp = timestamp;
            timer.current.elapsed_timestamp = timestamp;
        }

        //* Get Step Interval

        const localInterval = Math.min(
            interval, 
            (timer.current.current_time || Infinity)
        )

        //* Check if CountDown is Completed
        if ((timestamp - timer.current.elapsed_timestamp) >= localInterval) {
            timer.current.elapsed_timestamp += localInterval;
            setCurrentTime((current_time) => {
                timer.current.current_time = current_time - localInterval;
                return timer.current.current_time;
            });
        }

        //* Loop Timer if Needed; Otherwise Reset it
        if (
            timer.current.count_to_time &&
            (timestamp - timer.current.starting_timestamp < timer.current.count_to_time)
        ) {
            timer.current.RAF_request_id = window.requestAnimationFrame(loop);
        } else {
            timer.current = {}
            setCurrentTime(0)
        }
    }

    const start = useCallback(
        (
            new_duration?: number
        ) => {
            if (timer.current.RAF_request_id)
                window.cancelAnimationFrame(timer.current.RAF_request_id);

            const newcount_to_time = new_duration !== undefined ? new_duration : count_to_time
            timer.current.starting_timestamp = undefined;
            timer.current.elapsed_timestamp = undefined;
            timer.current.count_to_time = newcount_to_time;
            timer.current.RAF_request_id = window.requestAnimationFrame(loop);

            setCurrentTime(newcount_to_time);
        },
        [],
    );

    const pause = useCallback(
        () => {
            if (timer.current.RAF_request_id)
                window.cancelAnimationFrame(timer.current.RAF_request_id);
            timer.current.starting_timestamp = undefined;
            timer.current.elapsed_timestamp = undefined;
            timer.current.count_to_time = timer.current.current_time;
        },
        [],
    );

    const resume = useCallback(
        () => {
            if (!timer.current.starting_timestamp && (
                timer.current.current_time &&
                timer.current.current_time > 0
            )) {
                if (timer.current.RAF_request_id)
                    window.cancelAnimationFrame(timer.current.RAF_request_id);
                timer.current.RAF_request_id = window.requestAnimationFrame(loop);
            }
        },
        [],
    );

    const reset = useCallback(
        () => {
            if (timer.current.current_time) {
                if (timer.current.RAF_request_id)
                    window.cancelAnimationFrame(timer.current.RAF_request_id);
                timer.current = {};
                setCurrentTime(0);
            }
        },
        [],
    );

    

    const move = useCallback(
        (new_duration: number) => {
            if (timer.current.current_time)
                setCurrentTime(() => {
                    timer.current.current_time = new_duration;
                    return timer.current.current_time;
                });
        }, [current_time]
    )

    const actions = useMemo(
        () => ({ start, pause, resume, reset, move }),
        [],
    );

    useEffect(() => {
        return () => {
            if(timer.current.RAF_request_id)
                window.cancelAnimationFrame(timer.current.RAF_request_id);
        }
    }, []);

    return [current_time, actions];
}
