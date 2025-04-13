import { memo, useRef } from "react";
import { Component } from "../types/component";
import * as stylex from '@stylexjs/stylex';
import { OptionObjectFromArgs } from "../types/object";

type SpritesheetFunction = (
    src: string,
    options?: {
        tile_size?: [height: number, width: number]
        frame_time?: number
        structure?: { [state: string]: { layer: number, length: number } }
        svg?: boolean
        loading?: "load" | "preload" | "background"
    }
) => Component<{
    state?: string
    alt?: string
    rate?: number
    scale?: number
}>

const sprite_animation = stylex.keyframes({
    '100%': { backgroundPositionX: "0px" },
    '0%': { backgroundPositionX: "var(--sprite-length)" },
})

const styles = stylex.create({
    sprite: (
        src: string,
        tile_width: number,
        tile_height: number,
        layer: number,
        frames: number,
        timing: number,
        rate: number,
        scale: number,
        sheet_width: number,
        sheet_height: number
    ) => ({
        '--sprite-scale': scale,
        '--sprite-length': `calc(${sheet_width}px * var(--sprite-scale))`,
        '--sprite-height': `calc(${sheet_height}px * var(--sprite-scale))`,
        
        backgroundImage: `url(${src})`,
        height: `${tile_height * scale}px`,
        width: `${tile_width * scale}px`,

        backgroundSize: `var(--sprite-length) var(--sprite-height)`,
        backgroundPositionY: `${layer * tile_height}px`,
        imageRendering: "pixelated",

        animationName: sprite_animation,
        animationDuration: `${timing * frames * (1/rate)}s`,
        animationTimingFunction: `steps(${frames}, end)`,
        animationIterationCount: 'infinite',
    }),
});

export const spritesheet: SpritesheetFunction = (src, options = {}) => {
    const sheet = new Image();
    let sheet_size = [32, 128]
    sheet.src = src
    sheet.onload = () => {
        sheet_size = [sheet.naturalHeight, sheet.naturalWidth]
    }

    const opts: OptionObjectFromArgs<SpritesheetFunction, 1> = {
        tile_size: [100, 100],
        frame_time: .15,
        structure: { "main": { layer: 0, length: 5 } },
        svg: false,
        loading: "load",
        ...options
    }

    return memo(({
        state = "main", 
        alt = "",
        rate = 1,
        scale = 1,
    }) => {
        const element = useRef<HTMLElement | null>(null)
        if (element.current !== null && element.current.closest('svg') !== null) {}
        return <div
            aria-label={alt}
            {...stylex.props(styles.sprite(
                src,
                opts.tile_size[1],
                opts.tile_size[0],
                opts.structure[state].layer,
                opts.structure[state].length,
                opts.frame_time,
                rate,
                scale,
                sheet_size[1],
                sheet_size[0],
            ))}
        />
    })
}