import { Howl } from 'howler';
import { interpolate } from './animation.timing';


type soundEffectFunction = (
    effect_name: string,
    options?: {
        volume: number;
    }
) => (options?: {
    overlap?: boolean
    volume?: number | [number, number]
    speed?: number | [number, number]
    onUpdate?: (type:string, data: number) => void
}) => {
    rate: (rate: number) => void;
    volume: (level: number, abrupt?: boolean) => void;
}


export const soundEffect: soundEffectFunction = (effect_link, options) => {
    const SoundEffect = new Howl({ src: effect_link, volume: options?.volume ?? 1 });
    let effect_volume: number = options?.volume ?? 1

    return (options) => {
        const opts = {
            overlap: false,
            ...options
        }

        const id = SoundEffect.play()
        let instance_volume = opts.volume ?? effect_volume
        let instance_speed = opts.speed ?? 1

        if (!Array.isArray(instance_volume)) {
            SoundEffect.volume(instance_volume, id);
        }

        if (Array.isArray(instance_volume)) {
            interpolate({
                range: instance_volume,
                significant_figure: 0.01,
                duration: 1000,
                onUpdate: (val) => {
                    if(options?.onUpdate) options?.onUpdate("volume", val);
                    SoundEffect.volume(val, id);
                },
            }).start();
            instance_volume = instance_volume[1]
        }

        if (!Array.isArray(instance_speed)) {
            SoundEffect.rate(instance_speed, id);
        }

        if (Array.isArray(instance_speed)) {
            interpolate({
                range: instance_speed,
                significant_figure: 0.01,
                duration: 1000,
                onUpdate: (val) => {
                    SoundEffect.rate(val, id);
                    if(options?.onUpdate) options?.onUpdate("rate", val);
                },
            }).start();
            instance_speed = instance_speed[1]
        }

        return {
            rate: (speed, abrupt = false) => {
                if (abrupt) {
                    SoundEffect.rate(speed, id)
                } else {
                    interpolate({
                        range: [instance_speed as number, speed],
                        significant_figure: 0.01,
                        duration: 1000,
                        onUpdate: (val) => {
                            SoundEffect.rate(val, id);
                            if(options?.onUpdate) options?.onUpdate("rate", val);
                        },
                    }).start();
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
                        duration: 1000,
                        onUpdate: (val) => {
                            SoundEffect.volume(val, id);
                            if(options?.onUpdate) options?.onUpdate("volume", val);
                        },
                    }).start();
                }

                instance_volume = level
            }
        };
    }
};