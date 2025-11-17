import io from "socket.io-client"
import { loadUserConfig } from "../utils/config.js"

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

export const useSharedValue = <T>(sharedValueKey: string, initValue: T, onChange: (value: T) => void): [T, (value: T) => void] => {

  let value: T = initValue;

  const events = {
    onChange: "back_update_shared_value",
    setChange: "front_update_shared_value"
  }

  const setChange = (_value: T) => {
    console.log("Sent: ", {
      value_key: sharedValueKey,
      value: _value
    })
    socket.emit(events.setChange, {
      value_key: sharedValueKey,
      value: _value
    })
    value = _value
    onChange(_value)
  }

  socket.on(events.onChange, (options: SharedValueEventOptions<T>) => {
    if (options.value_key !== sharedValueKey) return
    value = options.value
    onChange(value)
  })

  return [value, setChange];

}
