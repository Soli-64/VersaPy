import io from "socket.io-client";
import { loadUserConfig } from "../utils/config.js";
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
export const useSharedValue = (sharedValueKey, onChange, initValue) => {
    let value = initValue;
    const events = {
        onChange: "back_update_shared_value",
        setChange: "front_update_shared_value"
    };
    const setChange = (_value) => {
        console.log("Sent: ", {
            value_key: sharedValueKey,
            value: _value
        });
        socket.emit(events.setChange, {
            value_key: sharedValueKey,
            value: _value
        });
        value = _value;
        onChange(_value);
    };
    socket.on(events.onChange, (options) => {
        if (options.value_key !== sharedValueKey)
            return;
        value = options.value;
        onChange(value);
    });
    return [value, setChange];
};
