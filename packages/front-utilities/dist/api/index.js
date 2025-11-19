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
export const createSharedValue = (sharedValueKey, onChange) => {
    let sharedValue = null;
    const events = {
        onUpdate: "back_update_shared_value",
        setUpdate: "front_update_shared_value",
    };
    invoke("get_shared_value", { key: sharedValueKey })
        .then(initialValue => {
        console.log("Received initVal: ", initialValue);
        if (initialValue !== undefined && initialValue !== null) {
            sharedValue = initialValue;
            onChange(initialValue);
        }
    })
        .catch(console.error);
    const handleUpdate = (options) => {
        if (options.value_key === sharedValueKey) {
            sharedValue = options.value;
            onChange(options.value);
        }
    };
    socket.on(events.onUpdate, handleUpdate);
    const setValue = (_value) => {
        socket.emit(events.setUpdate, {
            value_key: sharedValueKey,
            value: _value,
        });
        sharedValue = _value;
        onChange(_value);
    };
    return [sharedValue, setValue];
};
