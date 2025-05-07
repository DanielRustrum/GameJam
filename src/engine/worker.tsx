/**
 * Creates a dynamic, type-safe service worker with bi-directional communication.
 * 
 * This utility provides send, receive, poll, stop, and reactive onMessage APIs 
 * for both the main thread and the worker, allowing you to write Go-style 
 * message handling in TypeScript.
 * 
 * @template MainToWorker Type of messages sent from main thread to worker
 * @template WorkerToMain Type of messages sent from worker to main thread
 * 
 * @param {(api: {
*   send: (message: WorkerToMain) => void;
*   receive: () => Promise<MainToWorker>;
*   poll: () => MainToWorker | undefined;
*   stop: () => void;
*   onMessage: (callback: (msg: MainToWorker) => void) => () => void;
* }) => void} workerFn The worker function, which receives an API object
* and runs inside the service worker.
* 
* @returns {
*  [ run: () => Promise<void>;
* {
*   send: (message: MainToWorker) => void;
*   receive: () => Promise<WorkerToMain>;
*   poll: () => WorkerToMain | undefined;
*   stop: () => Promise<void>;
*   onMessage: (callback: (msg: WorkerToMain) => void) => () => void;
* }]}
* An object containing methods for controlling the worker from the main thread.
*/
export function addWorkerFunction<MainToWorker, WorkerToMain>(
    workerFn: (
        api: {
            send: (message: WorkerToMain) => void
            receive: () => Promise<MainToWorker>
            poll: () => MainToWorker | undefined
            stop: () => void
            subscribe: (callback: (msg: MainToWorker) => void) => () => void
        }
    ) => void
):[ 
    start: () => Promise<void>, 
    {
       send: (message: MainToWorker) => void
       receive: () => Promise<WorkerToMain>
       poll: () => WorkerToMain | undefined
       stop: () => void
       subscribe: (callback: (msg: WorkerToMain) => void) => () => void
    }
] {
    const workerBootstrap = function <MainToWorker, WorkerToMain>(
        workerFn: (
            api: {
                send: (message: WorkerToMain) => void
                receive: () => Promise<MainToWorker>
                poll: () => MainToWorker | undefined
                stop: () => void
                subscribe: (callback: (msg: MainToWorker) => void) => () => void
            }
        ) => void
    ) {
        const messageQueue: MainToWorker[] = []
        const pendingReceivers: ((value: MainToWorker) => void)[] = []

        function send(message: WorkerToMain) {
            postMessage(message)
        }

        function receive(): Promise<MainToWorker> {
            if (messageQueue.length > 0) {
                const value = messageQueue.shift()
                if (value !== undefined) return Promise.resolve(value);
            }
            return new Promise(resolve => {
                pendingReceivers.push(resolve)
            });
        }

        function poll() {
            return messageQueue.shift()
        }

        function subscribe(callback: (msg: MainToWorker) => void) {
            const handler = (event: MessageEvent) => {
                callback(event.data as MainToWorker)
            };
            self.addEventListener('message', handler)
            return () => self.removeEventListener('message', handler)
        }

        function stop() {
            close()
        }

        self.addEventListener('message', event => {
            const msg = event.data as MainToWorker

            if (pendingReceivers.length > 0) {
                const resolver = pendingReceivers.shift()
                if (resolver) resolver(msg);
            } else {
                messageQueue.push(msg)
            }
        })

        workerFn({ send, receive, poll, stop, subscribe })
    }

    const workerCode = `(${workerBootstrap.toString()})(${workerFn.toString()})`
    const workerUrl = URL.createObjectURL(
        new Blob([workerCode], { type: 'application/javascript' })
    )

    let worker: null | Worker = null
    const messageQueue: WorkerToMain[] = []
    const pendingReceivers: ((value: WorkerToMain) => void)[] = []

    const send = (message: MainToWorker): void => {
        if(worker === null) return;
        
        worker.postMessage(message)
    }

    const receive = async (): Promise<WorkerToMain> => {
        if (messageQueue.length > 0) {
            return messageQueue.shift()!
        }
        return new Promise(resolve => {
            pendingReceivers.push(resolve)
        })
    }

    const poll = (): WorkerToMain | undefined => {
        return messageQueue.shift()
    }

    const subscribe = (callback: (msg: WorkerToMain) => void): (() => void) => {
        if(worker === null) throw new Error("Run Not Called");

        const handler = (event: MessageEvent) => {
            const message = event.data as WorkerToMain
            callback(message)
        };
        worker.addEventListener('message', handler)
        return () => {
            if(worker === null) throw new Error("Run Not Called; How did you even get this far?");
        
            worker.removeEventListener('message', handler)
        }
    }

    const stop = (): void => {
        if(worker === null) throw new Error("Run Not Called");
        
        worker.terminate()
        messageQueue.length = 0
        pendingReceivers.length = 0
    }

   

    const start = async (): Promise<void> => {
        worker = new Worker(workerUrl)
        worker.addEventListener('message', (event: MessageEvent) => {
            const message = event.data as WorkerToMain
            if (pendingReceivers.length > 0) {
                const resolver = pendingReceivers.shift()
                if (resolver) resolver(message);
            } else {
                messageQueue.push(message)
            }
        })
    }

    return [start, { send, receive, poll, stop, subscribe }]
}
