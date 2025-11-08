import io from "socket.io-client"
import { loadUserConfig } from "../utils/config.ts"

const config = await loadUserConfig()
let BACKEND_URL = `http://${config.backend.host}:${config.backend.port}`

const socket = io(BACKEND_URL)

type InvokeOptions = {
  error?: string
  result: string
}

export const invoke = (funcName: string, args = {}) => {

  return new Promise((resolve, reject) => {
    
    socket.emit("invoke", { func: funcName, args });
    
    socket.once("response", (options: InvokeOptions) => {
    
      if (options.error) reject(new Error(options.error));
      else resolve(options.result);
    
    });
  
  });

}

// Base Events

export const onEvent = (event: string, callback: () => void) => {
  socket.on(event, callback)
}

type SharedValueEventOptions<T> = {
  value_key: string
  value: T
}

export function useSharedValue<T>(sharedValueKey: string, onChange: (value: T) => void, initValue?: T) {
  if (!socket || !socket.connected) {
    console.warn("Socket not connected yet.");
    return [initValue, () => {}];
  }

  let value: T | undefined = initValue;

  const events = {
    onChange: "back_update_shared_value",
    setChange: "front_update_shared_value",
    getInitValue: "shared_value_init"
  }

  socket.once("shared_value_init", (options: SharedValueEventOptions<T>) => {
    if (options.value_key === sharedValueKey) {
      value = options.value;
      onChange(value);
    }
  });

  const setChange = (_value: T) => {
    socket.emit(events.setChange, {
      value_key: sharedValueKey,
      value
    })
    value = _value
    onChange(value)
  }

  socket.on(events.onChange, (options: SharedValueEventOptions<T>) => {
    if (options.value_key !== sharedValueKey) return
    value = options.value
    onChange(value)
  })

  return [value, setChange]

}
