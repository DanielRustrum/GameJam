import { Howl } from 'howler'
import { interpolate } from './animation.timing'


type soundEffectFunction = (
    effect_name: string,
    options?: {
        volume: number
    }
) => (options?: {
    overlap?: boolean
    volume?: number | [number, number]
    speed?: number | [number, number]
    ease?: (data: number) => number
    duration?: number
    onUpdate?: (type: string, data: number) => void
    onEnd?: (type: string) => void
}) => {
    rate: (rate: number) => void
    volume: (level: number, abrupt?: boolean) => void
}


export const soundEffect: soundEffectFunction = (effect_link, options) => {
    const SoundEffect = new Howl({ src: effect_link, volume: options?.volume ?? 1 })
    let effect_volume: number = options?.volume ?? 1

    return (options) => {
        const id = SoundEffect.play()
        let instance_volume = options?.volume ?? effect_volume
        let instance_speed = options?.speed ?? 1

        if (Array.isArray(instance_volume)) {
            const new_volume = instance_volume[1]

            interpolate({
                range: instance_volume,
                significant_figure: 0.01,
                duration: options?.duration ?? 1000,
                ease: options?.ease,
                onUpdate: (val) => {
                    if (options?.onUpdate) 
                        options?.onUpdate("volume", val);

                    SoundEffect.volume(val, id)

                    if (options?.onEnd && val === new_volume) 
                        options?.onEnd("volume");
                },
            }).start()
            
            instance_volume = new_volume
        } else {
            SoundEffect.volume(instance_volume, id)
        }

        if (Array.isArray(instance_speed)) {
            const new_rate = instance_speed[1]

            interpolate({
                range: instance_speed,
                significant_figure: 0.01,
                duration: options?.duration ?? 1000,
                ease: options?.ease,
                onUpdate: (val) => {
                    if (options?.onUpdate) 
                        options?.onUpdate("rate", val);

                    SoundEffect.rate(val, id)

                    if (options?.onEnd && val === new_rate) 
                        options?.onEnd("rate");
                },
            }).start()

            instance_speed = new_rate
        } else {
            SoundEffect.rate(instance_speed, id)
        }

        return {
            rate: (speed, abrupt = false) => {
                if (abrupt) {
                    SoundEffect.rate(speed, id)
                } else {
                    interpolate({
                        range: [instance_speed as number, speed],
                        significant_figure: 0.01,
                        duration: options?.duration ?? 1000,
                        ease: options?.ease,
                        onUpdate: (val) => {
                            SoundEffect.rate(val, id)

                            if (options?.onUpdate) 
                                options?.onUpdate("rate", val);

                            if (options?.onEnd && val === speed) 
                                options?.onEnd("rate");
                        },
                    }).start()
                }

                instance_speed = speed
            },
            volume: (level, abrupt = false) => {
                if (abrupt) {
                    SoundEffect.volume(level, id)
                } else {
                    interpolate({
                        range: [instance_volume as number, level],
                        significant_figure: 0.01,
                        duration: options?.duration ?? 1000,
                        ease: options?.ease,
                        onUpdate: (val) => {
                            SoundEffect.volume(val, id)

                            if (options?.onUpdate) 
                                options?.onUpdate("volume", val);

                            if (options?.onEnd && val === level) 
                                options?.onEnd("volume");
                        },
                    }).start()
                }

                instance_volume = level
            }
        }
    }
}