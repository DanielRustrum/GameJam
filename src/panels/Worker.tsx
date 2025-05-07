import { useEffect, useRef, useState } from "react"
import { addWorkerFunction } from "@/engine/worker"

const [start, {subscribe, send}] = addWorkerFunction<string, string>(({subscribe, send}) => {
    subscribe(msg => {
        send("Hello " + msg)
    })
})

start()


export const Panel = () => {
    const [log, setLog] = useState<string[]>([])
    const InputElement = useRef<HTMLInputElement>(null)

    useEffect(() => {
        return subscribe(message => setLog(log => [...log, message]))
    }, [])
    
    const list = log.map(line => <li>{line}</li>)

    return <>
        <p>List Here:</p>
        <ul>{list}</ul>
        <input ref={InputElement} placeholder="Send Message:"/>
        <button onClick={() => {send(InputElement.current?.value?? "")}}>Submit</button>
    </>
}

export const name = "worker"
