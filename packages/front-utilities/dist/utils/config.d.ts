type Config = {
    backend: {
        host: string;
        port: number;
    };
    frontend: {
        host: string;
        port: number;
    };
    window: {
        title: string;
        widht: number;
        height: number;
        resizable: boolean;
        fullscreen: boolean;
    };
};
export declare function loadUserConfig(): Promise<Config>;
export {};
