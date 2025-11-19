export declare function invoke<T>(funcName: string, args?: Record<string, any>): Promise<T>;

export type SharedValue<T> = {
  value: T | null;
};

export declare function createSharedValue<T>(
  sharedValueKey: string,
  onChange: (value: T) => void
): [SharedValue<T>, (value: T) => void];