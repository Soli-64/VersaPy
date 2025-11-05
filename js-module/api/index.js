import { io } from "socket.io-client"
import { loadUserConfig } from "../utils/config.js"

const config = await loadUserConfig()
let BACKEND_URL = `http://${config.backend.host}:${config.backend.port}`

const socket = io(BACKEND_URL)

export const invoke = (funcName, args = {}) => {

  return new Promise((resolve, reject) => {
    
    socket.emit("invoke", { func: funcName, args });
    
    socket.once("response", (data) => {
    
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    
    });
  
  });

}

// Base Events

export const onEvent = (event, callback) => {
  socket.on(event, callback)
}

// Signals

export function newSignal(name) {
  let value = null
  const listeners = new Set()

  const sig = {
    subscribe(fn) {
      listeners.add(fn)
      if (value !== null) fn(value)
      return () => listeners.delete(fn)
    },
    get() {
      return value
    }
  }

  socket.on("signal_update", (data) => {
    if (data.name === name) {
      value = data.value
      listeners.forEach((fn) => fn(value))
    }
  })

  return sig
}
