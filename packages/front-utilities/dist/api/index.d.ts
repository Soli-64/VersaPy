export declare const invoke: (funcName: string, args?: {}) => Promise<unknown>;
export declare const onEvent: (event: string, callback: () => void) => void;
export declare function useSharedValue<T>(sharedValueKey: string, onChange: (value: T) => void, initValue?: T): (T | ((_value: T) => void) | undefined)[];
