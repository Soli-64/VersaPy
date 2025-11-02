import { invoke } from 'versapy/api'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
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
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Versapy + Vite + Solid</h1>
      <button onClick={() => greet()}>
          Greetings from Versapy
      </button>
    </>
  )
}

export default App
