import { RefObject, useEffect, useRef, useState } from "react"
import { addWorker } from "@/engine/worker"
import { BackToDemoMenu } from "@/components/Game/BackToDemo"

const [start, { subscribe, send }] = addWorker<string, [string, string], { message: string }>(({ subscribe, send, data }) => {
    subscribe(msg => {
        setTimeout(() => {
            send([
                new Date().toISOString().replace("T", " ").replace("Z", "").split(".")[0],
                data.message + msg
            ])
        }, 1000)
    })
})


start({ message: "Hello! " })

const workerHook = () => {
    const [log, setLog] = useState<JSX.Element[]>([])
    const [wait, setWait] = useState<JSX.Element[]>([])

    useEffect(() => {
        return subscribe(message => {
            setWait(wait => wait.slice(0, -1))
            setLog(log => [
                ...log,
                <li key={log.length} className="flex gap-3">
                    <b>{message[0]}</b>
                    <i style={{ whiteSpace: "pre" }}>{message[1]}</i>
                </li>
            ])
        })
    }, [])

    return {
        list: [log, wait],
        set: (ref: RefObject<HTMLInputElement>) => () => {
            send(ref.current?.value ?? "")
            setWait(wait => [...wait, <li key={wait.length}>Waiting...</li>])
        }
    }
}

export const Panel = () => {
    const InputElement = useRef<HTMLInputElement>(null)
    const { list, set } = workerHook()


    return <>
        <p className="text-center text-2xl font-bold pb-10 pt-10">Web Worker Demo</p>
        <div className="flex justify-center pb-10 gap-10">
            <input
                className="border-2 border-black rounded-2xl p-3 focus-within:scale-105 placeholder-gray-700"
                ref={InputElement}
                placeholder="Send Message:"
            />
            <button
                className="border-2 p-3 pl-5 pr-5 border-black rounded-2xl hover:scale-105"
                onClick={set(InputElement)}
            >
                Submit
            </button>
        </div>
        <p className="text-center font-bold underline pb-5">Log</p>
        <ul className=" flex flex-col items-center">{list}</ul>
        <BackToDemoMenu />
    </>
}

export const name = "worker"
