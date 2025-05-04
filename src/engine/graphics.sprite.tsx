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
      animation-name: spriteAnimation;
      animation-timing-function: steps(var(--frames), start);
      animation-iteration-count: infinite;
    }
  `;

  document.head.appendChild(style);
  cssInjected = true;
}

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
        rate = 1,
        scale = 1,
        tile = 1,
        resizeTo,
        use_shader = "",

        className = "",
        style = {},
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
            animationDuration: `${opts.frame_time * stateConfig.length * (1 / rate)}s`,
          })
        } else {
          Object.assign(sprite_style, {
            objectPosition: `-${opts.tile_size[1] * computedScale * (tile - 1)}px ${layer}px`,
          })
        }

        Object.assign(style, sprite_style)
  
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
