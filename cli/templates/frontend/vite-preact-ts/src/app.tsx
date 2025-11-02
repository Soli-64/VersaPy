import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import { invoke } from "versapy/api"
import './app.css'

export function App() {

  const greet = async () => {
    console.log(
      await invoke("greet", {name: "World !"})
    )
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Versapy + Vite + Preact</h1>
      
      <button onClick={() => greet()}>
        Greetings From Versapy
      </button>
      
    </>
  )
}
