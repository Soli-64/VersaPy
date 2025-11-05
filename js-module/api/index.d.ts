
export declare function invoke(funcName: string, args?: Record<string, any>): Promise<any>;
export declare function onEvent(event: string, callback: Function): void
export declare function newSignal(name: string): {subscribe: Function, get: Function}
