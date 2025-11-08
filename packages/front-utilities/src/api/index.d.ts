
export declare function invoke(funcName: string, args?: Record<string, any>): Promise<any>;
export declare function onEvent(event: string, callback: () => void): void
export declare function useSharedValue<T>(sharedValueKey: string, onChange: (value: T) => void, initValue?: T): [T, (value: T) => void]