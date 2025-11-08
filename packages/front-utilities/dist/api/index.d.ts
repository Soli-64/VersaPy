export declare const invoke: (funcName: string, args?: {}) => Promise<unknown>;
export declare const onEvent: (event: string, callback: () => void) => void;
export declare const useSharedValue: <T>(sharedValueKey: string, onChange: (value: T) => void, initValue: T) => [T, (value: T) => void];
