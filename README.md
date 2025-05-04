# Game Jam Template Repo

## Project Dragon Soup Tem


## 📦 Sprite Graphics Module

A flexible React component factory for rendering static or animated spritesheets with optional shader and animation support.

---

### ✨ Overview

The `spritesheet` function returns:
- A **Sprite React component**
- A **shader registration function**

It’s designed to:
✅ Display static or animated tiles from a spritesheet  
✅ Handle rescaling with `ResizeObserver`  
✅ Apply optional custom CSS animations  
✅ Work with dynamically generated shader images

---

### ⚙️ Usage

#### Import

```tsx
import { spritesheet } from './spritesheet'
```

### Initialize
```tsx
const [Sprite, { shader }] = spritesheet('/path/to/spritesheet.png', {
  tile_size: [height, width],
  frame_time: 0.15,
  structure: {
    main: { type: 'animated', layer: 0, length: 5 },
    idle: { type: 'tile', layer: 1, length: 1 },
  },
  loading: 'load', // or 'preload', 'background'
})
```

### 🖼 Sprite Component Props
| Prop         | Type                                  | Description                                                     |
| ------------ | ------------------------------------- | --------------------------------------------------------------- |
| `state`      | `string`                              | Which state from `structure` to show (default: `"main"`)        |
| `rate`       | `number`                              | Playback rate multiplier (default: `1`)                         |
| `tile`       | `number`                              | Frame number for static tiles (default: `1`)                    |
| `scale`      | `number`                              | Scale factor (default: `1`); Ignored when resizeTo is used           |
| `resizeTo`   | `RefObject<HTMLElement>`              | Element to watch for resizing and auto-scale                    |
| `use_shader` | `string`                              | ID of a registered shader image                                 |
| `className`  | `string`                              | Additional CSS class names                                      |
| `style`      | `CSSProperties`                       | Additional inline styles                                        |
| `animation`  | `string`                              | Extra CSS animation(s), e.g. `"bounce 2s ease-in-out infinite"` |
| **...rest**  | `ImgHTMLAttributes<HTMLImageElement>` | All standard `<img>` props (e.g., `onClick`, `loading`, `alt`)  |

```tsx
shader('shaderId', (ctx, width, height) => {
  // Draw custom effects on canvas context
});
```

#### Structure States
- **animated** → runs sprite animation automatically
- **tile** → shows specific frame controlled by tile prop

### 💬 Example
```tsx
import { spritesheet } from './spritesheet'

const [Sprite, { shader }] = spritesheet('/path/to/spritesheet.png', {
  tile_size: [height, width],
  frame_time: 0.15,
  structure: {
    main: { type: 'animated', layer: 0, length: 5 },
    idle: { type: 'tile', layer: 1, length: 1 },
  },
  loading: 'load', // or 'preload', 'background'
})

shader('glow', (ctx, width, height) => {
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'
  ctx.fillRect(0, 0, width, height)
})

const Example = () => {
  const containerRef = useRef(null)

  return <div ref={containerRef}>
    <Sprite
      state="animated"
      rate={1.5}
      resizeTo={containerRef}
      use_shader="glow"
      animation="bounce 2s ease-in-out infinite"
      alt="Character"
      onClick={() => alert('Clicked!')}
    />
  </div>
}


```

### 💡 Notes
- ✅ Automatically injects CSS once into <head>
- ✅ Works with OffscreenCanvas or HTMLCanvas fallback
- ✅ Custom animations are combined using the animation CSS property
- ✅ Shader rerenders are triggered automatically

### Sprites Roadmap
- [ ] Flexible Sprite Sheet Structure
- [ ] Image Preloading and Background Loading
- [ ] Compute Shader in Web worker
- [ ] Ratio Resizing Algorithm for Rectangular Sprite Sheets
- [ ] Demo Site
- [ ] Build From Scratch Sprites