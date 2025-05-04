import { memo, RefObject, useEffect, useState } from "react";
import { Component } from "../types/component";
import { OptionObjectDefaults, OptionObjectDefinition } from "../types/object";
import { create, keyframes, props, StyleXStyles } from "@stylexjs/stylex";


type Sprite = Component<{
    state: string
    alt?: string
    rate?: number
    tile?: number
    scale?: number
    styles?: StyleXStyles
    shader?: string
    resizeTo?: RefObject<HTMLElement>
}>

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
) => [Sprite, {
    shader: (id: string, callback: (ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) => void) => void
}]

const sprite_animation_image = keyframes({
    '100%': { objectPosition: `0px var(--sprite-layer)` },
    '0%': { objectPosition: `var(--sprite-last-frame) var(--sprite-layer)` },
})

const sprite_styles = create({
    sprite_static_image: (
        tile_width: number,
        tile_height: number,
        layer: number,
        frame: number,
        scale: number,
    ) => ({
        height: `${tile_height * scale}px`,
        width: `${tile_width * scale}px`,

        objectPosition: `-${tile_width * scale * (frame - 1)}px ${layer * scale * tile_height}px`,
        imageRendering: "pixelated",
        objectFit: "cover",
    }),
    sprite_animation_image: (
        tile_width: number,
        tile_height: number,
        layer: number,
        frames: number,
        timing: number,
        rate: number,
        scale: number,
    ) => ({
        '--sprite-layer': `${layer * scale * tile_height}px`,
        '--sprite-last-frame': `-${(tile_width * scale * (frames))}px`,

        height: `${tile_height * scale}px`,
        width: `${tile_width * scale}px`,

        objectPosition: `0px ${layer * tile_height}px`,
        imageRendering: "pixelated",
        objectFit: "cover",

        animationName: sprite_animation_image,
        animationDuration: `${timing * frames * (1 / rate)}s`,
        animationTimingFunction: `steps(${frames}, start)`,
        animationIterationCount: 'infinite',
    })
})

const rerenders = new Map<string, number>()

export const spritesheet: SpritesheetFunction = (src, options = {}) => {
    const shaders = new Map<string, string>()

    const opts: OptionObjectDefaults<SpritesheetFunction, 1> = {
        tile_size: [100, 100],
        frame_time: .15,
        structure: { "main": { layer: 0, length: 5 } },
        loading: "load",
        ...options
    }

    const shader = (id: string, callback: CallableFunction) => {
        const image = new Image()
        image.crossOrigin = "anonymous"
        image.src = src

        image.onload = async () => {
            const canvas: HTMLCanvasElement | OffscreenCanvas =
                typeof OffscreenCanvas !== "undefined"
                    ? new OffscreenCanvas(image.naturalWidth, image.naturalHeight)
                    : Object.assign(document.createElement("canvas"), {
                        width: image.naturalWidth,
                        height: image.naturalHeight
                    })

            const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
            if (!ctx || typeof ctx.drawImage !== "function") return;

            ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight)
            callback(ctx, image.naturalWidth, image.naturalHeight)

            const finalize = (url: string) => {
                shaders.set(id, url)
                rerenders.set(id, Date.now())
            };

            if ("convertToBlob" in canvas) {
                const blob = await (canvas as OffscreenCanvas).convertToBlob()
                finalize(URL.createObjectURL(blob))
            } else {
                const dataURL = (canvas as HTMLCanvasElement).toDataURL()
                finalize(dataURL)
            }
        };
    }

    const Sprite: Sprite = memo(({
        state = "main",
        alt = "",
        rate = 1,
        scale = 1,
        tile = 1,
        resizeTo,
        shader = "",
        styles
    }) => {
        const [resize_scale, setResizeScale] = useState(1)
        const imageSrc = 
            shaders.has(shader)
                ? shaders.get(shader)
                : src

        useEffect(() => {
            
            if (resizeTo?.current === undefined) return () => {}

            const observer = new ResizeObserver((entries) => {
                const { width, height } = entries[0].contentRect
                setResizeScale(
                    Math.min(width, height) / opts.tile_size[1]
                )
            })

            if (resizeTo.current) observer.observe(resizeTo.current);

            return () => {
                if (resizeTo.current) observer.unobserve(resizeTo.current);
            }
        }, [])

        const [_, setTick] = useState(0) //Used to Force Rerenders of the component

        useEffect(() => {
            const id = setInterval(() => {
                const modTime = rerenders.get(shader)
                if (modTime) {
                    setTick(modTime)
                    rerenders.delete(shader)
                }
            }, 100)

            return () => clearInterval(id)
        }, [shader])

        switch (opts.structure[state].type) {
            case "animated":
                return <img
                    src={imageSrc}
                    alt-text={alt}
                    {...props(styles, sprite_styles.sprite_animation_image(
                        opts.tile_size[1],
                        opts.tile_size[0],
                        opts.structure[state].layer,
                        opts.structure[state].length,
                        opts.frame_time,
                        rate,
                        resizeTo? resize_scale : scale
                    ))}
                />
            case "tile":
                return <img
                    src={imageSrc}
                    alt-text={alt}
                    {...props(styles, sprite_styles.sprite_static_image(
                        opts.tile_size[1],
                        opts.tile_size[0],
                        opts.structure[state].layer,
                        tile,
                        resizeTo? resize_scale : scale
                    ))}
                />
        }

    })

    return [Sprite, {
        shader
    }]
}
