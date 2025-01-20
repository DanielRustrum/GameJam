import React from 'react';

/**
 * 
 * @param {number} timeToCount 
 * @param {number} interval 
 * @returns {[number, {
 *    start: (new_duration?: number) => void,
 *    pause: () => void,
 *    resume: () => void,
 *    reset: () => void,
 *    adjust: (new_duration: number) => void
*     move: (new_duration: number) => void
 *  }]} 
 */
export const useCountDown = (timeToCount = 60 * 1000, interval = 1000) => {
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [currentRate, setRate] = React.useState(1)
  const timer = React.useRef({});

  const run = (ts) => {
    if (!timer.current.started) {
      timer.current.started = ts;
      timer.current.lastInterval = ts;
    }

    const localInterval = Math.min(interval, (timer.current.timeLeft || Infinity));
    if ((ts - timer.current.lastInterval) >= localInterval) {
      timer.current.lastInterval += localInterval;
      setTimeLeft((timeLeft) => {
        timer.current.timeLeft = timeLeft - localInterval;
        return timer.current.timeLeft;
      });
    }

    if (ts - timer.current.started < timer.current.timeToCount) {
      timer.current.requestId = window.requestAnimationFrame(run);
    } else {
      timer.current = {};
      setTimeLeft(0);
    }
  }

  const start = React.useCallback(
    (ttc) => {
      window.cancelAnimationFrame(timer.current.requestId);

      const newTimeToCount = ttc !== undefined ? ttc : timeToCount
      timer.current.started = null;
      timer.current.lastInterval = null;
      timer.current.timeToCount = newTimeToCount;
      timer.current.requestId = window.requestAnimationFrame(run);

      setTimeLeft(newTimeToCount);
    },
    [],
  );

  const pause = React.useCallback(
    () => {
      window.cancelAnimationFrame(timer.current.requestId);
      timer.current.started = null;
      timer.current.lastInterval = null;
      timer.current.timeToCount = timer.current.timeLeft;
    },
    [],
  );

  const resume = React.useCallback(
    () => {
      if (!timer.current.started && timer.current.timeLeft > 0) {
        window.cancelAnimationFrame(timer.current.requestId);
        timer.current.requestId = window.requestAnimationFrame(run);
      }
    },
    [],
  );

  const reset = React.useCallback(
    () => {
      if (timer.current.timeLeft) {
        window.cancelAnimationFrame(timer.current.requestId);
        timer.current = {};
        setTimeLeft(0);
      }
    },
    [],
  );

  const adjust = React.useCallback(
    (ttc) => {
      setTimeLeft((_) => {
        timer.current.timeLeft = ttc
        return timer.current.timeLeft
      });
    },
    []
  )

  const move = React.useCallback(
    (ttc) => {
      timer.current.timeToCount = ttc
    }
  )

  const actions = React.useMemo(
    () => ({ start, pause, resume, reset, adjust, move }),
    [],
  );

  React.useEffect(() => {
    return () => window.cancelAnimationFrame(timer.current.requestId);
  }, []);

  return [timeLeft, actions];
}
