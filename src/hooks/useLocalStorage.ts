// import { useEffect, useRef, useState } from "react"

type useLocalStorageBucket = <Casted = unknown>(
    bucket_name: string,
    CastFunc?: CallableFunction
) => [
    (key: string) => Casted,
    (key: string, set: Casted) => void
]

export const useLocalStorageBucket:useLocalStorageBucket = 
    ( 
        bucket_name,
        CastFunc?
    ) => {
    return [
        (key) => {
            if(CastFunc !== undefined)
                return CastFunc(localStorage.getItem(`${bucket_name}.${key}`));
            else
                return localStorage.getItem(`${bucket_name}.${key}`);
        },
        (key, set) => localStorage.setItem(`${bucket_name}.${key}`, JSON.stringify(set))
    ]
}

export const purgeLocalStorageBucket = (bucket_name: string) => {
    localStorage.removeItem(bucket_name)
}