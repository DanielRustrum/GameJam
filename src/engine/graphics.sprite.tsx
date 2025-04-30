import { memo } from "react";
import { Component } from "../types/component";
import { OptionObjectDefaults, OptionObjectDefinition } from "../types/object";
import { create, keyframes, props } from "@stylexjs/stylex";


type SpritesheetFunction = (
    src: string,
    options: OptionObjectDefinition<{
        tile_size: [height: number, width: number]
        frame_time: number
        structure: {
            [state: string]: {
                type: "animated"
                layer: number
                length: number
                loop?: boolean
                rate?: number
                transition_to?: string
            } | {
                type: "tile" 
                layer: number
                length: number
            }
        }
        loading: "load" | "preload" | "background"
    }>
) => Component<{
    state: string
    alt?: string
    tile?: number
    rate?: number
    scale?: number
    frame?: number
}>

const sprite_animation = keyframes({
    '100%': { backgroundPositionX: "0px" },
    '0%': { backgroundPositionX: "var(--sprite-length)" },
})

const styles = create({
    sprite_animated: (
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
        '--sprite-length': `calc(${sheet_width}px * ${scale})`,
        '--sprite-height': `calc(${sheet_height}px * ${scale})`,
        
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
    sprite_static: (
        src: string,
        tile_width: number,
        tile_height: number,
        layer: number,
        frame: number,
        scale: number,
        sheet_width: number,
        sheet_height: number
    ) => ({
        '--sprite-length': `calc(${sheet_width}px * ${scale})`,
        '--sprite-height': `calc(${sheet_height}px * ${scale})`,
        
        backgroundImage: `url(${src})`,
        height: `${tile_height * scale}px`,
        width: `${tile_width * scale}px`,

        backgroundSize: `var(--sprite-length) var(--sprite-height)`,
        backgroundPositionY: `${layer * tile_height}px`,
        imageRendering: "pixelated",
        backgroundPositionX: `${tile_width * scale * frame}px`
    })
});

export const spritesheet: SpritesheetFunction = (src, options = {}) => {
    const sheet = new Image();
    let sheet_size = [32, 128]
    sheet.src = src
    sheet.onload = () => {
        sheet_size = [sheet.naturalHeight, sheet.naturalWidth]
    }

    const opts: OptionObjectDefaults<SpritesheetFunction, 1> = {
        tile_size: [100, 100],
        frame_time: .15,
        structure: { "main": { layer: 0, length: 5 } },
        loading: "load",
        ...options
    }

    return memo(({
        state = "main", 
        alt = "",
        rate = 1,
        scale = 1,
        frame = 0
    }) => {
        switch(opts.structure[state].type) {
            case "animated":
                return <div
                    aria-label={alt}
                    {...props(styles.sprite_animated(
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
            case "tile":
                return <div
                    aria-label={alt}
                    {...props(styles.sprite_static(
                        src,
                        opts.tile_size[1],
                        opts.tile_size[0],
                        opts.structure[state].layer,
                        frame,
                        scale,
                        sheet_size[1],
                        sheet_size[0],
                    ))}
                />
        }
        
    })
}
