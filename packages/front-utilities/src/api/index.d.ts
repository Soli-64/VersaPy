
export declare function invoke<T>(funcName: string, args?: Record<string, any>): Promise<T>;
export declare function onEvent(event: string, callback: () => void): void
export declare function useSharedValue<T>(sharedValueKey: string, initValue: T, onChange: (value: T) => void): [T, (value: T) => void]