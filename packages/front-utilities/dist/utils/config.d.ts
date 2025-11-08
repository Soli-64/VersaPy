type Config = {
    backend: {
        host: string;
        port: string | number;
    };
};
export declare function loadUserConfig(): Promise<Config>;
export {};
