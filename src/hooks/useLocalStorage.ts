import { useEffect, useState } from "react"


export const useLocalStorageBucket = (bucket_name: string) => {
    const [bucket_data, setBucket] = useState<unknown>(
        localStorage.get(bucket_name)
    )

    useEffect(() => {
        localStorage.setItem(bucket_name, JSON.stringify(bucket_data))
    }, [bucket_data])

    return [
        bucket_data,
        setBucket
    ]
}

export const purgeLocalStorageBucket = (bucket_name: string) => {
    localStorage.removeItem(bucket_name)
}