import { io } from "socket.io-client"
import { loadUserConfig } from "../utils/config.js"

export async function invoke(funcName, args = {}) {

  let BACKEND_URL;

  const config = await loadUserConfig()
  BACKEND_URL = `http://${config.backend.host}:${config.backend.port}`

  const socket = io(BACKEND_URL)
  return await new Promise((resolve, reject) => {
    
    socket.emit("invoke", { func: funcName, args });
    
    socket.once("response", (data) => {
    
      if (data.error) reject(new Error(data.error));
      else resolve(data.result);
    
    });
  
  });

}
