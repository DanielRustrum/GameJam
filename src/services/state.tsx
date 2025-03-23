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