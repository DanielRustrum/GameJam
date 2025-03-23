import { createContext, useRef, ReactNode, FC, useContext, useEffect } from "react"

type BridgeData = {
    [group: string]:{ 
        [link: string]: CallableFunction | undefined
    } 
}

interface BridgeContextMethods {
    createLink: (group:string, name: string, callback: Function) => void
    deleteLink: (group:string, name: string) => void
    getGroup: <GroupName extends string>(group: GroupName) => BridgeData[GroupName]
    establishGroup: <GroupName extends string>(group: GroupName) => void
}

type setupBridgeHook = () => FC<{children: ReactNode}> 

const BridgeContext = createContext<BridgeContextMethods | null>(null)

export const setupBridge: setupBridgeHook = () => {
    const BridgeRef = useRef<BridgeData>({})

    
    const createLink = (group:string, name: string, callback: Function) => {
        BridgeRef.current[group][name] = callback
    }

    const deleteLink = (group:string, name: string) => {
        BridgeRef.current[group][name] = undefined 
    }

    const getGroup = (group: string) => {
        return BridgeRef.current[group]
    }

    const establishGroup = (group: string) => {
        if( group in BridgeRef.current) return;
        BridgeRef.current[group] = {}
    }

    return ({children}) => {
        return (
            <BridgeContext.Provider value={{ createLink, getGroup, deleteLink, establishGroup }}>
                {children}
            </BridgeContext.Provider>
        )
    }
}

type useBridgeHook = <GroupName extends string>(group: GroupName) => [ 
    (name: string, ...args: unknown[]) => unknown | undefined, 
    (name: string, callback: Function) => void 
]

export const useBridge: useBridgeHook = (group) => {
    const BridgeMethods = useContext(BridgeContext)

    if(BridgeMethods === null) throw Error("Bridge Not Created");

    BridgeMethods.establishGroup(group)

    return [
        (name, ...args: unknown[]) => {
            const group_methods = BridgeMethods.getGroup(group)

            if(!(name in group_methods)) return;

            const method = group_methods[name]
            if (method === undefined) return;

            return method(...args)
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