import io from "socket.io-client"
import { loadUserConfig } from "../utils/config.js"

const config = await loadUserConfig()
let BACKEND_URL = `http://${config.backend.host}:${config.backend.port}`
const socket = io(BACKEND_URL)

let __invokeReqCounter = 0

type InvokeOptions = {
  error?: string
  result: string
  id?: string
}

export const invoke = <T>(funcName: string, args = {}, timeoutMs = 10000) => {
  // simple incremental id generator
  const nextId = () => `${Date.now()}-${++__invokeReqCounter}`

  const id = nextId()
  console.log("invoke", funcName, args, "id=" + id)

  return new Promise<T>((resolve, reject) => {
    const onResponse = (options: InvokeOptions) => {
      // ignore responses that don't match our id
      if (!options) return
      if (!options.id) {
        // server didn't echo id; cannot safely match concurrent requests
        console.warn('invoke: response without id received; ignoring to avoid cross-talk')
        return
      }
      if (options.id !== id) return

      // remove listener
      socket.off("response", onResponse)
      // clear timeout then resolve/reject
      clearTimeout(to)
      if (options.error) return reject(new Error(options.error))
      return resolve(options.result as T)
    }

    // attach listener
    socket.on("response", onResponse)

    // send request with id so the server can echo it back
    socket.emit("invoke", { func: funcName, args, id })

    // timeout safety
    const to = setTimeout(() => {
      socket.off("response", onResponse)
      reject(new Error("invoke timeout"))
    }, timeoutMs)
  })
}

type SharedValueEventOptions<T> = {
  value_key: string
  value: T
}

export const createSharedValue = async <T>(
  sharedValueKey: string,
  onChange: (value: T) => void,
): Promise<[ T | null, (value: T) => void]> => {
  
  let sharedValue: T | null = null;

  const events = {
    onUpdate: "back_update_shared_value",
    setUpdate: "front_update_shared_value",
  }

  console.log("Fetching initial shared value for key:", sharedValueKey)
  const r = await invoke<T>("get_shared_value", { key: sharedValueKey })
  console.log(r, "initial shared value")
  sharedValue = r
  onChange(sharedValue)

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
