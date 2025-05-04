import { CSSProperties, ImgHTMLAttributes, memo, RefObject, useEffect, useState } from "react";
import { Component } from "../types/component";
import { OptionObjectDefaults, OptionObjectDefinition } from "../types/object";


type Sprite = Component<{
    state: string
    rate?: number
    tile?: number
    scale?: number
    resizeTo?: RefObject<HTMLElement>
    use_shader?: string

    className?: string
    style?: CSSProperties
    animation?: string;
} & ImgHTMLAttributes<HTMLImageElement>>

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

const rerenders = new Map<string, number>()

let cssInjected = false;
function injectCSS() {
  if (cssInjected) return;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spriteAnimation {
      0% { object-position: var(--sprite-last-frame) var(--sprite-layer); }
      100% { object-position: 0px var(--sprite-layer); }
    }
    .sprite {
      image-rendering: pixelated;
      object-fit: cover;
    }
    .sprite.animated {
      animation: spriteAnimation var(--duration) steps(var(--frames), start) infinite;
    }
  `;

  document.head.appendChild(style);
  cssInjected = true;
}




/**
 * Creates an interactive Sprite React component and a shader registration utility
 * to display animated or static spritesheets with rich visual effects.
 *
 * This factory function allows you to render sprite-based UI elements,
 * handle dynamic animations, apply custom shaders, and respond to user interactions.
 *
 * @function
 * @param {string} src - Source URL of the spritesheet image.
 * @param {Object} options - Configuration object.
 * @param {[number, number]} options.tile_size - Dimensions [height, width] of a single sprite tile.
 * @param {number} options.frame_time - Duration (in seconds) of each animation frame.
 * @param {Object} options.structure - Defines sprite states (animated or static) and frame layouts.
 * @param {'load'|'preload'|'background'} options.loading - Image loading behavior.
 * 
 * @returns {[React.MemoExoticComponent, { shader: Function }]} A tuple containing:
 *  - Sprite: A React component that renders the sprite and supports props like `state`, `rate`, `scale`,
 *    `use_shader`, `animation`, event handlers, and native <img> attributes.
 *  - shader: A utility function to register canvas-based shader effects that can be dynamically applied
 *    to sprite instances.
 *
 * @example
 * const [Sprite, { shader }] = spritesheet('/spritesheet.png', {
 *   tile_size: [64, 64],
 *   frame_time: 0.1,
 *   structure: {
 *     main: { type: 'animated', layer: 0, length: 6 },
 *     idle: { type: 'tile', layer: 1, length: 1 },
 *   },
 *   loading: 'load',
 * });
 *
 * // Register a glowing shader effect
 * shader('glow', (ctx, width, height) => {
 *   ctx.globalCompositeOperation = 'lighter';
 *   ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
 *   ctx.fillRect(0, 0, width, height);
 * });
 *
 * // Use the Sprite component in your React tree
 * <Sprite
 *   state="main"
 *   rate={1.5}
 *   scale={2}
 *   use_shader="glow"
 *   animation="bounce 2s ease-in-out infinite"
 *   alt="Character"
 *   onClick={() => alert('Sprite clicked!')}
 * />
 */
export const spritesheet: SpritesheetFunction = (src, options = {}) => {
    const shaders = new Map<string, string>()
    
    injectCSS()

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
            await callback(ctx, image.naturalWidth, image.naturalHeight)

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
        rate = 1,
        scale = 1,
        tile = 1,
        resizeTo,
        use_shader = "",

        className = "",
        style = {},
        animation,

        ...imgProps
    }) => {
        const [resize_scale, setResizeScale] = useState(1)
        const imageSrc = shaders.get(use_shader) || src

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

        const [_, setTick] = useState(0) //? Used to Force Rerenders of the Component

        useEffect(() => {
            const id = setInterval(() => {
                const modTime = rerenders.get(use_shader)
                if (modTime) {
                    setTick(modTime)
                    rerenders.delete(use_shader)
                }
            }, 100)

            return () => clearInterval(id)
        }, [use_shader])
        

        const stateConfig = opts.structure[state]
        const computedScale = resizeTo ? resize_scale : scale
        const height = opts.tile_size[0] * computedScale
        const width = opts.tile_size[1] * computedScale
        const layer = stateConfig.layer * computedScale * opts.tile_size[0]
  
        const sprite_style: React.CSSProperties = {
          height,
          width,
          "--sprite-layer": `${layer}px`,
        } as React.CSSProperties
  
        if (stateConfig.type === "animated") {
          Object.assign(sprite_style, {
            "--sprite-last-frame": `-${opts.tile_size[1] * computedScale * stateConfig.length}px`,
            "--frames": stateConfig.length,
            "--duration": `${opts.frame_time * stateConfig.length * (1 / rate)}s`,
          })
        } else {
          Object.assign(sprite_style, {
            objectPosition: `-${opts.tile_size[1] * computedScale * (tile - 1)}px ${layer}px`,
          })
        }

        Object.assign(style, sprite_style)

        style.animation = `spriteAnimation var(--duration) steps(var(--frames), start) infinite${
            animation ? `, ${animation}` : ""
        }`
  
        return (
          <img
            {...imgProps}
            src={imageSrc}
            style={style}
            className={`${className} sprite ${stateConfig.type === "animated" ? "animated" : ""}`}
          />
        )

    })

    return [Sprite, {
        shader
    }]
}
