import io from "socket.io-client"
import { loadUserConfig } from "../utils/config.js"

const config = await loadUserConfig()
let BACKEND_URL = `http://${config.backend.host}:${config.backend.port}`
const socket = io(BACKEND_URL)

type InvokeOptions = {
  error?: string
  result: string
}

export const invoke = <T>(funcName: string, args = {}) => {

  return new Promise<T>((resolve, reject) => {
    
    socket.emit("invoke", { func: funcName, args });
    
    socket.once("response", (options: InvokeOptions) => {
    
      if (options.error) reject(new Error(options.error));
      else resolve(options.result as T);
    
    });
  
  });

}

type SharedValueEventOptions<T> = {
  value_key: string
  value: T
}

export const createSharedValue = <T>(
  sharedValueKey: string,
  onChange: (value: T) => void
): [ T | null, (value: T) => void] => {
  
  let sharedValue: T | null = null;

  const events = {
    onUpdate: "back_update_shared_value",
    setUpdate: "front_update_shared_value",
  }

  invoke<T>("get_shared_value", { key: sharedValueKey })
    .then(initialValue => {
      if (initialValue !== undefined && initialValue !== null) {
        sharedValue = initialValue
        onChange(initialValue)
      }
    })
    .catch(console.error)

  const handleUpdate = (options: SharedValueEventOptions<T>) => {
    if (options.value_key === sharedValueKey) {
      sharedValue = options.value
      onChange(options.value)
    }
  }
  socket.on(events.onUpdate, handleUpdate)

  const setValue = (_value: T) => {
    socket.emit(events.setUpdate, {
      value_key: sharedValueKey,
      value: _value,
    })
    sharedValue = _value
    onChange(_value)
  }

  return [sharedValue, setValue]
}
