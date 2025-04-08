import { Component } from "../types/component";
import * as stylex from '@stylexjs/stylex';

type SpritesheetFunction = (
    src: string, 
    options?: {
        alt?: string
    }
) => Component<{
    state?: string
}>

const sprite_animation = stylex.keyframes({
    '0%': {transform: 'rotate(0)'},
    '50%': {transform: 'rotate(180deg)'},
    '100%': {transform: 'rotate(360deg)'},
})

const styles = stylex.create({
    pulse: {
      animationName: sprite_animation,
      animationDuration: '1s',
      animationIterationCount: 'infinite',
    },
});

export const spritesheet: SpritesheetFunction = (src, options = {}) => {
    
    const opts = {
        alt: "",
        ...options
    }

    return ({
        state
    }) => {
        return <div style={{height: "100px", width: "100px", backgroundColor: "orangered"}} {...stylex.props(styles.pulse)} />
    }
}