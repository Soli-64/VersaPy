export declare const invoke: <T>(funcName: string, args?: {}) => Promise<T>;
export declare const createSharedValue: <T>(sharedValueKey: string, onChange: (value: T) => void) => [T | null, (value: T) => void];
