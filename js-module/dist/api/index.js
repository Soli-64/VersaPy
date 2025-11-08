import io from "socket.io-client";
import { loadUserConfig } from "../utils/config.ts";
const config = await loadUserConfig();
let BACKEND_URL = `http://${config.backend.host}:${config.backend.port}`;
const socket = io(BACKEND_URL);
export const invoke = (funcName, args = {}) => {
    return new Promise((resolve, reject) => {
        socket.emit("invoke", { func: funcName, args });
        socket.once("response", (options) => {
            if (options.error)
                reject(new Error(options.error));
            else
                resolve(options.result);
        });
    });
};
// Base Events
export const onEvent = (event, callback) => {
    socket.on(event, callback);
};
export function useSharedValue(sharedValueKey, onChange, initValue) {
    if (!socket || !socket.connected) {
        console.warn("Socket not connected yet.");
        return [initValue, () => { }];
    }
    let value = initValue;
    const events = {
        onChange: "back_update_shared_value",
        setChange: "front_update_shared_value",
        getInitValue: "shared_value_init"
    };
    socket.once("shared_value_init", (options) => {
        if (options.value_key === sharedValueKey) {
            value = options.value;
            onChange(value);
        }
    });
    const setChange = (value) => {
        socket.emit(events.setChange, {
            value_key: sharedValueKey,
            value
        });
    };
    socket.on(events.onChange, (options) => {
        if (options.value_key !== sharedValueKey)
            return;
        value = options.value;
        onChange(value);
    });
    return [value, setChange];
}
