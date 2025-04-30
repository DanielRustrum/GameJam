import { CSSProperties, Key, memo, useRef } from "react";
import { Component } from "../types/component";
import { OptionObjectDefaults, OptionObjectDefinition } from "../types/object";
import { Application } from "@pixi/react";
import { Application as App, Assets, Renderer, Texture } from "pixi.js";
import { create, keyframes, props } from "@stylexjs/stylex";


type SpritesheetFunction = (
    src: string,
    options: OptionObjectDefinition<{
        tile_size: [height: number, width: number]
        frame_time: number
        structure: {
            [state: string]: {
                type: "tile" | "animated"
                layer: number
                length?: number
                loop?: boolean
                rate?: number
                transition_to?: string
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
}>

const sprite_animation = keyframes({
    '100%': { backgroundPositionX: "0px" },
    '0%': { backgroundPositionX: "var(--sprite-length)" },
})

const styles = create({
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
    }) => {
        return <div
            aria-label={alt}
            {...props(styles.sprite(
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

type RegionFunction = (
    name: string,
    assets?: Array<string>,
    options?: OptionObjectDefinition<{
        size: [height: number, width: number]
   }>
) => Component<{
    style?: CSSProperties
    className?: string
    alt_text?: string
    regionMethod?: (app: App<Renderer>, assets: Array<string>) => Promise<void>
    key?: Key | null
}>

export const region: RegionFunction = (name, assets=[], options = {}) => {
    const opts: OptionObjectDefaults<RegionFunction, 2> = {
        size: [100, 100],
        ...options
    }


    return ({style, className, alt_text, key, regionMethod}) => {
        const containerRef = useRef<null | HTMLDivElement>(null)

        return <div id={`region-${name}`} key={key} ref={containerRef} style={style} className={className} aria-label={alt_text}>
            <Application 
                onInit={async (app) => {
                    if(regionMethod !== undefined) await regionMethod(app, assets);
                }}
                autoStart 
                sharedTicker 
                resizeTo={containerRef} 
            />
        </div>
    }
} 