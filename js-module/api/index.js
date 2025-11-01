import { io } from "socket.io-client"


export function invoke(funcName, args = {}) {
  let BACKEND_URL = "http://localhost:5000";
  const socket = io(BACKEND_URL)
  return new Promise((resolve, reject) => {
    socket.emit("invoke", { func: funcName, args });
    socket.once("response", (data) => {
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    });
  });
}
