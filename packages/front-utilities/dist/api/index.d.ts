export declare const invoke: (funcName: string, args?: {}) => Promise<unknown>;
export declare const onEvent: (event: string, callback: () => void) => void;
export declare const useSharedValue: <T>(sharedValueKey: string, initValue: T, onChange: (value: T) => void) => [T, (value: T) => void];
