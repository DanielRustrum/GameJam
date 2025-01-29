// import { useEffect, useRef, useState } from "react"

type useLocalStorageBucket = <Casted = unknown>(
    bucket_name: string,
    CastFunc?: CallableFunction
) => [
    <T>(key: string, fallback?: T) => Casted,
    (key: string, set: Casted) => void,
    (key: string) => boolean
]

export const useLocalStorageBucket:useLocalStorageBucket = 
    ( 
        bucket_name,
        CastFunc?
    ) => {
    return [
        (key, fallback = undefined) => {
            if(CastFunc !== undefined)
                return CastFunc(localStorage.getItem(`${bucket_name}.${key}`));
            else{
                const result = localStorage.getItem(`${bucket_name}.${key}`)
                if(result === null)
                    return fallback;
                return JSON.parse(result)
            }
        },
        (key, set) => localStorage.setItem(`${bucket_name}.${key}`, JSON.stringify(set)),
        (key) => localStorage.getItem(`${bucket_name}.${key}`) === null
    ]
}

export const purgeLocalStorageBucket = (bucket_name: string) => {
    localStorage.removeItem(bucket_name)
}