type MessageEnvelope<T> = {
    requestId: string;
    payload: T;
};

function workerBootstrap<MainToWorker, WorkerToMain>(
    workerFn: (api: {
        send: (message: WorkerToMain, requestId?: string) => void;
        receive: (timeoutMs?: number, signal?: AbortSignal) => Promise<MessageEnvelope<MainToWorker>>;
        poll: () => MessageEnvelope<MainToWorker> | undefined;
        stop: () => void;
    }) => void
) {
    const messageQueue: MessageEnvelope<MainToWorker>[] = [];
    const pendingReceivers: ((value: MessageEnvelope<MainToWorker>) => void)[] = [];
    const swSelf = self as unknown as ServiceWorkerGlobalScope;

    function send(message: WorkerToMain, requestId?: string) {
        swSelf.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ requestId, payload: message }));
        });
    }

    function receive(timeoutMs?: number, signal?: AbortSignal): Promise<MessageEnvelope<MainToWorker>> {
        if (messageQueue.length > 0) {
            const value = messageQueue.shift()
            if(value !== undefined) return Promise.resolve(value);
        }
        return new Promise((resolve, reject) => {
            const receiver = (msg: MessageEnvelope<MainToWorker>) => resolve(msg);
            pendingReceivers.push(receiver);

            if (timeoutMs) {
                setTimeout(() => {
                    const index = pendingReceivers.indexOf(receiver);
                    if (index !== -1) pendingReceivers.splice(index, 1);
                    reject(new Error('Receive timeout'));
                }, timeoutMs);
            }

            if (signal) {
                signal.addEventListener('abort', () => {
                    const index = pendingReceivers.indexOf(receiver);
                    if (index !== -1) pendingReceivers.splice(index, 1);
                    reject(new Error('Receive aborted'));
                });
            }
        });
    }

    function poll() {
        return messageQueue.shift();
    }

    function stop() {
        swSelf.registration.unregister().then(() => {
            self.close();
        });
    }

    swSelf.addEventListener('message', event => {
        if (pendingReceivers.length > 0) {
            const resolver = pendingReceivers.shift();
            if (resolver) resolver(event.data);
        } else {
            messageQueue.push(event.data);
        }
    });

    workerFn({ send, receive, poll, stop });
}

export function addWorkerFunction<MainToWorker, WorkerToMain>(
    workerFn: (
        api: {
            send: (message: WorkerToMain, requestId?: string) => void;
            receive: (timeoutMs?: number, signal?: AbortSignal) => Promise<MessageEnvelope<MainToWorker>>;
            poll: () => MessageEnvelope<MainToWorker> | undefined;
            stop: () => void;
        }
    ) => void
): {
    run: () => Promise<void>;
    send: (message: MainToWorker) => Promise<MessageEnvelope<WorkerToMain>>
    receive: (timeoutMs?: number, signal?: AbortSignal) => Promise<MessageEnvelope<WorkerToMain>>
    poll: () => MessageEnvelope<WorkerToMain> | undefined
    stop: () => Promise<void>
} {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service Workers are not supported in this browser.');
    }

    const workerCode = `(${workerBootstrap.toString()})(${workerFn.toString()})`

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);

    let currentWorker: ServiceWorkerRegistration | null = null;
    const messageQueue: MessageEnvelope<WorkerToMain>[] = [];
    const pendingReceivers: ((value: MessageEnvelope<WorkerToMain>) => void)[] = [];
    const pendingRequests = new Map<string, (value: MessageEnvelope<WorkerToMain>) => void>();

    navigator.serviceWorker.addEventListener('message', (event) => {
        const envelope = event.data as MessageEnvelope<WorkerToMain>;
        const resolver = pendingRequests.get(envelope.requestId);
        if (resolver) {
            resolver(envelope);
            pendingRequests.delete(envelope.requestId);
        } else if (pendingReceivers.length > 0) {
            const receiver = pendingReceivers.shift();
            if (receiver) receiver(envelope);
        } else {
            messageQueue.push(envelope);
        }
    });

    const run = async (): Promise<void> => {
        currentWorker = await navigator.serviceWorker.register(swUrl);
        console.log('✅ Worker registered:', currentWorker);
    };

    const send = (message: MainToWorker): Promise<MessageEnvelope<WorkerToMain>> => {
        if (!currentWorker) throw new Error('Worker not registered. Call run() first.');
        const requestId = crypto.randomUUID();
        return new Promise((resolve, reject) => {
            pendingRequests.set(requestId, resolve);
            navigator.serviceWorker.ready.then((reg) => {
                const sw = reg.active;
                if (!sw) throw new Error('No active service worker to send message to.');
                sw.postMessage({ requestId, payload: message });
            }).catch((err) => {
                pendingRequests.delete(requestId);
                reject(err);
            });
        });
    };

    const receive = async (timeoutMs?: number, signal?: AbortSignal): Promise<MessageEnvelope<WorkerToMain>> => {
        if (messageQueue.length > 0) {
            return messageQueue.shift()!;
        }
        return new Promise((resolve, reject) => {
            const receiver = (msg: MessageEnvelope<WorkerToMain>) => resolve(msg);
            pendingReceivers.push(receiver);

            if (timeoutMs) {
                setTimeout(() => {
                    const index = pendingReceivers.indexOf(receiver);
                    if (index !== -1) pendingReceivers.splice(index, 1);
                    reject(new Error('Receive timeout'));
                }, timeoutMs);
            }

            if (signal) {
                signal.addEventListener('abort', () => {
                    const index = pendingReceivers.indexOf(receiver);
                    if (index !== -1) pendingReceivers.splice(index, 1);
                    reject(new Error('Receive aborted'));
                });
            }
        });
    };

    const poll = (): MessageEnvelope<WorkerToMain> | undefined => {
        return messageQueue.shift();
    };

    const stop = async (): Promise<void> => {
        if (!currentWorker) return;
        await currentWorker.unregister();
        currentWorker = null;
        messageQueue.length = 0;
        pendingReceivers.length = 0;
        console.log('🛑 Worker unregistered and stopped from main thread');
    };

    return { run, send, receive, poll, stop };
}
