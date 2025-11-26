export declare const invoke: <T>(funcName: string, args?: {}, timeoutMs?: number) => Promise<T>;
export declare const createSharedValue: <T>(sharedValueKey: string, onChange: (value: T) => void) => Promise<[T | null, (value: T) => void]>;
