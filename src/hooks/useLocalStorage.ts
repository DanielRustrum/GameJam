import { useEffect, useState } from "react"

type useLocalStorageBucket = <BucketType = unknown>(
    bucket_name: string
) => [
    BucketType | undefined,
    (set: BucketType | ((set: BucketType) => BucketType) ) => void
]

export const useLocalStorageBucket:useLocalStorageBucket = 
    ( 
        bucket_name
    ) => {
    const [bucket_data, setBucket] = useState(() => {
        const local_store = localStorage.getItem(bucket_name)
        
         if(local_store === null) 
            return undefined;
        
        return JSON.parse(local_store)
    })

    useEffect(() => {
        localStorage.setItem(bucket_name, JSON.stringify(bucket_data))
    }, [bucket_data])

    return [
        bucket_data,
        (set: any) => {
            setBucket(set)
        }
    ]
}

export const purgeLocalStorageBucket = (bucket_name: string) => {
    localStorage.removeItem(bucket_name)
}