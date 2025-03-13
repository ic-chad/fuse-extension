import { sendToBackground, sendToBackgroundViaRelay } from '@plasmohq/messaging';

const call_with_timeout = async <T>(timeout: number, call: Promise<T>): Promise<T | undefined> => {
    return await Promise.race([
        call,
        new Promise<T | undefined>((resolve) => setTimeout(() => resolve(undefined), timeout)),
    ]);
};

export const message_with_timeout = async <B, T>(
    name: string,
    body?: B,
    timeout = 30000, // default 30s
): Promise<T | undefined> => {
    const s = Date.now();
    return await call_with_timeout(
        timeout,
        new Promise<T | undefined>((resolve, reject) => {
            sendToBackground<B, T>({ name: name as never, body })
                .then((d) => {
                    const e = Date.now();
                    console.debug(`message ${name} spend ${e - s}ms.`, [body, '->', d]);
                    resolve(d);
                })
                .catch(reject);
        }),
    );
};

export const relay_message_with_timeout = async <B, T>(
    name: string,
    body?: B,
    timeout = 30000, // default 30s
): Promise<T | undefined> => {
    const s = Date.now();
    return await call_with_timeout(
        timeout,
        new Promise<T | undefined>((resolve, reject) => {
            sendToBackgroundViaRelay({ name: name as never, body })
                .then((d) => {
                    const e = Date.now();
                    console.debug(`relay message ${name} spend ${e - s}ms.`, [body, '->', d]);
                    resolve(d);
                })
                .catch(reject);
        }),
    );
};
