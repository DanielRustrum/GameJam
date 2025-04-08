import { createContext, useRef, ReactNode, FC, useContext, useEffect } from "react"

type BridgeData = {
    [group: string]:{ 
        [link: string]: CallableFunction | undefined
    } 
}

interface StateControllerContextMethods {
    createLink: (group:string, name: string, callback: Function) => void
    deleteLink: (group:string, name: string) => void
    establishGroup: (group: string) => void
    callState: (group: string, name: string) => void
}

type StateControllerHook = () => FC<{children: ReactNode}> 

const StateControllerContext = createContext<StateControllerContextMethods | null>(null)

export const StateController: StateControllerHook = () => {
    const BridgeRef = useRef<BridgeData>({})
    
    const createLink = (group:string, name: string, callback: Function) => {
        BridgeRef.current[group][name] = callback
    }

    const deleteLink = (group:string, name: string) => {
        BridgeRef.current[group][name] = undefined 
    }

    const callState = (group: string, name: string) => {
        const group_methods = BridgeRef.current[group]

        if(!(name in group_methods)) return;

        const method = group_methods[name]
        if (method === undefined) return;

        method()
    }

    const establishGroup = (group: string) => {
        if( group in BridgeRef.current) return;
        BridgeRef.current[group] = {}
    }

    return ({children}) => {
        return (
            <StateControllerContext.Provider value={{ 
                createLink,
                deleteLink, 
                establishGroup,
                callState 
            }}>
                {children}
            </StateControllerContext.Provider>
        )
    }
}

type useStateLinkHook = (group: string) => [ 
    (name: string) => void, 
    (name: string, callback: () => {}) => void 
]

export const useStateLink: useStateLinkHook = (group) => {
    const BridgeMethods = useContext(StateControllerContext)

    if(BridgeMethods === null) throw Error("Bridge Not Created");

    BridgeMethods.establishGroup(group)

    return [
        (name) => {
            BridgeMethods.callState(group, name)
        },
        (name, callback) => {
            useEffect(() => {
                BridgeMethods.createLink(group, name, callback)

                return () => {
                    BridgeMethods.deleteLink(group, name)
                }
            })
        }
    ]
}

interface LocalStorageMethods<Casted> {
    get(key: string, fallback: Casted): Casted
    get(key: string): Casted | undefined
    set(key: string, set: Casted): void
    check(key: string): boolean
    remove(key: string): void
    purge(): void
}

type localStorageFunction = <Casted = unknown>(
    bucket_name: string,
    castingFunction?: (value: string) => Casted
) => LocalStorageMethods<Casted>

export const localStore:localStorageFunction = ( 
        bucket_name, castingFunction
) => {
    return {
        get: (key, fallback = undefined) => {
            const result = localStorage.getItem(`${bucket_name}.${key}`)
            
            if(result === null) return fallback;
            
            return (
                castingFunction === undefined? 
                    JSON.parse(result):
                    castingFunction(result)
            )
        },
        set: (key, set) => {
            const bucket_item = localStorage.getItem(`${bucket_name}.${key}`)
            const bucket = localStorage.getItem(bucket_name) ?? ""

            if(bucket_item === null) localStorage.setItem(bucket_name, `${bucket},${key}`);

            localStorage.setItem(`${bucket_name}.${key}`, JSON.stringify(set))
        },
        check: (key) => localStorage.getItem(`${bucket_name}.${key}`) !== null,
        remove: (key) => localStorage.removeItem(`${bucket_name}.${key}`),
        purge: () => {
            const bucket = localStorage.getItem(bucket_name) ?? ""
            bucket.split(",").forEach(key => {
                if(key !== "") localStorage.removeItem(`${bucket_name}.${key}`);
            })
        }
    }
}